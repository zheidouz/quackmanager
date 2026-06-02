import { useCallback, useEffect, useState } from 'react';
import { liveQuery } from 'dexie';
import db from '../db/database';
import type { DailyLog } from '../types/models';

export function useDailyLog() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sub = liveQuery(() =>
      db.dailyLogs.orderBy('date').reverse().limit(30).toArray()
    ).subscribe({
      next: (data) => { setLogs(data); setIsLoading(false); },
      error: () => setIsLoading(false),
    });
    return () => sub.unsubscribe();
  }, []);

  const getLog = useCallback(async (date: string): Promise<DailyLog | null> => {
    return (await db.dailyLogs.get(date)) ?? null;
  }, []);

  const upsertLog = useCallback(async (log: DailyLog) => {
    await db.dailyLogs.put(log);
  }, []);

  // Aggregate data for a given date range and build/update daily log
  const aggregateDailyLog = useCallback(async (date: string): Promise<DailyLog> => {
    const eggCollections = await db.eggCollections.where('date').equals(date).toArray();
    const eggSales = await db.eggSales.where('date').equals(date).toArray();
    const duckSales = await db.duckSales.where('date').equals(date).toArray();
    const feedUsage = await db.feedUsageLogs.where('date').equals(date).toArray();
    const expenses = await db.expenses.where('date').equals(date).toArray();

    const eggsCollected = eggCollections.reduce((s, e) => s + e.quantity, 0);
    const eggsSold = eggSales.reduce((s, e) => s + e.quantity, 0);
    const ducksSold = duckSales.reduce((s, e) => s + e.quantity, 0);
    const feedUsedKg = feedUsage.reduce((s, e) => s + e.quantityKg, 0);
    const expensesTotal = expenses.reduce((s, e) => s + e.amount, 0);
    const eggRevenue = eggSales.reduce((s, e) => s + e.total, 0);
    const duckRevenue = duckSales.reduce((s, e) => s + e.total, 0);

    const log: DailyLog = {
      id: date,
      date,
      eggsCollected,
      eggsSold,
      ducksSold,
      feedUsedKg,
      expensesTotal,
      revenueTotal: eggRevenue + duckRevenue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.dailyLogs.put(log);
    return log;
  }, []);

  return { logs, isLoading, getLog, upsertLog, aggregateDailyLog };
}
