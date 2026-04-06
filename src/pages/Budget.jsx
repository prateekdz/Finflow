import { AlertTriangle, Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/button';
import { PageHeader } from '../components/ui/PageHeader';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useTransactions } from '../hooks/useTransactions';
import useFinflowStore from '../store/useFinflowStore';
import { formatCurrency } from '../utils/formatCurrency';

const monthWindow = ['2026-01', '2026-02', '2026-03'];

export function Budget() {
  const budgetLimits = useFinflowStore((state) => state.budgetLimits);
  const setBudgetLimit = useFinflowStore((state) => state.setBudgetLimit);
  const role = useFinflowStore((state) => state.role);
  const showToast = useFinflowStore((state) => state.showToast);
  const { transactions } = useTransactions();
  const [editingCategory, setEditingCategory] = useState(null);
  const [draftLimit, setDraftLimit] = useState('');

  const currentMonthExpenses = useMemo(() => {
    const map = new Map();
    transactions
      .filter((tx) => tx.type === 'expense' && tx.date.startsWith('2026-03'))
      .forEach((tx) => {
        const current = map.get(tx.category) ?? { spent: 0, count: 0 };
        map.set(tx.category, {
          spent: current.spent + Math.abs(tx.amount),
          count: current.count + 1,
        });
      });
    return map;
  }, [transactions]);

  const rows = useMemo(
    () =>
      Object.entries(budgetLimits).map(([category, limit]) => {
        const meta = useFinflowStore.getState().getCategoryMeta(category);
        const current = currentMonthExpenses.get(category) ?? { spent: 0, count: 0 };
        const percent = limit ? (current.spent / limit) * 100 : 0;

        return {
          ...meta,
          limit,
          spent: current.spent,
          count: current.count,
          percent,
          remaining: limit - current.spent,
        };
      }),
    [budgetLimits, currentMonthExpenses]
  );

  const withinBudget = rows.filter((row) => row.percent <= 100).length;
  const score = Math.round((withinBudget / rows.length) * 100);
  const scoreColor = score >= 80 ? '#34c759' : score >= 50 ? '#ff9500' : '#ff3b30';
  const totalLimit = Object.values(budgetLimits).reduce((sum, value) => sum + value, 0);

  const trendData = monthWindow.map((month) => {
    const spent = transactions
      .filter((tx) => tx.type === 'expense' && tx.date.startsWith(month))
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return { month, spent, limit: totalLimit };
  });

  const tips = rows
    .slice()
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3)
    .map((row) => ({
      id: row.id,
      title:
        row.percent > 90
          ? `${row.label} is at ${Math.round(row.percent)}% of budget`
          : `${row.label} is under control`,
      body:
        row.percent > 90
          ? 'This category is close to the line. Trim a few variable purchases to stay in range.'
          : 'Spending here is healthy and leaves room for the rest of the month.',
    }));

  return (
    <div className="space-y-6">
      <section className="card-glass rounded-[18px] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Budget Health Score</p>
            <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{score} / 100</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              You&apos;re on track with {withinBudget} of {rows.length} categories within budget this month.
            </p>
          </div>
          <Badge>This Month</Badge>
        </div>
        <div className="mt-5">
          <ProgressBar value={score} color={scoreColor} trackClassName="h-2 bg-black/5 dark:bg-white/10" barClassName="shadow-sm" />
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {rows.map((row) => {
          const accent = row.percent > 90 ? '#ff3b30' : row.percent > 70 ? '#ff9500' : '#34c759';
          return (
            <section
              key={row.id}
              className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5"
              style={row.percent > 100 ? { boxShadow: '0 0 0 1px rgba(255,59,48,0.18), var(--shadow-card)' } : undefined}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">
                    {row.emoji} {row.label}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Spent {formatCurrency(row.spent)} / Limit {formatCurrency(row.limit)}
                  </p>
                </div>
                {row.percent > 100 ? <AlertTriangle className="h-5 w-5 text-[#ff3b30]" /> : null}
              </div>

              <div className="mt-5">
                <ProgressBar value={Math.min(row.percent, 100)} color={accent} trackClassName="h-2 bg-black/5 dark:bg-white/10" />
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-[var(--text-secondary)]">
                <span>
                  {row.remaining >= 0
                    ? `${formatCurrency(row.remaining)} remaining`
                    : `${formatCurrency(Math.abs(row.remaining))} over`}
                </span>
                <span>{row.count} transactions</span>
              </div>

              {role === 'admin' ? (
                <div className="mt-4">
                  {editingCategory === row.id ? (
                    <div className="flex gap-2">
                      <input
                        value={draftLimit}
                        onChange={(event) => setDraftLimit(event.target.value)}
                        className="flex-1 rounded-[10px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          setBudgetLimit(row.id, Number(draftLimit));
                          setEditingCategory(null);
                          showToast({ title: `${row.label} limit updated` });
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setEditingCategory(row.id);
                        setDraftLimit(String(row.limit));
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Limit
                    </Button>
                  )}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <section className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
          <PageHeader eyebrow="Trend" title="Monthly Budget Trend" subtitle="Combined spend versus total category limits over the last three months." />
          <div className="mt-5 space-y-4">
            {trendData.map((item) => (
              <div key={item.month}>
                <div className="mb-2 flex items-center justify-between text-sm text-[var(--text-secondary)]">
                  <span>{item.month}</span>
                  <span className="font-mono text-[var(--text-primary)]">
                    {formatCurrency(item.spent)} / {formatCurrency(item.limit)}
                  </span>
                </div>
                <div className="relative">
                  <ProgressBar value={(item.spent / item.limit) * 100} color="var(--accent)" trackClassName="h-2 bg-black/5 dark:bg-white/10" />
                  <div className="pointer-events-none absolute inset-0 rounded-full border border-dashed border-[var(--border-strong)]" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
          <PageHeader eyebrow="Guidance" title="Budget Tips" subtitle="Auto-generated recommendations from March spending behavior." />
          <div className="mt-5 space-y-3">
            {tips.map((tip) => (
              <div key={tip.id} className="rounded-[18px] bg-[var(--bg-base)] p-4">
                <p className="font-semibold text-[var(--text-primary)]">{tip.title}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
