import { useCallback, useEffect, useState } from 'react';
import { liveQuery } from 'dexie';
import db from '../db/database';
import { useSyncStore } from '../sync/syncStore';
import { calculateDuckInventory } from '../lib/calculations';
import type { DuckMortality, DuckInventorySnapshot, DuckCohortMove } from '../types/models';

export function useDuckMortality() {
  const [records, setRecords] = useState<DuckMortality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const incrementPending = useSyncStore((s) => s.incrementPending);

  useEffect(() => {
    const sub = liveQuery(() =>
      db.duckMortality.orderBy('date').reverse().toArray()
    ).subscribe({
      next: (data) => { setRecords(data); setIsLoading(false); },
      error: () => setIsLoading(false),
    });
    return () => sub.unsubscribe();
  }, []);

  const addRecord = useCallback(async (data: Omit<DuckMortality, 'id' | 'createdAt' | 'updatedAt' | 'syncedAt'>): Promise<string> => {
    if (data.quantity <= 0) throw new Error('Mortality quantity must be greater than 0');
    // Validate mortality doesn't exceed plausible live count
    const [hatches, sales] = await Promise.all([
      db.ducklingHatches.toArray(),
      db.duckSales.toArray(),
    ]);
    const totalHatched = hatches.reduce((s, h) => s + h.quantity, 0);
    const totalSold = sales.reduce((s, d) => s + d.quantity, 0);
    const totalMortality = (await db.duckMortality.toArray()).reduce((s, r) => s + r.quantity, 0);
    const liveCount = Math.max(0, totalHatched - totalSold - totalMortality);
    if (data.quantity > liveCount) {
      throw new Error(`Mortality (${data.quantity}) exceeds live duck count (${liveCount})`);
    }
    const now = new Date().toISOString();
    const id = await db.duckMortality.add({ ...data, createdAt: now, updatedAt: now } as DuckMortality);
    incrementPending();
    return String(id);
  }, [incrementPending]);

  const deleteRecord = useCallback(async (id: string) => {
    await db.duckMortality.delete(id);
    incrementPending();
  }, [incrementPending]);

  return { records, isLoading, addRecord, deleteRecord };
}

export function useDuckInventorySnapshot() {
  const [snapshot, setSnapshot] = useState<DuckInventorySnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sub = liveQuery(() =>
      db.duckInventory.orderBy('date').reverse().first()
    ).subscribe({
      next: (data) => { setSnapshot(data ?? null); setIsLoading(false); },
      error: () => setIsLoading(false),
    });
    return () => sub.unsubscribe();
  }, []);

  const saveSnapshot = useCallback(async (snap: DuckInventorySnapshot) => {
    await db.duckInventory.put(snap);
  }, []);

  return { snapshot, isLoading, saveSnapshot };
}

// ── Cohort Moves ────────────────────────────────────────────────────

export function useCohortMoves() {
  const [moves, setMoves] = useState<DuckCohortMove[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const incrementPending = useSyncStore((s) => s.incrementPending);

  useEffect(() => {
    const sub = liveQuery(() =>
      db.duckCohortMoves.orderBy('createdAt').toArray()
    ).subscribe({
      next: (data) => { setMoves(data); setIsLoading(false); },
      error: () => setIsLoading(false),
    });
    return () => sub.unsubscribe();
  }, []);

  const addMove = useCallback(async (data: Omit<DuckCohortMove, 'id' | 'createdAt'>): Promise<string> => {
    if (data.quantity <= 0) throw new Error('Move quantity must be greater than 0');
    if (data.fromGroup === data.toGroup) throw new Error('Source and target groups must be different');
    const now = new Date().toISOString();
    const id = await db.duckCohortMoves.add({ ...data, createdAt: now } as DuckCohortMove);
    incrementPending();
    return String(id);
  }, [incrementPending]);

  const deleteMove = useCallback(async (id: string) => {
    await db.duckCohortMoves.delete(id);
    incrementPending();
  }, [incrementPending]);

  return { moves, isLoading, addMove, deleteMove };
}

/**
 * Hook that computes duck inventory from raw data.
 * Call `recalculate()` after any hatch, sale, mortality, or cohort move change.
 */
export function useDuckInventory() {
  const { records: mortalityRecords } = useDuckMortality();
  const { moves: cohortMoves } = useCohortMoves();
  const { snapshot, saveSnapshot } = useDuckInventorySnapshot();
  const [inventory, setInventory] = useState<{ totalLive: number; ducklings: number; growers: number; adults: number } | null>(null);
  const [computing, setComputing] = useState(false);

  const recalculate = useCallback(async () => {
    setComputing(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const [hatches, sales, mortality, moves] = await Promise.all([
        db.ducklingHatches.toArray(),
        db.duckSales.toArray(),
        db.duckMortality.toArray(),
        db.duckCohortMoves.orderBy('createdAt').toArray(),
      ]);

      const result = calculateDuckInventory(hatches, sales, mortality, today, moves);
      setInventory(result);

      await saveSnapshot({
        id: 'current',
        date: today,
        totalLive: result.totalLive,
        ducklings: result.ducklings,
        growers: result.growers,
        adults: result.adults,
        lastCalculatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to calculate duck inventory:', err);
    } finally {
      setComputing(false);
    }
  }, [saveSnapshot]);

  // Recalculate when mortality records or cohort moves change
  useEffect(() => {
    recalculate();
  }, [mortalityRecords, cohortMoves, recalculate]);

  return {
    inventory,
    snapshot,
    computing,
    recalculate,
    totalLive: inventory?.totalLive ?? snapshot?.totalLive ?? 0,
    ducklings: inventory?.ducklings ?? snapshot?.ducklings ?? 0,
    growers: inventory?.growers ?? snapshot?.growers ?? 0,
    adults: inventory?.adults ?? snapshot?.adults ?? 0,
  };
}
