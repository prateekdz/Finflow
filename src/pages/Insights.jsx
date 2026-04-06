import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Clock3, Flame, PiggyBank, Sparkles } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { IncomeExpenseBarChart } from '../components/charts/IncomeExpenseBarChart';
import { useInsights } from '../hooks/useInsights';
import { useInitialLoad } from '../hooks/useInitialLoad';
import useFinflowStore from '../store/useFinflowStore';
import { formatCurrency } from '../utils/formatCurrency';
import { Skeleton } from '../components/ui/skeleton';

const rangeOptions = [
  { value: 'month', label: 'This Month' },
  { value: 'last3m', label: 'Last 3M' },
  { value: 'last6m', label: 'Last 6M' },
  { value: 'year', label: 'This Year' },
];

export function Insights() {
  const selectedDateRange = useFinflowStore((state) => state.selectedDateRange);
  const setSelectedDateRange = useFinflowStore((state) => state.setSelectedDateRange);
  const { monthlyData, categoryRows, pending, topCategory, bestSavingsMonth, busiestDay, thisMonth, lastMonth, heatmap } = useInsights();
  const loading = useInitialLoad(800);
  const [sortConfig, setSortConfig] = useState({ key: 'total', dir: 'desc' });

  const sortedCategoryRows = useMemo(() => {
    const rows = [...categoryRows];
    rows.sort((a, b) => {
      const dir = sortConfig.dir === 'asc' ? 1 : -1;
      return (a[sortConfig.key] > b[sortConfig.key] ? 1 : -1) * dir;
    });
    return rows;
  }, [categoryRows, sortConfig]);

  const comparisonRows = [
    { label: 'Income', current: thisMonth?.income ?? 0, previous: lastMonth?.income ?? 0 },
    { label: 'Expenses', current: thisMonth?.expenses ?? 0, previous: lastMonth?.expenses ?? 0 },
    { label: 'Net Savings', current: thisMonth?.net ?? 0, previous: lastMonth?.net ?? 0 },
    {
      label: 'Savings Rate',
      current: thisMonth?.income ? (thisMonth.net / thisMonth.income) * 100 : 0,
      previous: lastMonth?.income ? (lastMonth.net / lastMonth.income) * 100 : 0,
      suffix: '%',
    },
  ];

  const insightCards = [
    {
      icon: <Flame className="h-5 w-5" />,
      title: 'Top Spending Category',
      line1: topCategory?.label ?? 'No spend data',
      line2: `${formatCurrency(topCategory?.total ?? 0)} this period`,
      line3: `${(topCategory?.percentage ?? 0).toFixed(0)}% of total spend`,
    },
    {
      icon: <PiggyBank className="h-5 w-5" />,
      title: 'Best Savings Month',
      line1: bestSavingsMonth?.monthLabel ?? 'N/A',
      line2: `Saved ${formatCurrency(bestSavingsMonth?.net ?? 0)}`,
      line3: bestSavingsMonth?.income ? `${((bestSavingsMonth.net / bestSavingsMonth.income) * 100).toFixed(0)}% savings rate` : 'No income',
    },
    {
      icon: <Clock3 className="h-5 w-5" />,
      title: 'Pending Transactions',
      line1: `${pending.length} transactions pending`,
      line2: `Total ${formatCurrency(pending.reduce((sum, tx) => sum + Math.abs(tx.amount), 0))}`,
      line3: 'Review them soon',
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: 'Busiest Spend Day',
      line1: busiestDay?.label ?? 'N/A',
      line2: `Avg ${formatCurrency(busiestDay?.average ?? 0)} per ${busiestDay?.label ?? 'day'}`,
      line3: `${busiestDay?.count ?? 0} transactions`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {rangeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelectedDateRange(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedDateRange === option.value
                ? 'bg-indigo-500 text-white'
                : 'border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-[28px]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {insightCards.map((card) => (
            <div key={card.title} className="rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/60">
                {card.icon}
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
              <p className="mt-3 text-xl font-bold text-slate-950 dark:text-white">{card.line1}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{card.line2}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{card.line3}</p>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-x-auto hide-scrollbar">
        <IncomeExpenseBarChart data={monthlyData} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr,0.95fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white">Category Breakdown</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sortable summary of where money goes</p>
            </div>
            <Badge>{sortedCategoryRows.length} categories</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  {[
                    ['label', 'Category'],
                    ['total', 'Total Spent'],
                    ['percentage', '% of Total'],
                    ['transactions', 'Transactions'],
                    ['average', 'Avg per Tx'],
                  ].map(([key, label]) => (
                    <th key={key} className="pb-3 pr-4 font-semibold">
                      <button
                        type="button"
                        onClick={() =>
                          setSortConfig((current) => ({
                            key,
                            dir: current.key === key && current.dir === 'desc' ? 'asc' : 'desc',
                          }))
                        }
                      >
                        {label}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedCategoryRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 align-top last:border-0 hover:bg-slate-50/70 dark:border-slate-900 dark:hover:bg-slate-900/50">
                    <td className="py-4 pr-4 font-semibold text-slate-950 dark:text-white">{row.emoji} {row.label}</td>
                    <td className="py-4 pr-4 font-mono">{formatCurrency(row.total)}</td>
                    <td className="py-4 pr-4">
                      <div className="min-w-32">
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                          <div className="h-2 rounded-full" style={{ width: `${row.percentage}%`, backgroundColor: row.color }} />
                        </div>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{row.percentage.toFixed(1)}%</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4">{row.transactions}</td>
                    <td className="py-4 pr-0 font-mono">{formatCurrency(row.average)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">Monthly Comparison</h3>
            <div className="mt-6 space-y-3">
              {comparisonRows.map((row) => {
                const change = row.current - row.previous;
                const positive = row.label === 'Expenses' ? change < 0 : change >= 0;
                const currentDisplay = row.suffix ? `${row.current.toFixed(1)}${row.suffix}` : formatCurrency(row.current);
                const previousDisplay = row.suffix ? `${row.previous.toFixed(1)}${row.suffix}` : formatCurrency(row.previous);
                return (
                  <div key={row.label} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="grid grid-cols-[1.2fr,1fr,1fr,auto] items-center gap-3 text-sm">
                      <p className="font-semibold text-slate-950 dark:text-white">{row.label}</p>
                      <p className="font-mono">{currentDisplay}</p>
                      <p className="font-mono text-slate-500 dark:text-slate-400">{previousDisplay}</p>
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${positive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'}`}>
                        {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {row.suffix ? `${change >= 0 ? '+' : ''}${change.toFixed(1)}pp` : `${change >= 0 ? '+' : ''}${formatCurrency(change)}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">Transaction Frequency Heatmap</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Last 3 months, week by week</p>
              </div>
              <Badge>Less ░▒▓█ More</Badge>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {heatmap.map((cell, index) => {
                const intensity = Math.min(cell.count / 3, 1);
                const background = `rgba(99,102,241,${0.12 + intensity * 0.55})`;
                return (
                  <div
                    key={`${cell.week}-${cell.day}-${index}`}
                    title={`${cell.label} — ${cell.count} transactions, ${formatCurrency(cell.total)}`}
                    className="aspect-square rounded-lg border border-slate-200 dark:border-slate-800"
                    style={{ background }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
