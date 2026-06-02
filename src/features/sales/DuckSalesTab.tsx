import { useState } from 'react';
import { useDuckSales } from '../../hooks/useSales';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

interface FormData {
  date: string;
  quantity: number;
  priceEach: number;
  customerName: string;
}

const defaultForm: FormData = { date: new Date().toISOString().split('T')[0], quantity: 0, priceEach: 0, customerName: '' };

export default function DuckSalesTab() {
  const { sales, isLoading, addSale, deleteSale } = useDuckSales();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (form.quantity <= 0 || form.priceEach <= 0) return;
    await addSale({ date: form.date, quantity: form.quantity, priceEach: form.priceEach, customerName: form.customerName.trim() || undefined });
    setForm(defaultForm);
    setShowForm(false);
  };

  const totalRevenue = sales.reduce((s, e) => s + e.total, 0);

  if (isLoading) {
    return <div className="animate-pulse space-y-3"><div className="h-12 bg-gray-200 rounded-lg" /><div className="h-12 bg-gray-200 rounded-lg" /></div>;
  }

  return (
    <div>
      <div className="card mb-4">
        <p className="text-xs text-gray-500">Total Duck Sales Revenue</p>
        <p className="text-2xl font-bold text-secondary">{totalRevenue.toLocaleString()}</p>
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary w-full flex items-center justify-center gap-2 mb-4">
          <span className="material-symbols-outlined">add</span>Record Duck Sale
        </button>
      ) : (
        <div className="card mb-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">New Duck Sale</h3>
          <div>
            <label htmlFor="duck-sale-date" className="text-xs font-medium text-gray-500">Date</label>
            <input id="duck-sale-date" type="date" value={form.date} max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field text-sm" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="duck-sale-qty" className="text-xs font-medium text-gray-500">Quantity</label>
              <input id="duck-sale-qty" type="number" inputMode="numeric" min={0} value={form.quantity || ''}
                onChange={(e) => setForm({ ...form, quantity: Math.max(0, Number(e.target.value)) })} className="input-field text-sm" />
            </div>
            <div className="flex-1">
              <label htmlFor="duck-sale-price" className="text-xs font-medium text-gray-500">Price Each</label>
              <input id="duck-sale-price" type="number" inputMode="decimal" min={0} step={0.01} value={form.priceEach || ''}
                onChange={(e) => setForm({ ...form, priceEach: Math.max(0, Number(e.target.value)) })} className="input-field text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="duck-sale-customer" className="text-xs font-medium text-gray-500">Customer <span className="text-gray-400">(optional)</span></label>
            <input id="duck-sale-customer" type="text" value={form.customerName} maxLength={100}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="input-field text-sm" placeholder="e.g., Live poultry buyer" />
          </div>
          {form.quantity > 0 && form.priceEach > 0 && (
            <p className="text-sm text-gray-700">Total: <strong>{(form.quantity * form.priceEach).toLocaleString()}</strong></p>
          )}
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
            <button onClick={handleSubmit} disabled={form.quantity <= 0 || form.priceEach <= 0} className="btn-primary flex-1 text-sm">Save Sale</button>
          </div>
        </div>
      )}

      {sales.length === 0 ? (
        <EmptyState icon="pets" title="No duck sales yet" message="Record your first duck sale to start tracking." />
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">{sales.length} sale{sales.length !== 1 ? 's' : ''}</p>
          {sales.slice(0, 50).map((sale) => (
            <div key={sale.id} className="card flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{sale.quantity} ducks × {sale.priceEach}</p>
                <p className="text-xs text-gray-500">{sale.date}{sale.customerName ? ` — ${sale.customerName}` : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-secondary">{sale.total.toLocaleString()}</span>
                <button onClick={() => setDeleteId(sale.id!)} className="text-gray-400 hover:text-danger min-w-touch min-h-touch flex items-center justify-center" aria-label="Delete sale">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={deleteId !== null} title="Delete Sale" message="Are you sure you want to delete this sale?"
        variant="danger" confirmLabel="Delete" onConfirm={() => { if (deleteId) { deleteSale(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)} />
    </div>
  );
}
