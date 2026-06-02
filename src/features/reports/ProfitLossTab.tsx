import { useEffect, useState } from 'react';
import db from '../../db/database';
import { calculateProfit, calculateProfitMargin } from '../../lib/calculations';
import { EXPENSE_CATEGORIES } from '../../types/models';
import Badge from '../../components/ui/Badge';

export default function ProfitLossTab() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [stats, setStats] = useState({ eggRevenue: 0, duckRevenue: 0, totalExpenses: 0, feedCosts: 0, profit: 0, margin: 0 });
  const [loading, setLoading] = useState(true);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});

  useEffect(() => {
    const calculate = async () => {
      setLoading(true);
      const today = new Date();
      let from: string;

      switch (period) {
        case 'today':
          from = today.toISOString().split('T')[0];
          break;
        case 'week': {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          from = weekAgo.toISOString().split('T')[0];
          break;
        }
        case 'month': {
          const monthAgo = new Date(today);
          monthAgo.setDate(monthAgo.getDate() - 30);
          from = monthAgo.toISOString().split('T')[0];
          break;
        }
      }

      const to = today.toISOString().split('T')[0];

      const [eggSales, duckSales, expenses, feedPurchases] = await Promise.all([
        db.eggSales.where('date').between(from, to, true, true).toArray(),
        db.duckSales.where('date').between(from, to, true, true).toArray(),
        db.expenses.where('date').between(from, to, true, true).toArray(),
        db.feedPurchases.where('date').between(from, to, true, true).toArray(),
      ]);

      const eggRevenue = eggSales.reduce((s, e) => s + e.total, 0);
      const duckRevenue = duckSales.reduce((s, e) => s + e.total, 0);
      const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
      const feedCosts = feedPurchases.reduce((s, e) => s + e.totalCost, 0);
      const profit = calculateProfit(eggRevenue, duckRevenue, totalExpenses, feedCosts);
      const margin = calculateProfitMargin(profit, eggRevenue + duckRevenue);

      setStats({ eggRevenue, duckRevenue, totalExpenses, feedCosts, profit, margin });

      // Category breakdown
      const cats: Record<string, number> = {};
      for (const exp of expenses) {
        cats[exp.category] = (cats[exp.category] || 0) + exp.amount;
      }
      setCategoryTotals(cats);
      setLoading(false);
    };

    calculate();
  }, [period]);

  if (loading) {
    return <div className="animate-pulse space-y-3"><div className="h-24 bg-gray-200 rounded-lg" /><div className="h-12 bg-gray-200 rounded-lg" /></div>;
  }

  const totalRevenue = stats.eggRevenue + stats.duckRevenue;
  const totalCosts = stats.totalExpenses + stats.feedCosts;

  return (
    <div>
      {/* Period selector */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
        {(['today', 'week', 'month'] as const).map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors min-h-touch ${period === p ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}`}>
            {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="card">
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold text-secondary">{totalRevenue.toLocaleString()}</p>
          <div className="text-xs text-gray-400 mt-1">Eggs: {stats.eggRevenue.toLocaleString()} | Ducks: {stats.duckRevenue.toLocaleString()}</div>
        </div>
        <div className="card">
          <p className="text-xs text-gray-500">Total Costs</p>
          <p className="text-xl font-bold text-danger">{totalCosts.toLocaleString()}</p>
          <div className="text-xs text-gray-400 mt-1">Expenses: {stats.totalExpenses.toLocaleString()} | Feed: {stats.feedCosts.toLocaleString()}</div>
        </div>
      </div>

      {/* Profit */}
      <div className="card mb-4 text-center">
        <p className="text-xs text-gray-500 mb-1">Net Profit</p>
        <p className={`text-3xl font-bold ${stats.profit >= 0 ? 'text-secondary' : 'text-danger'}`}>
          {stats.profit >= 0 ? '+' : ''}{stats.profit.toLocaleString()}
        </p>
        <div className="mt-1">
          <Badge variant={stats.margin >= 0 ? 'success' : 'danger'}>
            {stats.margin >= 0 ? '+' : ''}{stats.margin}% margin
          </Badge>
        </div>
      </div>

      {/* Category breakdown */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="card">
          <p className="text-xs font-medium text-gray-500 mb-2">Expenses by Category</p>
          <div className="space-y-1.5">
            {EXPENSE_CATEGORIES.map((cat) => {
              const amount = categoryTotals[cat.value] || 0;
              if (amount === 0) return null;
              const pct = totalCosts > 0 ? Math.round((amount / totalCosts) * 100) : 0;
              return (
                <div key={cat.value} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-gray-400">{cat.icon}</span>
                  <span className="text-sm text-gray-700 flex-1">{cat.label}</span>
                  <span className="text-sm font-medium text-gray-900">{amount.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {totalRevenue === 0 && totalCosts === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No data for this period. Start recording sales and expenses.</p>
      )}
    </div>
  );
}
