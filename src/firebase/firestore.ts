import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
  limit,
  type DocumentData,
} from 'firebase/firestore';
import { db } from './config';

/**
 * Collection name constants to keep consistency between Dexie and Firestore.
 */
export const COLLECTIONS = {
  EGG_COLLECTIONS: 'eggCollections',
  EGG_SALES: 'eggSales',
  INCUBATION_BATCHES: 'incubationBatches',
  DUCKLING_HATCHES: 'ducklingHatches',
  DUCK_SALES: 'duckSales',
  FEED_PURCHASES: 'feedPurchases',
  FEED_USAGE_LOGS: 'feedUsageLogs',
  FEED_STOCK: 'feedStock',
  EXPENSES: 'expenses',
  RECURRING_EXPENSE_TEMPLATES: 'recurringExpenseTemplates',
  DAILY_LOGS: 'dailyLogs',
  CUSTOMERS: 'customers',
  DUCK_MORTALITY: 'duckMortality',
  DUCK_INVENTORY: 'duckInventory',
  DUCK_COHORT_MOVES: 'duckCohortMoves',
  FARM: 'farm',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

/**
 * Get a Firestore collection reference.
 */
function getCollectionRef(collectionName: CollectionName) {
  return collection(db, collectionName);
}

/**
 * Get a Firestore document reference.
 */
function getDocRef(collectionName: CollectionName, docId: string) {
  return doc(db, collectionName, docId);
}

/**
 * Push a single document to Firestore (create or overwrite).
 */
export async function pushDocument(
  collectionName: CollectionName,
  docId: string,
  data: DocumentData
): Promise<void> {
  await setDoc(getDocRef(collectionName, docId), {
    ...data,
    syncedAt: new Date().toISOString(),
  });
}

/**
 * Delete a single document from Firestore.
 */
export async function deleteDocument(
  collectionName: CollectionName,
  docId: string
): Promise<void> {
  await deleteDoc(getDocRef(collectionName, docId));
}

/**
 * Push multiple documents in a batch (atomic write).
 */
export async function pushBatch(
  collectionName: CollectionName,
  entries: { id: string; data: DocumentData }[]
): Promise<void> {
  if (entries.length === 0) return;

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  for (const entry of entries) {
    const ref = getDocRef(collectionName, entry.id);
    batch.set(ref, { ...entry.data, syncedAt: now });
  }

  await batch.commit();
}

/**
 * Pull all documents from a Firestore collection (for initial sync / full refresh).
 * Used when re-syncing from cloud to local.
 */
export async function pullCollection(
  collectionName: CollectionName,
  maxDocs: number = 500
): Promise<Map<string, DocumentData>> {
  const q = query(
    getCollectionRef(collectionName),
    orderBy('createdAt', 'desc'),
    limit(maxDocs)
  );
  const snapshot = await getDocs(q);
  const map = new Map<string, DocumentData>();

  snapshot.forEach((docSnapshot) => {
    map.set(docSnapshot.id, docSnapshot.data());
  });

  return map;
}
