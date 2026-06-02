import { useCallback, useEffect, useState } from 'react';
import { liveQuery } from 'dexie';
import db from '../db/database';
import { useSyncStore } from '../sync/syncStore';
import type { FeedPurchase, FeedUsageLog, FeedStock } from '../types/models';
import { isFeedStockLow } from '../lib/calculations';

export function useFeedInventory() {
  const incrementPending = useSyncStore((s) => s.incrementPending);

  // ── Feed Stock ──
  const [stock, setStock] = useState<FeedStock | null>(null);
  const [stockLoading, setStockLoading] = useState(true);

  useEffect(() => {
    const sub = liveQuery(() => db.feedStock.get('main')).subscribe({
      next: (data) => { setStock(data ?? null); setStockLoading(false); },
      error: () => setStockLoading(false),
    });
    return () => sub.unsubscribe();
  }, []);

  const initStock = useCallback(async () => {
    const existing = await db.feedStock.get('main');
    if (!existing) {
      const now = new Date().toISOString();
      await db.feedStock.put({
        id: 'main',
        currentStockKg: 0,
        lastUpdated: now,
        dailyAvgConsumptionKg: 0,
        lowStockThresholdKg: 150,
      });
    }
  }, []);

  const updateStock = useCallback(async (data: Partial<Omit<FeedStock, 'id' | 'lastUpdated'>>) => {
    await db.feedStock.update('main', { ...data, lastUpdated: new Date().toISOString() });
    incrementPending();
  }, [incrementPending]);

  // ── Feed Usage Logs ──
  const [usageLogs, setUsageLogs] = useState<FeedUsageLog[]>([]);
  const [usageLoading, setUsageLoading] = useState(true);

  useEffect(() => {
    const sub = liveQuery(() =>
      db.feedUsageLogs.orderBy('date').reverse().toArray()
    ).subscribe({
      next: (data) => { setUsageLogs(data); setUsageLoading(false); },
      error: () => setUsageLoading(false),
    });
    return () => sub.unsubscribe();
  }, []);

  const addUsageLog = useCallback(async (data: Omit<FeedUsageLog, 'id' | 'createdAt' | 'updatedAt' | 'syncedAt'>): Promise<string> => {
    const now = new Date().toISOString();
    const id = await db.feedUsageLogs.add({ ...data, createdAt: now, updatedAt: now } as FeedUsageLog);
    // Decrease stock
    const current = await db.feedStock.get('main');
    if (current) {
      const newStock = Math.max(0, current.currentStockKg - data.quantityKg);
      await db.feedStock.update('main', { currentStockKg: newStock, lastUpdated: now });
    }
    incrementPending();
    return String(id);
  }, [incrementPending]);

  // ── Feed Purchases ──
  const [purchases, setPurchases] = useState<FeedPurchase[]>([]);
  const [purchasesLoading, setPurchasesLoading] = useState(true);

  useEffect(() => {
    const sub = liveQuery(() =>
      db.feedPurchases.orderBy('date').reverse().toArray()
    ).subscribe({
      next: (data) => { setPurchases(data); setPurchasesLoading(false); },
      error: () => setPurchasesLoading(false),
    });
    return () => sub.unsubscribe();
  }, []);

  const addPurchase = useCallback(async (data: Omit<FeedPurchase, 'id' | 'totalCost' | 'createdAt' | 'updatedAt' | 'syncedAt'>): Promise<string> => {
    const now = new Date().toISOString();
    const totalCost = data.quantity * data.costPerUnit;
    const id = await db.feedPurchases.add({ ...data, totalCost, createdAt: now, updatedAt: now } as FeedPurchase);
    // Increase stock
    const current = await db.feedStock.get('main');
    if (current) {
      const qtyInKg = data.unit === 'kg' ? data.quantity : data.quantity * 25; // assume 25kg per bag
      await db.feedStock.update('main', {
        currentStockKg: current.currentStockKg + qtyInKg,
        lastUpdated: now,
      });
    }
    incrementPending();
    return String(id);
  }, [incrementPending]);

  const deletePurchase = useCallback(async (id: string) => {
    await db.feedPurchases.delete(id);
    incrementPending();
  }, [incrementPending]);

  const isLow = stock ? isFeedStockLow(
    stock.currentStockKg,
    stock.dailyAvgConsumptionKg || 50,
    Math.ceil(stock.lowStockThresholdKg / (stock.dailyAvgConsumptionKg || 50)),
  ) : false;

  return {
    stock,
    stockLoading,
    initStock,
    updateStock,
    usageLogs,
    usageLoading,
    addUsageLog,
    purchases,
    purchasesLoading,
    addPurchase,
    deletePurchase,
    isLow,
  };
}
