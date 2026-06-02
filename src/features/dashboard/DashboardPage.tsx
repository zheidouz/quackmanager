import { useEffect, useState } from 'react';
import { useEggCollection } from '../../hooks/useEggCollection';
import { useAlerts } from '../../hooks/useAlerts';
import db from '../../db/database';
import { calculateProfit } from '../../lib/calculations';
import AlertBanner from '../../components/ui/AlertBanner';

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const { todayEntry } = useEggCollection();
  const { alerts, dismissAlert } = useAlerts();

  const [todaySales, setTodaySales] = useState(0);
  const [todayExpenses, setTodayExpenses] = useState(0);
  const [todayProfit, setTodayProfit] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const load = async () => {
      try {
        const [eggSales, duckSales, expenses] = await Promise.all([
          db.eggSales.where('date').equals(todayDate).toArray(),
          db.duckSales.where('date').equals(todayDate).toArray(),
          db.expenses.where('date').equals(todayDate).toArray(),
        ]);

        const salesTotal = eggSales.reduce((s, e) => s + e.total, 0) + duckSales.reduce((s, d) => s + d.total, 0);
        const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);
        setTodaySales(salesTotal);
        setTodayExpenses(expenseTotal);
        setTodayProfit(calculateProfit(salesTotal, 0, expenseTotal, 0));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [todayDate]);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Dashboard</h2>
      <p className="text-sm text-gray-500 mb-4">{today}</p>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-4 space-y-2">
          {alerts.slice(0, 3).map((alert) => (
            <AlertBanner
              key={alert.id}
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onDismiss={() => dismissAlert(alert.id)}
            />
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <SummaryCard icon="egg" label="Eggs Today" value={todayEntry ? String(todayEntry.quantity) : '--'} color="text-accent" />
        <SummaryCard icon="payments" label="Sales Today" value={loading ? '--' : todaySales.toLocaleString()} color="text-secondary" />
        <SummaryCard icon="receipt_long" label="Expenses" value={loading ? '--' : todayExpenses.toLocaleString()} color="text-danger" />
        <SummaryCard icon="trending_up" label="Profit" value={loading || todayProfit === null ? '--' : `${todayProfit >= 0 ? '+' : ''}${todayProfit.toLocaleString()}`} color={todayProfit !== null && todayProfit >= 0 ? 'text-secondary' : 'text-danger'} />
      </div>

      {/* Quick Actions */}
      <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <QuickActionButton icon="egg" label="Record Eggs" route="/production?tab=eggs" />
        <QuickActionButton icon="payments" label="Add Sale" route="/sales" />
        <QuickActionButton icon="receipt_long" label="Add Expense" route="/expenses" />
        <QuickActionButton icon="inventory_2" label="Feed Stock" route="/sales?tab=feed" />
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-1">
        <span className={`material-symbols-outlined text-xl ${color}`}>{icon}</span>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function QuickActionButton({ icon, label, route }: { icon: string; label: string; route: string }) {
  return (
    <button
      className="card flex flex-col items-center justify-center gap-1 py-4 active:bg-gray-50 transition-colors"
      onClick={() => window.location.hash = route}
      aria-label={label}
    >
      <span className="material-symbols-outlined text-2xl text-primary">{icon}</span>
      <span className="text-xs text-gray-700 font-medium">{label}</span>
    </button>
  );
}
