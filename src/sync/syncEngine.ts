import db from '../db/database';
import { useSyncStore } from './syncStore';
import {
  pushBatch,
  pullCollection,
  COLLECTIONS,
  type CollectionName,
} from '../firebase/firestore';

/**
 * Sync directions
 */
export type SyncDirection = 'push' | 'pull' | 'both';

/**
 * Sync result summary
 */
export interface SyncResult {
  pushed: number;
  pulled: number;
  errors: string[];
  durationMs: number;
}

/**
 * Sync status type matching the app store
 */
export type SyncStatus = 'synced' | 'pending' | 'error' | 'offline';

/**
 * Map Dexie table names to Firestore collection names.
 * Returns entries that have `syncedAt === undefined` (not yet synced).
 */
async function getUnsyncedEntries(tableName: string): Promise<{ id: string; data: Record<string, unknown> }[]> {
  const table = db.table(tableName);
  const all = await table.toArray();
  return all
    .filter((entry: Record<string, unknown>) => !entry.syncedAt)
    .map((entry: Record<string, unknown>) => ({
      id: String(entry.id),
      data: { ...entry },
    }));
}

/**
 * Mark entries as synced in Dexie after successful push.
 */
async function markSynced(tableName: string, ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const table = db.table(tableName);
  const now = new Date().toISOString();
  await table
    .where('id')
    .anyOf(ids)
    .modify({ syncedAt: now });
}

/**
 * Core sync function: pushes unsynced local data to Firestore,
 * then pulls remote changes back to Dexie.
 *
 * @param direction - Which direction to sync (default: both)
 * @returns SyncResult with counts and errors
 */
export async function runSync(direction: SyncDirection = 'both'): Promise<SyncResult> {
  const startTime = Date.now();
  const result: SyncResult = { pushed: 0, pulled: 0, errors: [], durationMs: 0 };
  const store = useSyncStore.getState();

  // Don't sync if offline
  if (!store.isOnline) {
    return { ...result, durationMs: Date.now() - startTime };
  }

  try {
    // ── PUSH: Local → Firestore ──────────────────────────────
    if (direction === 'push' || direction === 'both') {
      for (const [tableName, collectionName] of Object.entries(TABLE_TO_COLLECTION_MAP)) {
        try {
          const unsynced = await getUnsyncedEntries(tableName);
          if (unsynced.length === 0) continue;

          await pushBatch(collectionName, unsynced);
          await markSynced(tableName, unsynced.map((e) => e.id));
          result.pushed += unsynced.length;
        } catch (err) {
          const msg = `Push failed for ${tableName}: ${err instanceof Error ? err.message : String(err)}`;
          result.errors.push(msg);
        }
      }
    }

    // ── PULL: Firestore → Local ──────────────────────────────
    if (direction === 'pull' || direction === 'both') {
      for (const [tableName, collectionName] of Object.entries(TABLE_TO_COLLECTION_MAP)) {
        try {
          const remoteData = await pullCollection(collectionName);
          if (remoteData.size === 0) continue;

          const table = db.table(tableName);
          let pullCount = 0;

          for (const [docId, data] of remoteData) {
            const existing = await table.get(docId);
            // Only pull if remote is newer (last-write-wins, but don't overwrite local unsynced changes)
            if (!existing || existing.syncedAt) {
              await table.put({ ...data, id: docId });
              pullCount++;
            }
          }
          result.pulled += pullCount;
        } catch (err) {
          const msg = `Pull failed for ${tableName}: ${err instanceof Error ? err.message : String(err)}`;
          result.errors.push(msg);
        }
      }
    }

    // Update the sync store
    if (result.errors.length === 0) {
      store.setLastSynced(new Date().toISOString());
      store.setPendingCount(0);
    } else {
      // Partial success — only clear pending count if nothing failed
      // Actually, even with partial errors we still synced some
      store.setLastSynced(new Date().toISOString());
      const remainingUnsynced = await countUnsynced();
      store.setPendingCount(remainingUnsynced);
    }
  } catch (err) {
    const msg = `Sync engine error: ${err instanceof Error ? err.message : String(err)}`;
    result.errors.push(msg);
  }

  result.durationMs = Date.now() - startTime;
  return result;
}

/**
 * Count all unsynced entries across all tables.
 */
async function countUnsynced(): Promise<number> {
  let total = 0;
  for (const tableName of Object.keys(TABLE_TO_COLLECTION_MAP)) {
    const table = db.table(tableName);
    const count = await table.filter((e: Record<string, unknown>) => !e.syncedAt).count();
    total += count;
  }
  return total;
}

/**
 * Map Dexie table internal names to Firestore collection name constants.
 */
const TABLE_TO_COLLECTION_MAP: Record<string, CollectionName> = {
  eggCollections: COLLECTIONS.EGG_COLLECTIONS,
  eggSales: COLLECTIONS.EGG_SALES,
  incubationBatches: COLLECTIONS.INCUBATION_BATCHES,
  ducklingHatches: COLLECTIONS.DUCKLING_HATCHES,
  duckSales: COLLECTIONS.DUCK_SALES,
  feedPurchases: COLLECTIONS.FEED_PURCHASES,
  feedUsageLogs: COLLECTIONS.FEED_USAGE_LOGS,
  expenses: COLLECTIONS.EXPENSES,
  recurringExpenseTemplates: COLLECTIONS.RECURRING_EXPENSE_TEMPLATES,
  dailyLogs: COLLECTIONS.DAILY_LOGS,
  customers: COLLECTIONS.CUSTOMERS,
  duckMortality: COLLECTIONS.DUCK_MORTALITY,
};

/**
 * Initialize the sync engine:
 * - Listen for connectivity changes
 * - Auto-sync when coming back online
 * - Periodic sync every 5 minutes
 * - Sync on app load
 */
export function initSyncEngine(): () => void {
  let syncTimer: ReturnType<typeof setInterval> | null = null;

  // Sync when coming back online
  const unsubscribe = useSyncStore.subscribe((state, prevState) => {
    if (state.isOnline && !prevState.isOnline) {
      runSync('push').catch((err) =>
        console.error('Auto-sync on reconnect failed:', err)
      );
    }
  });

  // Periodic sync every 5 minutes
  syncTimer = setInterval(() => {
    const { isOnline } = useSyncStore.getState();
    if (isOnline) {
      runSync('push').catch((err) =>
        console.error('Periodic sync failed:', err)
      );
    }
  }, 5 * 60 * 1000);

  // Initial sync on load
  setTimeout(() => {
    const { isOnline } = useSyncStore.getState();
    if (isOnline) {
      runSync('both').catch((err) =>
        console.error('Initial sync failed:', err)
      );
    }
  }, 1000);

  // Cleanup function
  return () => {
    unsubscribe();
    if (syncTimer) {
      clearInterval(syncTimer);
      syncTimer = null;
    }
  };
}
