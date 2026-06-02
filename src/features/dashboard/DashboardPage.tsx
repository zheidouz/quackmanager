import { useEffect, useState, useCallback } from 'react';
import { useEggCollection } from '../../hooks/useEggCollection';
import { useAlerts } from '../../hooks/useAlerts';
import { useDuckInventory, useCohortMoves } from '../../hooks/useDuckInventory';
import db from '../../db/database';
import { calculateProfit } from '../../lib/calculations';
import type { DuckAgeGroup } from '../../types/models';
import AlertBanner from '../../components/ui/AlertBanner';
import MoveDucksSheet from './MoveDucksSheet';

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const { todayEntry } = useEggCollection();
  const { alerts, dismissAlert } = useAlerts();
  const { totalLive, ducklings, growers, adults, recalculate } = useDuckInventory();
  const { addMove } = useCohortMoves();
  const [showMoveSheet, setShowMoveSheet] = useState(false);

  const handleMoveDucks = useCallback(async (fromGroup: DuckAgeGroup, toGroup: DuckAgeGroup, quantity: number) => {
    await addMove({
      date: new Date().toISOString().split('T')[0],
      fromGroup,
      toGroup,
      quantity,
    });
    await recalculate();
  }, [addMove, recalculate]);

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

      {/* Duck Inventory Card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">pets</span>
            <span className="text-sm font-medium text-gray-700">Duck Inventory</span>
          </div>
          <button
            onClick={() => setShowMoveSheet(true)}
            className="text-sm text-primary font-medium flex items-center gap-1 min-h-touch px-3"
            aria-label="Move ducks between age groups"
          >
            <span className="material-symbols-outlined text-lg">swap_horiz</span>
            Move
          </button>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-3">{totalLive}</p>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-accent-50 rounded-lg py-2">
            <p className="font-semibold text-accent-800">{ducklings}</p>
            <p className="text-accent-600">Ducklings</p>
          </div>
          <div className="bg-primary-50 rounded-lg py-2">
            <p className="font-semibold text-primary-700">{growers}</p>
            <p className="text-primary-600">Growers</p>
          </div>
          <div className="bg-secondary-50 rounded-lg py-2">
            <p className="font-semibold text-secondary-700">{adults}</p>
            <p className="text-secondary-600">Adults</p>
          </div>
        </div>
      </div>

      {/* Move Ducks Sheet */}
      <MoveDucksSheet
        open={showMoveSheet}
        ducklings={ducklings}
        growers={growers}
        adults={adults}
        onMove={handleMoveDucks}
        onClose={() => setShowMoveSheet(false)}
      />

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
