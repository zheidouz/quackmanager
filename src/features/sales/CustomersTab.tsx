import { useState } from 'react';
import { useCustomers } from '../../hooks/useSales';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

interface FormData {
  name: string;
  phone: string;
  email: string;
}

const defaultForm: FormData = { name: '', phone: '', email: '' };

export default function CustomersTab() {
  const { customers, isLoading, addCustomer, deleteCustomer } = useCustomers();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    await addCustomer({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
    });
    setForm(defaultForm);
    setShowForm(false);
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-3"><div className="h-12 bg-gray-200 rounded-lg" /></div>;
  }

  return (
    <div>
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary w-full flex items-center justify-center gap-2 mb-4">
          <span className="material-symbols-outlined">add</span>Add Customer
        </button>
      ) : (
        <div className="card mb-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">New Customer</h3>
          <div>
            <label htmlFor="customer-name" className="text-xs font-medium text-gray-500">Name *</label>
            <input id="customer-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" maxLength={100} />
          </div>
          <div>
            <label htmlFor="customer-phone" className="text-xs font-medium text-gray-500">Phone</label>
            <input id="customer-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field text-sm" maxLength={20} />
          </div>
          <div>
            <label htmlFor="customer-email" className="text-xs font-medium text-gray-500">Email <span className="text-gray-400">(optional)</span></label>
            <input id="customer-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field text-sm" maxLength={200} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
            <button onClick={handleSubmit} disabled={!form.name.trim()} className="btn-primary flex-1 text-sm">Save</button>
          </div>
        </div>
      )}

      {customers.length === 0 ? (
        <EmptyState icon="people" title="No customers yet" message="Add your first customer to track purchase history." />
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">{customers.length} customer{customers.length !== 1 ? 's' : ''}</p>
          {customers.map((c) => (
            <div key={c.id} className="card flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500">{c.phone}{c.email ? ` — ${c.email}` : ''}</p>
              </div>
              <button onClick={() => setDeleteId(c.id!)} className="text-gray-400 hover:text-danger min-w-touch min-h-touch flex items-center justify-center" aria-label="Delete customer">
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={deleteId !== null} title="Delete Customer" message="Are you sure you want to delete this customer?"
        variant="danger" confirmLabel="Delete" onConfirm={() => { if (deleteId) { deleteCustomer(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)} />
    </div>
  );
}
