import { useState } from 'react';
import { useDuckMortality } from '../../hooks/useDuckInventory';
import { MORTALITY_CAUSES, DUCK_AGE_GROUP_LABELS, type MortalityCause, type DuckAgeGroup } from '../../types/models';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

interface FormData {
  date: string;
  quantity: number;
  cause: MortalityCause;
  ageGroup: DuckAgeGroup | '';
  notes: string;
}

const defaultForm: FormData = {
  date: new Date().toISOString().split('T')[0],
  quantity: 0,
  cause: 'unknown',
  ageGroup: '',
  notes: '',
};

export default function MortalityTab() {
  const { records, isLoading, addRecord, deleteRecord } = useDuckMortality();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalMortality = records.reduce((s, r) => s + r.quantity, 0);

  const handleSubmit = async () => {
    if (form.quantity <= 0) { setSubmitError('Quantity must be greater than 0'); return; }
    setSubmitError(null);
    try {
      await addRecord({
        date: form.date,
        quantity: form.quantity,
        cause: form.cause,
        ageGroup: form.ageGroup || undefined,
        notes: form.notes.trim() || undefined,
      });
      setForm(defaultForm);
      setShowForm(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save record');
    }
  };

  const getCauseInfo = (cause: MortalityCause) =>
    MORTALITY_CAUSES.find((c) => c.value === cause) ?? MORTALITY_CAUSES[MORTALITY_CAUSES.length - 1];

  if (isLoading) {
    return <div className="animate-pulse space-y-3"><div className="h-12 bg-gray-200 rounded-lg" /><div className="h-12 bg-gray-200 rounded-lg" /></div>;
  }

  return (
    <div>
      {/* Summary */}
      <div className="card mb-4">
        <p className="text-xs text-gray-500">Total Mortality Recorded</p>
        <p className="text-2xl font-bold text-danger">{totalMortality}</p>
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary w-full flex items-center justify-center gap-2 mb-4">
          <span className="material-symbols-outlined">add</span>Record Mortality
        </button>
      ) : (
        <div className="card mb-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Record Duck Death</h3>
          <div>
            <label htmlFor="mort-date" className="text-xs font-medium text-gray-500">Date</label>
            <input id="mort-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor="mort-qty" className="text-xs font-medium text-gray-500">Number of Ducks</label>
            <input id="mort-qty" type="number" inputMode="numeric" min={1} step={1} value={form.quantity || ''}
              onChange={(e) => setForm({ ...form, quantity: Math.max(0, Math.floor(Number(e.target.value)) || 0) })} className="input-field text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Cause</label>
            <div className="grid grid-cols-3 gap-1.5">
              {MORTALITY_CAUSES.map((cause) => (
                <button key={cause.value} onClick={() => setForm({ ...form, cause: cause.value })}
                  className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg text-xs transition-colors min-h-touch ${form.cause === cause.value ? 'bg-danger text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <span className="material-symbols-outlined text-lg">{cause.icon}</span>
                  {cause.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="mort-age" className="text-xs font-medium text-gray-500">Age Group <span className="text-gray-400">(optional)</span></label>
            <select id="mort-age" value={form.ageGroup} onChange={(e) => setForm({ ...form, ageGroup: e.target.value as DuckAgeGroup | '' })} className="input-field text-sm">
              <option value="">-- Unknown / Mixed --</option>
              {Object.entries(DUCK_AGE_GROUP_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="mort-notes" className="text-xs font-medium text-gray-500">Notes <span className="text-gray-400">(optional)</span></label>
            <input id="mort-notes" type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field text-sm" maxLength={200} placeholder="e.g., Cold snap last night" />
          </div>
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
            <button onClick={handleSubmit} disabled={form.quantity <= 0} className="btn-primary flex-1 text-sm">Save Record</button>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <EmptyState icon="cruelty_free" title="No mortality records" message="Record duck deaths here to track flock health and calculate live inventory." />
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">{records.length} record{records.length !== 1 ? 's' : ''}</p>
          {records.slice(0, 50).map((rec) => {
            const cause = getCauseInfo(rec.cause);
            return (
              <div key={rec.id} className="card flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="material-symbols-outlined text-lg text-danger">{cause.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{rec.quantity} duck{rec.quantity !== 1 ? 's' : ''} — {cause.label}</p>
                    <p className="text-xs text-gray-500">
                      {rec.date}
                      {rec.ageGroup ? ` — ${DUCK_AGE_GROUP_LABELS[rec.ageGroup]}` : ''}
                      {rec.notes ? ` — ${rec.notes}` : ''}
                    </p>
                  </div>
                </div>
                <button onClick={() => setDeleteId(rec.id!)} className="text-gray-400 hover:text-danger min-w-touch min-h-touch flex items-center justify-center shrink-0" aria-label="Delete record">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Record"
        message="Are you sure you want to delete this mortality record?"
        variant="danger"
        confirmLabel="Delete"
        onConfirm={() => { if (deleteId) { deleteRecord(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
