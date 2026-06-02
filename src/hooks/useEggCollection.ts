import { useCallback, useEffect, useState } from 'react';
import { liveQuery } from 'dexie';
import { useSyncStore } from '../sync/syncStore';
import db from '../db/database';
import type { EggCollection } from '../types/models';

export function useEggCollection() {
  const [todayEntry, setTodayEntry] = useState<EggCollection | null>(null);
  const [recentEntries, setRecentEntries] = useState<EggCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const incrementPending = useSyncStore((s) => s.incrementPending);

  const today = new Date().toISOString().split('T')[0];

  // Live query: today's entry
  useEffect(() => {
    const sub = liveQuery(() =>
      db.eggCollections
        .where('date')
        .equals(today)
        .first()
    ).subscribe({
      next: (entry) => {
        setTodayEntry(entry ?? null);
        setIsLoading(false);
      },
      error: () => setIsLoading(false),
    });

    return () => sub.unsubscribe();
  }, [today]);

  // Live query: last 7 days (excluding today)
  useEffect(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const from = sevenDaysAgo.toISOString().split('T')[0];

    const sub = liveQuery(() =>
      db.eggCollections
        .where('date')
        .between(from, today, true, false)
        .reverse()
        .toArray()
    ).subscribe({
      next: (entries) => {
        const filtered = entries.filter((e) => e.date !== today);
        setRecentEntries(filtered);
      },
      error: () => {},
    });

    return () => sub.unsubscribe();
  }, [today]);

  // Save a new egg collection entry
  const saveEntry = useCallback(
    async (data: Omit<EggCollection, 'id' | 'createdAt' | 'updatedAt' | 'syncedAt'>): Promise<EggCollection> => {
      const now = new Date().toISOString();
      const entry: EggCollection = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      // Check for existing entry on same date
      const existing = await db.eggCollections
        .where('date')
        .equals(data.date)
        .first();

      if (existing) {
        // Update existing entry
        const updated = { ...existing, ...data, updatedAt: now };
        await db.eggCollections.put(updated);
        incrementPending();
        return updated;
      }

      // Create new entry
      const id = await db.eggCollections.add(entry as EggCollection);
      incrementPending();
      return { ...entry, id } as EggCollection;
    },
    [incrementPending]
  );

  // Update an existing entry
  const updateEntry = useCallback(
    async (id: string, data: Partial<Pick<EggCollection, 'quantity' | 'notes'>>): Promise<void> => {
      const now = new Date().toISOString();
      await db.eggCollections.update(id, { ...data, updatedAt: now });
      incrementPending();
    },
    [incrementPending]
  );

  // Delete an entry
  const deleteEntry = useCallback(
    async (id: string): Promise<void> => {
      await db.eggCollections.delete(id);
      incrementPending();
    },
    [incrementPending]
  );

  // Get entries for a date range
  const getEntriesInRange = useCallback(
    async (from: string, to: string): Promise<EggCollection[]> => {
      return db.eggCollections
        .where('date')
        .between(from, to, true, true)
        .toArray();
    },
    []
  );

  return {
    todayEntry,
    recentEntries,
    isLoading,
    saveEntry,
    updateEntry,
    deleteEntry,
    getEntriesInRange,
    todayDate: today,
  };
}
