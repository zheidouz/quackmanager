import Dexie, { type EntityTable } from 'dexie';
import type {
  EggCollection, EggSale, IncubationBatch, DucklingHatch, DuckSale,
  FeedPurchase, FeedUsageLog, FeedStock, Expense, RecurringExpenseTemplate,
  DailyLog, Customer, FarmSettings, DuckMortality, DuckInventorySnapshot,
} from '../types/models';
import { DB_NAME, DB_VERSION } from '../lib/constants';

const db = new Dexie(DB_NAME) as Dexie & {
  eggCollections: EntityTable<EggCollection, 'id'>;
  eggSales: EntityTable<EggSale, 'id'>;
  incubationBatches: EntityTable<IncubationBatch, 'id'>;
  ducklingHatches: EntityTable<DucklingHatch, 'id'>;
  duckSales: EntityTable<DuckSale, 'id'>;
  feedPurchases: EntityTable<FeedPurchase, 'id'>;
  feedUsageLogs: EntityTable<FeedUsageLog, 'id'>;
  feedStock: EntityTable<FeedStock, 'id'>;
  expenses: EntityTable<Expense, 'id'>;
  recurringExpenseTemplates: EntityTable<RecurringExpenseTemplate, 'id'>;
  dailyLogs: EntityTable<DailyLog, 'id'>;
  customers: EntityTable<Customer, 'id'>;
  farmSettings: EntityTable<FarmSettings, 'id'>;
  duckMortality: EntityTable<DuckMortality, 'id'>;
  duckInventory: EntityTable<DuckInventorySnapshot, 'id'>;
};

db.version(DB_VERSION).stores({
  eggCollections: '++id, date, [date+id], createdAt, syncedAt',
  eggSales: '++id, date, createdAt, syncedAt',
  incubationBatches: '++id, datePlaced, expectedHatchDate, createdAt, syncedAt',
  ducklingHatches: '++id, date, incubationBatchId, createdAt, syncedAt',
  duckSales: '++id, date, createdAt, syncedAt',
  feedPurchases: '++id, date, feedType, createdAt, syncedAt',
  feedUsageLogs: '++id, date, createdAt, syncedAt',
  feedStock: 'id, lastUpdated',
  expenses: '++id, date, category, createdAt, syncedAt',
  recurringExpenseTemplates: '++id, category, frequency, createdAt',
  dailyLogs: 'id, date',
  customers: '++id, name, phone, createdAt',
  farmSettings: 'id',
  duckMortality: '++id, date, cause, createdAt, syncedAt',
  duckInventory: 'id, date',
});

export default db;
