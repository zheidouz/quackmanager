import { useCallback, useEffect, useState } from 'react';
import { liveQuery } from 'dexie';
import db from '../db/database';
import { useSyncStore } from '../sync/syncStore';
import type { EggSale, DuckSale, Customer } from '../types/models';
import { calculateTotal } from '../lib/calculations';

export function useEggSales() {
  const [sales, setSales] = useState<EggSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const incrementPending = useSyncStore((s) => s.incrementPending);

  useEffect(() => {
    const sub = liveQuery(() =>
      db.eggSales.orderBy('date').reverse().toArray()
    ).subscribe({
      next: (data) => { setSales(data); setIsLoading(false); },
      error: () => setIsLoading(false),
    });
    return () => sub.unsubscribe();
  }, []);

  const addSale = useCallback(async (data: Omit<EggSale, 'id' | 'total' | 'createdAt' | 'updatedAt' | 'syncedAt'>): Promise<string> => {
    const now = new Date().toISOString();
    const total = calculateTotal(data.quantity, data.pricePerEgg);
    const id = await db.eggSales.add({ ...data, total, createdAt: now, updatedAt: now } as EggSale);
    incrementPending();
    return String(id);
  }, [incrementPending]);

  const deleteSale = useCallback(async (id: string) => {
    await db.eggSales.delete(id);
    incrementPending();
  }, [incrementPending]);

  const getSalesInRange = useCallback(async (from: string, to: string): Promise<EggSale[]> => {
    return db.eggSales.where('date').between(from, to, true, true).toArray();
  }, []);

  return { sales, isLoading, addSale, deleteSale, getSalesInRange };
}

export function useDuckSales() {
  const [sales, setSales] = useState<DuckSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const incrementPending = useSyncStore((s) => s.incrementPending);

  useEffect(() => {
    const sub = liveQuery(() =>
      db.duckSales.orderBy('date').reverse().toArray()
    ).subscribe({
      next: (data) => { setSales(data); setIsLoading(false); },
      error: () => setIsLoading(false),
    });
    return () => sub.unsubscribe();
  }, []);

  const addSale = useCallback(async (data: Omit<DuckSale, 'id' | 'total' | 'createdAt' | 'updatedAt' | 'syncedAt'>): Promise<string> => {
    const now = new Date().toISOString();
    const total = calculateTotal(data.quantity, data.priceEach);
    const id = await db.duckSales.add({ ...data, total, createdAt: now, updatedAt: now } as DuckSale);
    incrementPending();
    return String(id);
  }, [incrementPending]);

  const deleteSale = useCallback(async (id: string) => {
    await db.duckSales.delete(id);
    incrementPending();
  }, [incrementPending]);

  const getSalesInRange = useCallback(async (from: string, to: string): Promise<DuckSale[]> => {
    return db.duckSales.where('date').between(from, to, true, true).toArray();
  }, []);

  return { sales, isLoading, addSale, deleteSale, getSalesInRange };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sub = liveQuery(() =>
      db.customers.orderBy('name').toArray()
    ).subscribe({
      next: (data) => { setCustomers(data); setIsLoading(false); },
      error: () => setIsLoading(false),
    });
    return () => sub.unsubscribe();
  }, []);

  const addCustomer = useCallback(async (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const now = new Date().toISOString();
    const id = await db.customers.add({ ...data, createdAt: now, updatedAt: now } as Customer);
    return String(id);
  }, []);

  const deleteCustomer = useCallback(async (id: string) => {
    await db.customers.delete(id);
  }, []);

  return { customers, isLoading, addCustomer, deleteCustomer };
}
