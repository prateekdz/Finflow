import { useMemo, useState } from 'react';
import { CalendarClock, Pencil, Repeat, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import useFinflowStore from '../store/useFinflowStore';
import { formatCurrency } from '../utils/formatCurrency';

const initialRecurring = {
  title: '',
  amount: '',
  type: 'expense',
  frequency: 'monthly',
  nextDate: '2026-04-20',
  category: 'bills',
};

const inputStyle = {
  borderColor: 'var(--border)',
  background: 'var(--bg-base)',
  color: 'var(--text-primary)',
};

export function Recurring() {
  const recurring = useFinflowStore((state) => state.recurring);
  const addRecurring = useFinflowStore((state) => state.addRecurring);
  const updateRecurring = useFinflowStore((state) => state.updateRecurring);
  const deleteRecurring = useFinflowStore((state) => state.deleteRecurring);
  const role = useFinflowStore((state) => state.role);
  const getCategoryMeta = useFinflowStore((state) => state.getCategoryMeta);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialRecurring);

  const projectedMonthlyCost = useMemo(
    () =>
      recurring
        .filter((item) => item.type === 'expense')
        .reduce((sum, item) => sum + Number(item.amount), 0),
    [recurring]
  );

  const openModal = (item = null) => {
    setEditing(item);
    setForm(item ? { ...item, amount: String(item.amount) } : initialRecurring);
    setOpen(true);
  };

  const submit = () => {
    const payload = { ...form, amount: Number(form.amount) };
    if (editing) updateRecurring(editing.id, payload);
    else addRecurring(payload);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3">
        {role === 'admin' ? <Button onClick={() => openModal()}>Add Recurring</Button> : null}
      </div>

      <section
        className="rounded-[18px] border p-6 shadow-sm"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}
      >
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Projected monthly recurring cost
        </p>
        <p className="mt-2 font-mono text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {formatCurrency(projectedMonthlyCost)}
        </p>
      </section>

      {recurring.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="No recurring items"
          description="Add subscriptions, rent, or salary inflows to forecast predictable monthly changes."
          action={role === 'admin' ? { label: 'Add Recurring', onClick: () => openModal() } : null}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {recurring.map((item) => {
            const meta = getCategoryMeta(item.category);
            return (
              <section
                key={item.id}
                className="rounded-[18px] border p-6 shadow-sm transition-transform hover:-translate-y-0.5"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {meta?.label ?? item.category}
                    </p>
                  </div>
                  <span className={`font-mono text-lg font-semibold ${item.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {item.type === 'income' ? '+' : '-'}
                    {formatCurrency(item.amount)}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: 'var(--bg-base)' }}>
                    <Repeat className="h-4 w-4" /> {item.frequency}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: 'var(--bg-base)' }}>
                    <CalendarClock className="h-4 w-4" /> {item.nextDate}
                  </span>
                </div>
                {role === 'admin' ? (
                  <div className="mt-5 flex gap-2">
                    <Button variant="secondary" onClick={() => openModal(item)}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => deleteRecurring(item.id)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Recurring Item' : 'Add Recurring Item'}>
        <div className="space-y-4">
          <input
            value={form.title}
            onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
            placeholder="Title"
            className="w-full rounded-[10px] border px-4 py-3"
            style={inputStyle}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm((current) => ({ ...current, amount: e.target.value }))}
              placeholder="Amount"
              className="w-full rounded-[10px] border px-4 py-3"
              style={inputStyle}
            />
            <select
              value={form.type}
              onChange={(e) => setForm((current) => ({ ...current, type: e.target.value }))}
              className="w-full rounded-[10px] border px-4 py-3"
              style={inputStyle}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={form.frequency}
              onChange={(e) => setForm((current) => ({ ...current, frequency: e.target.value }))}
              className="w-full rounded-[10px] border px-4 py-3"
              style={inputStyle}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <input
              type="date"
              value={form.nextDate}
              onChange={(e) => setForm((current) => ({ ...current, nextDate: e.target.value }))}
              className="w-full rounded-[10px] border px-4 py-3"
              style={inputStyle}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
