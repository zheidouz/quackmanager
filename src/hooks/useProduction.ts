import { useCallback, useEffect, useState } from 'react';
import { liveQuery } from 'dexie';
import db from '../db/database';
import { useSyncStore } from '../sync/syncStore';
import type { IncubationBatch, DucklingHatch } from '../types/models';

export function useIncubationBatches() {
  const [batches, setBatches] = useState<IncubationBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const incrementPending = useSyncStore((s) => s.incrementPending);

  useEffect(() => {
    const sub = liveQuery(() =>
      db.incubationBatches.orderBy('datePlaced').reverse().toArray()
    ).subscribe({
      next: (data) => { setBatches(data); setIsLoading(false); },
      error: () => setIsLoading(false),
    });
    return () => sub.unsubscribe();
  }, []);

  const addBatch = useCallback(async (data: Omit<IncubationBatch, 'id' | 'createdAt' | 'updatedAt' | 'syncedAt'>): Promise<string> => {
    if (data.quantity <= 0) throw new Error('Batch quantity must be greater than 0');
    if (data.expectedHatchDate <= data.datePlaced) {
      throw new Error('Expected hatch date must be after the date placed');
    }
    const now = new Date().toISOString();
    const id = await db.incubationBatches.add({ ...data, createdAt: now, updatedAt: now } as IncubationBatch);
    incrementPending();
    return String(id);
  }, [incrementPending]);

  const deleteBatch = useCallback(async (id: string) => {
    await db.incubationBatches.delete(id);
    incrementPending();
  }, [incrementPending]);

  return { batches, isLoading, addBatch, deleteBatch };
}

export function useDucklingHatches() {
  const [hatches, setHatches] = useState<DucklingHatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const incrementPending = useSyncStore((s) => s.incrementPending);

  useEffect(() => {
    const sub = liveQuery(() =>
      db.ducklingHatches.orderBy('date').reverse().toArray()
    ).subscribe({
      next: (data) => { setHatches(data); setIsLoading(false); },
      error: () => setIsLoading(false),
    });
    return () => sub.unsubscribe();
  }, []);

  const addHatch = useCallback(async (data: Omit<DucklingHatch, 'id' | 'createdAt' | 'updatedAt' | 'syncedAt'>): Promise<string> => {
    if (data.quantity <= 0) throw new Error('Hatch quantity must be greater than 0');
    if (data.incubationBatchId) {
      const batchExists = await db.incubationBatches.get(data.incubationBatchId);
      if (!batchExists) throw new Error('Referenced incubation batch not found');
    }
    const now = new Date().toISOString();
    const id = await db.ducklingHatches.add({ ...data, createdAt: now, updatedAt: now } as DucklingHatch);
    incrementPending();
    return String(id);
  }, [incrementPending]);

  const deleteHatch = useCallback(async (id: string) => {
    await db.ducklingHatches.delete(id);
    incrementPending();
  }, [incrementPending]);

  return { hatches, isLoading, addHatch, deleteHatch };
}
