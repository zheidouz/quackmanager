import { useState } from 'react';
import { useIncubationBatches } from '../../hooks/useProduction';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';

interface FormData {
  datePlaced: string;
  quantity: number;
  incubatorId: string;
  expectedHatchDate: string;
  notes: string;
}

const defaultForm: FormData = {
  datePlaced: new Date().toISOString().split('T')[0],
  quantity: 0,
  incubatorId: '',
  expectedHatchDate: '',
  notes: '',
};

export default function IncubationTab() {
  const { batches, isLoading, addBatch, deleteBatch } = useIncubationBatches();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (form.quantity <= 0 || !form.expectedHatchDate) return;
    await addBatch({
      datePlaced: form.datePlaced,
      quantity: form.quantity,
      incubatorId: form.incubatorId.trim() || undefined,
      expectedHatchDate: form.expectedHatchDate,
      notes: form.notes.trim() || undefined,
    });
    setForm(defaultForm);
    setShowForm(false);
  };

  const getHatchStatus = (expected: string): { label: string; variant: 'warning' | 'success' | 'info' | 'danger' } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const hatch = new Date(expected + 'T00:00:00');
    const diffMs = hatch.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Hatched', variant: 'success' };
    if (diffDays === 0) return { label: 'Due Today!', variant: 'warning' };
    if (diffDays <= 2) return { label: `In ${diffDays}d`, variant: 'warning' };
    return { label: `${diffDays}d left`, variant: 'info' };
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-3"><div className="h-12 bg-gray-200 rounded-lg" /><div className="h-12 bg-gray-200 rounded-lg" /></div>;
  }

  return (
    <div>
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary w-full flex items-center justify-center gap-2 mb-4">
          <span className="material-symbols-outlined">add</span>New Incubation Batch
        </button>
      ) : (
        <div className="card mb-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">New Incubation Batch</h3>
          <div>
            <label htmlFor="inc-date" className="text-xs font-medium text-gray-500">Date Placed</label>
            <input id="inc-date" type="date" value={form.datePlaced} onChange={(e) => setForm({ ...form, datePlaced: e.target.value })} className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor="inc-qty" className="text-xs font-medium text-gray-500">Number of Eggs</label>
            <input id="inc-qty" type="number" inputMode="numeric" min={0} value={form.quantity || ''}
              onChange={(e) => setForm({ ...form, quantity: Math.max(0, Number(e.target.value)) })} className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor="inc-hatch" className="text-xs font-medium text-gray-500">Expected Hatch Date *</label>
            <input id="inc-hatch" type="date" value={form.expectedHatchDate} onChange={(e) => setForm({ ...form, expectedHatchDate: e.target.value })} className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor="inc- incubator" className="text-xs font-medium text-gray-500">Incubator ID <span className="text-gray-400">(optional)</span></label>
            <input id="inc-incubator" type="text" value={form.incubatorId} onChange={(e) => setForm({ ...form, incubatorId: e.target.value })} className="input-field text-sm" maxLength={50} placeholder="e.g., Incubator A" />
          </div>
          <div>
            <label htmlFor="inc-notes" className="text-xs font-medium text-gray-500">Notes <span className="text-gray-400">(optional)</span></label>
            <input id="inc-notes" type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field text-sm" maxLength={200} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
            <button onClick={handleSubmit} disabled={form.quantity <= 0 || !form.expectedHatchDate} className="btn-primary flex-1 text-sm">Save Batch</button>
          </div>
        </div>
      )}

      {batches.length === 0 ? (
        <EmptyState icon="heat" title="No incubation batches" message="Start an incubation batch to track egg hatching." />
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">{batches.length} batch{batches.length !== 1 ? 'es' : ''}</p>
          {batches.map((batch) => {
            const status = getHatchStatus(batch.expectedHatchDate);
            return (
              <div key={batch.id} className="card">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{batch.quantity} eggs</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <button onClick={() => setDeleteId(batch.id!)} className="text-gray-400 hover:text-danger min-w-touch min-h-touch flex items-center justify-center" aria-label="Delete batch">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Placed: {batch.datePlaced} | Hatch: {batch.expectedHatchDate}
                  {batch.incubatorId ? ` | ${batch.incubatorId}` : ''}
                </p>
                {batch.notes && <p className="text-xs text-gray-400 mt-1">{batch.notes}</p>}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog open={deleteId !== null} title="Delete Batch" message="Are you sure you want to delete this incubation batch?"
        variant="danger" confirmLabel="Delete" onConfirm={() => { if (deleteId) { deleteBatch(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)} />
    </div>
  );
}
