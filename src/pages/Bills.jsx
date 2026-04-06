import { addDays, eachDayOfInterval, endOfMonth, format, isAfter, isBefore, startOfMonth } from 'date-fns';
import { AlertTriangle, Calendar, CheckCircle2, Clock3 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { ProgressBar } from '../components/ui/ProgressBar';
import useFinflowStore from '../store/useFinflowStore';
import { formatCurrency } from '../utils/formatCurrency';

const recurringToBill = (item) => ({
  id: item.id,
  name: item.title,
  amount: item.amount,
  status: item.type === 'income' ? 'paid' : 'scheduled',
  dueDate: item.nextDate,
  category: item.category,
});

export function Bills() {
  const recurring = useFinflowStore((state) => state.recurring);
  const [viewMode, setViewMode] = useState('list');

  const bills = useMemo(
    () => recurring.filter((item) => item.type === 'expense').map(recurringToBill),
    [recurring]
  );

  const getStatusInfo = (bill) => {
    const today = new Date('2026-04-06');
    const dueDate = new Date(bill.dueDate);

    if (bill.status === 'paid') {
      return { status: 'paid', label: 'Paid', color: '#34c759', Icon: CheckCircle2 };
    }
    if (isAfter(today, dueDate)) {
      return { status: 'overdue', label: 'Overdue', color: '#ff3b30', Icon: AlertTriangle };
    }
    if (isBefore(dueDate, addDays(today, 7))) {
      return { status: 'due-soon', label: 'Due soon', color: '#ff9500', Icon: Clock3 };
    }
    return { status: 'upcoming', label: 'Upcoming', color: '#6e6e73', Icon: Calendar };
  };

  const groupedBills = useMemo(
    () =>
      bills.reduce((accumulator, bill) => {
        const statusInfo = getStatusInfo(bill);
        if (!accumulator[statusInfo.status]) accumulator[statusInfo.status] = [];
        accumulator[statusInfo.status].push({ ...bill, statusInfo });
        return accumulator;
      }, {}),
    [bills]
  );

  const statusOrder = ['overdue', 'due-soon', 'upcoming', 'paid'];
  const calendarDays = useMemo(() => {
    const start = startOfMonth(new Date('2026-04-01'));
    const end = endOfMonth(new Date('2026-04-01'));
    return eachDayOfInterval({ start, end });
  }, []);

  const totals = {
    overdue: bills.filter((bill) => getStatusInfo(bill).status === 'overdue').length,
    dueSoon: bills.filter((bill) => getStatusInfo(bill).status === 'due-soon').length,
    upcoming: bills.filter((bill) => getStatusInfo(bill).status === 'upcoming').length,
    paid: bills.filter((bill) => getStatusInfo(bill).status === 'paid').length,
  };

  if (!bills.length) {
    return (
      <EmptyState
        icon={Calendar}
        title="No bills scheduled"
        description="Recurring expenses will appear here automatically so you can track due dates at a glance."
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-[var(--text-secondary)]">Overdue</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{totals.overdue}</p>
        </div>
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-[var(--text-secondary)]">Due Soon</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{totals.dueSoon}</p>
        </div>
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-[var(--text-secondary)]">Upcoming</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{totals.upcoming}</p>
        </div>
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-[var(--text-secondary)]">Projected Monthly Cost</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[var(--text-primary)]">
            {formatCurrency(bills.reduce((sum, bill) => sum + bill.amount, 0))}
          </p>
        </div>
      </section>

      <section className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)]">
        <div className="flex gap-2">
          {['list', 'calendar'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`rounded-[10px] px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === mode
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-base)] text-[var(--text-secondary)]'
              }`}
            >
              {mode === 'list' ? 'List View' : 'Calendar View'}
            </button>
          ))}
        </div>
      </section>

      {viewMode === 'calendar' ? (
        <section className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
          <div className="mb-4 grid grid-cols-4 gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] sm:grid-cols-7">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
            {calendarDays.map((day) => {
              const dayBills = bills.filter((bill) => bill.dueDate === format(day, 'yyyy-MM-dd'));
              return (
                <div key={day.toISOString()} className="min-h-28 rounded-[18px] border border-[var(--border)] bg-[var(--bg-base)] p-3">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{format(day, 'd')}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {dayBills.map((bill) => {
                      const info = getStatusInfo(bill);
                      return (
                        <span
                          key={bill.id}
                          title={`${bill.name} • ${info.label}`}
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: info.color }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="space-y-5">
          {statusOrder.map((status) => {
            const entries = groupedBills[status] ?? [];
            if (!entries.length) return null;

            return (
              <section key={status} className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold capitalize text-[var(--text-primary)]">{status.replace('-', ' ')}</h3>
                  <span className="text-sm text-[var(--text-secondary)]">{entries.length} items</span>
                </div>
                <div className="space-y-3">
                  {entries.map((bill) => {
                    const progress = Math.min(100, (bill.amount / Math.max(...bills.map((item) => item.amount))) * 100);
                    const StatusIcon = bill.statusInfo.Icon;

                    return (
                      <div key={bill.id} className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-base)] p-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-[var(--text-primary)]">{bill.name}</p>
                            <p className="mt-1 text-sm text-[var(--text-secondary)]">
                              {bill.category} • Due {format(new Date(bill.dueDate), 'dd MMM yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-lg font-semibold text-[var(--text-primary)]">{formatCurrency(bill.amount)}</p>
                            <p className="mt-1 inline-flex items-center gap-1 text-sm" style={{ color: bill.statusInfo.color }}>
                              <StatusIcon className="h-4 w-4" />
                              {bill.statusInfo.label}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <ProgressBar value={progress} color={bill.statusInfo.color} trackClassName="h-2 bg-black/5 dark:bg-white/10" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
