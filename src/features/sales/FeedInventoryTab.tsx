import { useState, useEffect } from 'react';
import { useFeedInventory } from '../../hooks/useFeedInventory';

import Badge from '../../components/ui/Badge';

export default function FeedInventoryTab() {
  const { stock, stockLoading, initStock, usageLogs, addUsageLog, purchases, addPurchase, deletePurchase, isLow } = useFeedInventory();
  const [showUsageForm, setShowUsageForm] = useState(false);
  const [usageKg, setUsageKg] = useState(0);
  const [usageNotes, setUsageNotes] = useState('');
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [pForm, setPForm] = useState({ date: new Date().toISOString().split('T')[0], feedType: '', quantity: 0, unit: 'kg' as 'kg' | 'bag', costPerUnit: 0 });

  useEffect(() => { initStock(); }, [initStock]);

  const handleUsageSubmit = async () => {
    if (usageKg <= 0) return;
    await addUsageLog({ date: new Date().toISOString().split('T')[0], quantityKg: usageKg, notes: usageNotes.trim() || undefined });
    setUsageKg(0);
    setUsageNotes('');
    setShowUsageForm(false);
  };

  const handlePurchaseSubmit = async () => {
    if (pForm.quantity <= 0 || pForm.costPerUnit <= 0 || !pForm.feedType) return;
    await addPurchase(pForm);
    setPForm({ date: new Date().toISOString().split('T')[0], feedType: '', quantity: 0, unit: 'kg', costPerUnit: 0 });
    setShowPurchaseForm(false);
  };

  if (stockLoading) {
    return <div className="animate-pulse space-y-3"><div className="h-20 bg-gray-200 rounded-lg" /><div className="h-12 bg-gray-200 rounded-lg" /></div>;
  }

  return (
    <div>
      {/* Stock Card */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">Current Feed Stock</p>
          {isLow && <Badge variant="danger">Low Stock</Badge>}
        </div>
        <p className="text-3xl font-bold text-gray-900">{stock?.currentStockKg ?? 0} <span className="text-base font-normal text-gray-500">kg</span></p>
        <p className="text-xs text-gray-500 mt-1">
          Daily avg: {stock?.dailyAvgConsumptionKg || '--'} kg &middot;
          Threshold: {stock?.lowStockThresholdKg || 150} kg
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setShowUsageForm(true)} className="btn-primary flex-1 flex items-center justify-center gap-1 text-sm">
          <span className="material-symbols-outlined text-lg">remove_circle</span>Use Feed
        </button>
        <button onClick={() => setShowPurchaseForm(true)} className="btn-secondary flex-1 flex items-center justify-center gap-1 text-sm">
          <span className="material-symbols-outlined text-lg">add_circle</span>Add Stock
        </button>
      </div>

      {/* Usage Form */}
      {showUsageForm && (
        <div className="card mb-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Log Feed Usage</h3>
          <div>
            <label htmlFor="feed-usage-kg" className="text-xs font-medium text-gray-500">Quantity (kg)</label>
            <input id="feed-usage-kg" type="number" inputMode="decimal" min={0} step={0.5} value={usageKg || ''}
              onChange={(e) => setUsageKg(Math.max(0, Number(e.target.value)))} className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor="feed-usage-notes" className="text-xs font-medium text-gray-500">Notes <span className="text-gray-400">(optional)</span></label>
            <input id="feed-usage-notes" type="text" value={usageNotes} onChange={(e) => setUsageNotes(e.target.value)} className="input-field text-sm" maxLength={200} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowUsageForm(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
            <button onClick={handleUsageSubmit} disabled={usageKg <= 0} className="btn-primary flex-1 text-sm">Log Usage</button>
          </div>
        </div>
      )}

      {/* Purchase Form */}
      {showPurchaseForm && (
        <div className="card mb-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Record Feed Purchase</h3>
          <div>
            <label htmlFor="feed-purchase-date" className="text-xs font-medium text-gray-500">Date</label>
            <input id="feed-purchase-date" type="date" value={pForm.date} onChange={(e) => setPForm({ ...pForm, date: e.target.value })} className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor="feed-type" className="text-xs font-medium text-gray-500">Feed Type</label>
            <input id="feed-type" type="text" value={pForm.feedType} onChange={(e) => setPForm({ ...pForm, feedType: e.target.value })} className="input-field text-sm" placeholder="e.g., Layer pellets" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="feed-qty" className="text-xs font-medium text-gray-500">Quantity</label>
              <input id="feed-qty" type="number" inputMode="decimal" min={0} step={0.5} value={pForm.quantity || ''}
                onChange={(e) => setPForm({ ...pForm, quantity: Math.max(0, Number(e.target.value)) })} className="input-field text-sm" />
            </div>
            <div className="flex-1">
              <label htmlFor="feed-unit" className="text-xs font-medium text-gray-500">Unit</label>
              <select id="feed-unit" value={pForm.unit} onChange={(e) => setPForm({ ...pForm, unit: e.target.value as 'kg' | 'bag' })} className="input-field text-sm">
                <option value="kg">kg</option>
                <option value="bag">Bag (25kg)</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="feed-cost" className="text-xs font-medium text-gray-500">Cost per Unit</label>
            <input id="feed-cost" type="number" inputMode="decimal" min={0} step={0.01} value={pForm.costPerUnit || ''}
              onChange={(e) => setPForm({ ...pForm, costPerUnit: Math.max(0, Number(e.target.value)) })} className="input-field text-sm" />
          </div>
          {pForm.quantity > 0 && pForm.costPerUnit > 0 && (
            <p className="text-sm text-gray-700">Total: <strong>{(pForm.quantity * pForm.costPerUnit).toLocaleString()}</strong></p>
          )}
          <div className="flex gap-2">
            <button onClick={() => setShowPurchaseForm(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
            <button onClick={handlePurchaseSubmit} disabled={pForm.quantity <= 0 || pForm.costPerUnit <= 0 || !pForm.feedType} className="btn-primary flex-1 text-sm">Save Purchase</button>
          </div>
        </div>
      )}

      {/* Recent Purchases */}
      <div className="mt-6">
        <p className="text-xs font-medium text-gray-500 mb-2">Recent Purchases</p>
        {purchases.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No purchases recorded yet.</p>
        ) : (
          <div className="space-y-1.5">
            {purchases.slice(0, 20).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2">
                <div>
                  <span className="text-gray-900 font-medium">{p.feedType}</span>
                  <span className="text-gray-500 ml-2">{p.quantity} {p.unit} × {p.costPerUnit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-semibold">{p.totalCost.toLocaleString()}</span>
                  <button onClick={() => deletePurchase(p.id!)} className="text-gray-400 hover:text-danger min-w-touch min-h-touch flex items-center justify-center" aria-label="Delete purchase">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Usage */}
      <div className="mt-4">
        <p className="text-xs font-medium text-gray-500 mb-2">Recent Usage</p>
        {usageLogs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No usage logged yet.</p>
        ) : (
          <div className="space-y-1.5">
            {usageLogs.slice(0, 20).map((log) => (
              <div key={log.id} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2">
                <div>
                  <span className="text-gray-900 font-medium">{log.quantityKg} kg</span>
                  {log.notes && <span className="text-gray-500 ml-2">{log.notes}</span>}
                </div>
                <span className="text-gray-500 text-xs">{log.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
