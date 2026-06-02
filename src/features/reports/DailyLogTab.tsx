import { useEffect, useState } from 'react';
import { useDailyLog } from '../../hooks/useDailyLog';
import { calculateProfit } from '../../lib/calculations';
import EmptyState from '../../components/ui/EmptyState';

export default function DailyLogTab() {
  const { logs, isLoading, aggregateDailyLog } = useDailyLog();
  const [aggregating, setAggregating] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  // Aggregate today's log on mount
  useEffect(() => {
    const doAggregate = async () => {
      setAggregating(true);
      try {
        await aggregateDailyLog(today);
      } catch (err) {
        console.error('Failed to aggregate daily log:', err);
      } finally {
        setAggregating(false);
      }
    };
    doAggregate();
  }, [today, aggregateDailyLog]);

  if (isLoading || aggregating) {
    return <div className="animate-pulse space-y-3"><div className="h-12 bg-gray-200 rounded-lg" /><div className="h-12 bg-gray-200 rounded-lg" /></div>;
  }

  if (logs.length === 0) {
    return <EmptyState icon="assignment" title="No daily logs yet" message="Start recording data and logs will appear here automatically." />;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500 mb-2">Last 30 Days</p>
      {logs.map((log) => {
        const profit = calculateProfit(log.revenueTotal, 0, log.expensesTotal, 0);
        return (
          <div key={log.id} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">{log.date}</span>
              <span className={`text-xs font-medium ${profit >= 0 ? 'text-secondary' : 'text-danger'}`}>
                {profit >= 0 ? '+' : ''}{profit.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
              <div>
                <span className="text-gray-400">Eggs</span>
                <p className="font-medium text-gray-900">{log.eggsCollected}</p>
              </div>
              <div>
                <span className="text-gray-400">Sold</span>
                <p className="font-medium text-gray-900">{log.eggsSold}e / {log.ducksSold}d</p>
              </div>
              <div>
                <span className="text-gray-400">Feed</span>
                <p className="font-medium text-gray-900">{log.feedUsedKg}kg</p>
              </div>
              <div>
                <span className="text-gray-400">Expenses</span>
                <p className="font-medium text-gray-900">{log.expensesTotal.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-1 text-xs text-gray-400">
              Revenue: {log.revenueTotal.toLocaleString()} | Profit: {profit.toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
