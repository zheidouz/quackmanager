import { useState, useEffect } from 'react';
import { useDucklingHatches } from '../../hooks/useProduction';
import db from '../../db/database';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

interface FormData {
  date: string;
  quantity: number;
  incubationBatchId: string;
  notes: string;
}

const defaultForm: FormData = {
  date: new Date().toISOString().split('T')[0],
  quantity: 0,
  incubationBatchId: '',
  notes: '',
};

export default function DucklingTab() {
  const { hatches, isLoading, addHatch, deleteHatch } = useDucklingHatches();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [batches, setBatches] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      const all = await db.incubationBatches.toArray();
      setBatches(all.map((b) => ({
        id: b.id!,
        label: `${b.datePlaced} — ${b.quantity} eggs (hatch: ${b.expectedHatchDate})`,
      })));
    };
    load();
  }, [hatches]);

  const handleSubmit = async () => {
    if (form.quantity <= 0) return;
    await addHatch({
      date: form.date,
      quantity: form.quantity,
      incubationBatchId: form.incubationBatchId || undefined,
      notes: form.notes.trim() || undefined,
    });
    setForm(defaultForm);
    setShowForm(false);
  };

  const totalDucklings = hatches.reduce((s, h) => s + h.quantity, 0);

  if (isLoading) {
    return <div className="animate-pulse space-y-3"><div className="h-12 bg-gray-200 rounded-lg" /><div className="h-12 bg-gray-200 rounded-lg" /></div>;
  }

  return (
    <div>
      {/* Summary */}
      <div className="card mb-4">
        <p className="text-xs text-gray-500">Total Ducklings Hatched</p>
        <p className="text-2xl font-bold text-secondary">{totalDucklings}</p>
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary w-full flex items-center justify-center gap-2 mb-4">
          <span className="material-symbols-outlined">add</span>Record Hatch
        </button>
      ) : (
        <div className="card mb-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">New Duckling Hatch</h3>
          <div>
            <label htmlFor="hatch-date" className="text-xs font-medium text-gray-500">Date</label>
            <input id="hatch-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor="hatch-qty" className="text-xs font-medium text-gray-500">Number of Ducklings</label>
            <input id="hatch-qty" type="number" inputMode="numeric" min={0} value={form.quantity || ''}
              onChange={(e) => setForm({ ...form, quantity: Math.max(0, Number(e.target.value)) })} className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor="hatch-batch" className="text-xs font-medium text-gray-500">Source Batch <span className="text-gray-400">(optional)</span></label>
            <select id="hatch-batch" value={form.incubationBatchId} onChange={(e) => setForm({ ...form, incubationBatchId: e.target.value })} className="input-field text-sm">
              <option value="">-- No batch --</option>
              {batches.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="hatch-notes" className="text-xs font-medium text-gray-500">Notes <span className="text-gray-400">(optional)</span></label>
            <input id="hatch-notes" type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field text-sm" maxLength={200} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
            <button onClick={handleSubmit} disabled={form.quantity <= 0} className="btn-primary flex-1 text-sm">Save Hatch</button>
          </div>
        </div>
      )}

      {hatches.length === 0 ? (
        <EmptyState icon="pets" title="No hatches recorded" message="Record your first duckling hatch to start tracking." />
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">{hatches.length} hatch{hatches.length !== 1 ? 'es' : ''}</p>
          {hatches.slice(0, 50).map((hatch) => (
            <div key={hatch.id} className="card flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{hatch.quantity} ducklings</p>
                <p className="text-xs text-gray-500">{hatch.date}{hatch.notes ? ` — ${hatch.notes}` : ''}</p>
              </div>
              <button onClick={() => setDeleteId(hatch.id!)} className="text-gray-400 hover:text-danger min-w-touch min-h-touch flex items-center justify-center" aria-label="Delete hatch">
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={deleteId !== null} title="Delete Hatch" message="Are you sure you want to delete this hatch record?"
        variant="danger" confirmLabel="Delete" onConfirm={() => { if (deleteId) { deleteHatch(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)} />
    </div>
  );
}
