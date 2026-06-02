import { useState, useEffect } from 'react';
import db from '../../db/database';
import { useAuthStore } from '../../stores/authStore';
import { useSyncStore } from '../../sync/syncStore';
import { useFeedInventory } from '../../hooks/useFeedInventory';
import { DEFAULT_FRESHNESS_DAYS, DEFAULT_LOW_FEED_THRESHOLD_DAYS } from '../../lib/constants';
import type { FarmSettings } from '../../types/models';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { isOnline, pendingCount, lastSynced, sync } = useSyncStore();
  const { stock, stockLoading, updateStock } = useFeedInventory();

  const [settings, setSettings] = useState<FarmSettings>({
    id: 'main',
    name: 'QuackManager Farm',
    freshnessDays: DEFAULT_FRESHNESS_DAYS,
    lowFeedThresholdDays: DEFAULT_LOW_FEED_THRESHOLD_DAYS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [dailyAvgInput, setDailyAvgInput] = useState('');

  // Load settings
  useEffect(() => {
    const load = async () => {
      const existing = await db.farmSettings.get('main');
      if (existing) {
        setSettings(existing);
      }
      setSettingsLoading(false);
    };
    load();
  }, []);

  // Load daily avg from stock
  useEffect(() => {
    if (stock) {
      setDailyAvgInput(String(stock.dailyAvgConsumptionKg || ''));
    }
  }, [stock]);

  const handleSaveSettings = async () => {
    const now = new Date().toISOString();
    const updated = { ...settings, updatedAt: now };
    await db.farmSettings.put(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpdateDailyAvg = async () => {
    const val = parseFloat(dailyAvgInput);
    if (!isNaN(val) && val >= 0) {
      await updateStock({ dailyAvgConsumptionKg: val });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleSync = async () => {
    await sync();
  };

  if (settingsLoading || stockLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-10 bg-gray-200 rounded-lg w-3/4" /><div className="h-16 bg-gray-200 rounded-lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Settings</h2>

      {/* Profile */}
      <div className="card">
        <p className="text-sm font-medium text-gray-700 mb-3">Account</p>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
            {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user?.displayName || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email || ''}</p>
          </div>
        </div>
        <button onClick={logout} className="text-sm text-danger font-medium flex items-center gap-1 min-h-touch">
          <span className="material-symbols-outlined text-lg">logout</span>Sign Out
        </button>
      </div>

      {/* Farm Settings */}
      <div className="card space-y-3">
        <p className="text-sm font-medium text-gray-700">Farm Settings</p>
        <div>
          <label htmlFor="farm-name" className="text-xs font-medium text-gray-500">Farm Name</label>
          <input id="farm-name" type="text" value={settings.name} maxLength={100}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })} className="input-field text-sm" />
        </div>
        <div>
          <label htmlFor="freshness-days" className="text-xs font-medium text-gray-500">Egg Freshness Period (days)</label>
          <input id="freshness-days" type="number" inputMode="numeric" min={1} max={30} value={settings.freshnessDays}
            onChange={(e) => setSettings({ ...settings, freshnessDays: Math.max(1, Number(e.target.value)) })} className="input-field text-sm" />
          <p className="text-xs text-gray-400 mt-1">Warn if unsold eggs exceed this age.</p>
        </div>
        <div>
          <label htmlFor="feed-threshold" className="text-xs font-medium text-gray-500">Low Feed Threshold (days)</label>
          <input id="feed-threshold" type="number" inputMode="numeric" min={1} max={30} value={settings.lowFeedThresholdDays}
            onChange={(e) => setSettings({ ...settings, lowFeedThresholdDays: Math.max(1, Number(e.target.value)) })} className="input-field text-sm" />
          <p className="text-xs text-gray-400 mt-1">Alert when feed stock falls below this many days of consumption.</p>
        </div>
        <button onClick={handleSaveSettings} className="btn-primary w-full text-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">save</span>{saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      {/* Feed Consumption */}
      <div className="card space-y-3">
        <p className="text-sm font-medium text-gray-700">Feed Consumption</p>
        <div>
          <label htmlFor="daily-avg" className="text-xs font-medium text-gray-500">Daily Avg Feed Consumption (kg)</label>
          <input id="daily-avg" type="number" inputMode="decimal" min={0} step={0.5} value={dailyAvgInput}
            onChange={(e) => setDailyAvgInput(e.target.value)} className="input-field text-sm" />
          <p className="text-xs text-gray-400 mt-1">Used to calculate low stock alerts and days remaining.</p>
        </div>
        <button onClick={handleUpdateDailyAvg} className="btn-primary w-full text-sm">Update</button>
      </div>

      {/* Sync Status */}
      <div className="card">
        <p className="text-sm font-medium text-gray-700 mb-3">Sync Status</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className={`font-medium ${isOnline ? 'text-secondary' : 'text-accent'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Pending items</span>
            <span className="font-medium text-gray-900">{pendingCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Last synced</span>
            <span className="font-medium text-gray-900">{lastSynced ? new Date(lastSynced).toLocaleString() : '--'}</span>
          </div>
        </div>
        <button onClick={handleSync} disabled={!isOnline || pendingCount === 0}
          className="btn-primary w-full mt-3 text-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">sync</span>Sync Now
        </button>
      </div>
    </div>
  );
}
