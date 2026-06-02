import type { ExpenseCategory } from '../types/models';

/**
 * Calculate profit: (egg sales + duck sales) − (expenses + feed costs)
 */
export function calculateProfit(
  eggSalesRevenue: number,
  duckSalesRevenue: number,
  totalExpenses: number,
  feedCosts: number
): number {
  return eggSalesRevenue + duckSalesRevenue - totalExpenses - feedCosts;
}

/**
 * Calculate cost per duck for a given period.
 */
export function calculateCostPerDuck(
  totalCost: number,
  ducksRaised: number
): number {
  if (ducksRaised <= 0) return 0;
  return totalCost / ducksRaised;
}

/**
 * Calculate break-even: revenue needed to cover costs.
 */
export function calculateBreakEven(totalCost: number): number {
  return totalCost;
}

/**
 * Calculate profit margin percentage.
 */
export function calculateProfitMargin(profit: number, revenue: number): number {
  if (revenue <= 0) return 0;
  return Math.round((profit / revenue) * 100 * 100) / 100; // 2 decimal places
}

/**
 * Calculate daily egg collection total from an array of entries.
 */
export function sumEggCollection(entries: { quantity: number }[]): number {
  return entries.reduce((sum, e) => sum + e.quantity, 0);
}

/**
 * Calculate remaining feed days based on stock and daily consumption.
 */
export function calculateFeedDaysRemaining(
  currentStockKg: number,
  dailyAvgConsumptionKg: number
): number {
  if (dailyAvgConsumptionKg <= 0) return Infinity;
  return currentStockKg / dailyAvgConsumptionKg;
}

/**
 * Determine if feed stock is low (below threshold in days).
 */
export function isFeedStockLow(
  currentStockKg: number,
  dailyAvgConsumptionKg: number,
  lowStockThresholdDays: number
): boolean {
  const daysRemaining = calculateFeedDaysRemaining(currentStockKg, dailyAvgConsumptionKg);
  if (daysRemaining === Infinity) return false;
  return daysRemaining < lowStockThresholdDays;
}

/**
 * Calculate total from quantity and unit price.
 */
export function calculateTotal(quantity: number, pricePerUnit: number): number {
  return Math.round(quantity * pricePerUnit * 100) / 100;
}

/**
 * Check if an expense belongs to a specific category.
 */
export function isExpenseInCategory(
  category: ExpenseCategory,
  targetCategory: string
): boolean {
  return category === targetCategory;
}

/**
 * Get total expenses by category.
 */
export function getTotalByCategory(
  expenses: { category: ExpenseCategory; amount: number }[],
  category: ExpenseCategory
): number {
  return expenses
    .filter((e) => e.category === category)
    .reduce((sum, e) => sum + e.amount, 0);
}

/**
 * Determine if a new recurring expense instance should be generated.
 * Returns true if the last generated date is before the current period.
 */
export function shouldGenerateRecurringExpense(
  frequency: 'daily' | 'weekly' | 'monthly',
  lastGenerated: string | null,
  today: string
): boolean {
  if (!lastGenerated) return true;

  switch (frequency) {
    case 'daily':
      return lastGenerated !== today;
    case 'weekly': {
      const last = new Date(lastGenerated + 'T00:00:00');
      const current = new Date(today + 'T00:00:00');
      const msPerWeek = 7 * 24 * 60 * 60 * 1000;
      return current.getTime() - last.getTime() >= msPerWeek;
    }
    case 'monthly': {
      const lastMonth = lastGenerated.substring(5, 7);
      const lastYear = lastGenerated.substring(0, 4);
      const currentMonth = today.substring(5, 7);
      const currentYear = today.substring(0, 4);
      return lastMonth !== currentMonth || lastYear !== currentYear;
    }
    default:
      return true;
  }
}

/**
 * Format a number as currency (KES/UGX style, no decimals for whole numbers).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
