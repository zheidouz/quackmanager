import { useState } from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import { EXPENSE_CATEGORIES, RECURRING_FREQUENCIES, type ExpenseCategory, type RecurringFrequency } from '../../types/models';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';

interface FormData {
  date: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  isRecurring: boolean;
  recurringFrequency: RecurringFrequency;
}

interface TemplateForm {
  category: ExpenseCategory;
  amount: number;
  description: string;
  frequency: RecurringFrequency;
}

const defaultForm: FormData = {
  date: new Date().toISOString().split('T')[0],
  category: 'other',
  amount: 0,
  description: '',
  isRecurring: false,
  recurringFrequency: 'monthly',
};

export default function ExpensesPage() {
  const { expenses, isLoading, addExpense, deleteExpense, templates, addTemplate, deleteTemplate } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [showTemplates, setShowTemplates] = useState(false);
  const [tForm, setTForm] = useState<TemplateForm>({ category: 'other', amount: 0, description: '', frequency: 'monthly' });
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmedDesc = form.description.trim();
    if (form.amount <= 0 || !trimmedDesc) return;
    await addExpense({
      date: form.date,
      category: form.category,
      amount: form.amount,
      description: trimmedDesc,
      isRecurring: form.isRecurring,
      recurringFrequency: form.isRecurring ? form.recurringFrequency : undefined,
    });
    setForm(defaultForm);
    setShowForm(false);
  };

  const handleTemplateSubmit = async () => {
    if (tForm.amount <= 0 || !tForm.description.trim()) return;
    await addTemplate({
      category: tForm.category,
      amount: tForm.amount,
      description: tForm.description.trim(),
      frequency: tForm.frequency,
      lastGenerated: undefined,
    });
    setTForm({ category: 'other', amount: 0, description: '', frequency: 'monthly' });
    setShowTemplates(false);
  };

  const filteredExpenses = filterCategory === 'all'
    ? expenses
    : expenses.filter((e) => e.category === filterCategory);

  const totalAmount = filteredExpenses.reduce((s, e) => s + e.amount, 0);

  if (isLoading) {
    return <div className="animate-pulse space-y-3"><div className="h-12 bg-gray-200 rounded-lg" /><div className="h-12 bg-gray-200 rounded-lg" /></div>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Expenses</h2>

      {/* Category filter chips */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        <button onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap min-h-touch transition-colors ${filterCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
          All
        </button>
        {EXPENSE_CATEGORIES.map((cat) => (
          <button key={cat.value} onClick={() => setFilterCategory(cat.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap min-h-touch transition-colors flex items-center gap-1 ${filterCategory === cat.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
            <span className="material-symbols-outlined text-sm">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Total */}
      <div className="card mb-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">Total {filterCategory !== 'all' ? `(${filterCategory})` : ''}</p>
          {filterCategory !== 'all' && <button onClick={() => setFilterCategory('all')} className="text-xs text-primary">Clear</button>}
        </div>
        <p className="text-2xl font-bold text-danger">{totalAmount.toLocaleString()}</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setShowForm(true)} className="btn-primary flex-1 flex items-center justify-center gap-1 text-sm">
          <span className="material-symbols-outlined text-lg">add</span>Add Expense
        </button>
        <button onClick={() => setShowTemplates(true)} className="btn-secondary flex-1 flex items-center justify-center gap-1 text-sm">
          <span className="material-symbols-outlined text-lg">repeat</span>Recurring
        </button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <div className="card mb-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">New Expense</h3>
          <div>
            <label htmlFor="exp-date" className="text-xs font-medium text-gray-500">Date</label>
            <input id="exp-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
            <div className="grid grid-cols-3 gap-1.5">
              {EXPENSE_CATEGORIES.map((cat) => (
                <button key={cat.value} onClick={() => setForm({ ...form, category: cat.value })}
                  className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg text-xs transition-colors min-h-touch ${form.category === cat.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="exp-amount" className="text-xs font-medium text-gray-500">Amount</label>
            <input id="exp-amount" type="number" inputMode="decimal" min={0} step={0.01} value={form.amount || ''}
              onChange={(e) => setForm({ ...form, amount: Math.max(0, Number(e.target.value)) })} className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor="exp-desc" className="text-xs font-medium text-gray-500">Description</label>
            <input id="exp-desc" type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm" maxLength={200} placeholder="e.g., Veterinary visit" />
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.isRecurring} onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })}
                className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
            </label>
            <span className="text-sm text-gray-700">Recurring expense</span>
          </div>
          {form.isRecurring && (
            <div>
              <label htmlFor="exp-freq" className="text-xs font-medium text-gray-500">Frequency</label>
              <select id="exp-freq" value={form.recurringFrequency} onChange={(e) => setForm({ ...form, recurringFrequency: e.target.value as RecurringFrequency })} className="input-field text-sm">
                {RECURRING_FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => { setForm(defaultForm); setShowForm(false); }} className="btn-secondary flex-1 text-sm">Cancel</button>
            <button onClick={handleSubmit} disabled={form.amount <= 0 || !form.description.trim()} className="btn-primary flex-1 text-sm">Save Expense</button>
          </div>
        </div>
      )}

      {/* Recurring Templates */}
      {showTemplates && (
        <div className="card mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Recurring Templates</h3>
            <button onClick={() => setShowTemplates(false)} className="text-gray-400 text-xs">Done</button>
          </div>
          {templates.length > 0 && (
            <div className="space-y-1.5">
              {templates.map((t) => (
                <div key={t.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.description}</p>
                    <p className="text-xs text-gray-500">{t.category} — {t.frequency}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">{t.amount.toLocaleString()}</span>
                    <button onClick={() => deleteTemplate(t.id!)} className="text-gray-400 hover:text-danger min-w-touch min-h-touch flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="border-t pt-3 space-y-2">
            <p className="text-xs font-medium text-gray-500">Add Template</p>
            <select value={tForm.category} onChange={(e) => setTForm({ ...tForm, category: e.target.value as ExpenseCategory })} className="input-field text-sm">
              {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <input type="number" inputMode="decimal" placeholder="Amount" value={tForm.amount || ''}
              onChange={(e) => setTForm({ ...tForm, amount: Math.max(0, Number(e.target.value)) })} className="input-field text-sm" />
            <input type="text" placeholder="Description" value={tForm.description} maxLength={200}
              onChange={(e) => setTForm({ ...tForm, description: e.target.value })} className="input-field text-sm" />
            <select value={tForm.frequency} onChange={(e) => setTForm({ ...tForm, frequency: e.target.value as RecurringFrequency })} className="input-field text-sm">
              {RECURRING_FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <button onClick={handleTemplateSubmit} disabled={tForm.amount <= 0 || !tForm.description.trim()} className="btn-primary w-full text-sm">Add Template</button>
          </div>
        </div>
      )}

      {/* Expense list */}
      {filteredExpenses.length === 0 ? (
        <EmptyState icon="receipt_long" title="No expenses found" message={filterCategory !== 'all' ? 'No expenses in this category.' : 'Add your first expense to start tracking.'} />
      ) : (
        <div className="space-y-1.5">
          {filteredExpenses.slice(0, 50).map((exp) => {
            const cat = EXPENSE_CATEGORIES.find((c) => c.value === exp.category);
            return (
              <div key={exp.id} className="card flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className={`material-symbols-outlined text-lg ${exp.isAutoGenerated ? 'text-accent' : 'text-gray-400'}`}>
                    {cat?.icon ?? 'more_horiz'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{exp.description}</p>
                    <p className="text-xs text-gray-500">
                      {exp.date}
                      {exp.isAutoGenerated && <Badge variant="warning">Auto</Badge>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-danger">{exp.amount.toLocaleString()}</span>
                  <button onClick={() => setDeleteId(exp.id!)} className="text-gray-400 hover:text-danger min-w-touch min-h-touch flex items-center justify-center" aria-label="Delete expense">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog open={deleteId !== null} title="Delete Expense" message="Are you sure you want to delete this expense?"
        variant="danger" confirmLabel="Delete" onConfirm={() => { if (deleteId) { deleteExpense(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)} />
    </div>
  );
}
