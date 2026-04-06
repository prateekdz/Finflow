import { ArrowRight, CreditCard, ShieldCheck, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { TickerBar } from '../components/layout/TickerBar';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { SummaryCard } from '../components/ui/SummaryCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { BalanceTrendChart } from '../components/charts/BalanceTrendChart';
import { SpendingDonutChart } from '../components/charts/SpendingDonutChart';
import { useTransactions } from '../hooks/useTransactions';
import { useInitialLoad } from '../hooks/useInitialLoad';
import {
  MOCK_BALANCE_SUMMARY,
  MOCK_RECENT_TRANSACTIONS,
  MOCK_SPENDING_BREAKDOWN,
} from '../data/dashboardMockData';
import useFinflowStore from '../store/useFinflowStore';
import { RoleToggle } from '../components/ui/RoleToggle';
import { formatCurrency, formatSignedCurrency } from '../utils/formatCurrency';

function Gauge({ rate }) {
  const circumference = 2 * Math.PI * 48;
  const offset = circumference - (Math.min(rate, 100) / 100) * circumference;

  return (
    <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
      <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="48" stroke="rgba(148,163,184,0.18)" strokeWidth="12" fill="none" />
        <circle cx="60" cy="60" r="48" stroke="#16a34a" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold text-slate-950 dark:text-white">{rate.toFixed(1)}%</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Savings rate</p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const role = useFinflowStore((state) => state.role);
  const setRole = useFinflowStore((state) => state.setRole);
  const setFilter = useFinflowStore((state) => state.setFilter);
  const settings = useFinflowStore((state) => state.settings);
  const budgetLimits = useFinflowStore((state) => state.budgetLimits);
  const { filteredTransactions, summary, categoryBreakdown, transactions } = useTransactions();
  const [chartRange, setChartRange] = useState('6m');
  const loading = useInitialLoad(800);
  const effectiveSummary = summary.income || summary.expenses ? summary : MOCK_BALANCE_SUMMARY;
  const effectiveCategoryBreakdown = categoryBreakdown.length ? categoryBreakdown : MOCK_SPENDING_BREAKDOWN;

  const monthlyData = useMemo(() => {
    const map = new Map();
    transactions.forEach((tx) => {
      const key = tx.date.slice(0, 7);
      if (!map.has(key)) {
        map.set(key, { monthKey: key, monthLabel: new Date(`${key}-01`).toLocaleDateString('en-US', { month: 'short' }), income: 0, expenses: 0, net: 0 });
      }
      const bucket = map.get(key);
      if (tx.type === 'income') bucket.income += tx.amount;
      else bucket.expenses += Math.abs(tx.amount);
      bucket.net = bucket.income - bucket.expenses;
    });
    const months = Array.from(map.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
    if (chartRange === '1m') return months.slice(-1);
    if (chartRange === '3m') return months.slice(-3);
    return months.slice(-6);
  }, [transactions, chartRange]);

  const sparklineData = monthlyData.map((item) => ({ value: item.net }));
  const savingsRate = effectiveSummary.income ? (effectiveSummary.net / effectiveSummary.income) * 100 : 0;
  const recentTransactions = filteredTransactions.length ? filteredTransactions.slice(0, 8) : MOCK_RECENT_TRANSACTIONS;

  const mostFrequentMerchant = useMemo(() => {
    const map = new Map();
    filteredTransactions.forEach((tx) => map.set(tx.merchant, (map.get(tx.merchant) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'No merchant';
  }, [filteredTransactions]);

  const busiestDay = useMemo(() => {
    const map = new Map();
    filteredTransactions.forEach((tx) => {
      const day = new Date(tx.date).toLocaleDateString('en-US', { weekday: 'long' });
      map.set(day, (map.get(day) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'No activity';
  }, [filteredTransactions]);

  const budgetSnapshot = effectiveCategoryBreakdown.slice(0, 3).map((item) => ({
    ...item,
    limit: budgetLimits[item.id] ?? 0,
    percent: budgetLimits[item.id] ? (item.amount / budgetLimits[item.id]) * 100 : 0,
  }));

  return (
    <div className="space-y-6">
      {settings.showTickerBar ? <TickerBar /> : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-48 rounded-[28px]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <SummaryCard title="Total Balance" value={effectiveSummary.totalBalance} trend="+12.4% vs last month" icon={<Wallet />} color="#6366f1" data={sparklineData} delay={0} />
          <SummaryCard title="Total Income" value={effectiveSummary.income} trend="Stable income flow" icon={<TrendingUp />} color="#16a34a" data={monthlyData.map((item) => ({ value: item.income }))} delay={0.1} />
          <SummaryCard title="Total Expenses" value={effectiveSummary.expenses} trend="-8% vs last month" icon={<TrendingDown />} color="#06b6d4" data={monthlyData.map((item) => ({ value: item.expenses }))} delay={0.2} />
          <SummaryCard title="Net Savings" value={effectiveSummary.net} trend={`${savingsRate.toFixed(1)}% savings rate`} icon={<CreditCard />} color="#f59e0b" data={sparklineData} delay={0.3} />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="overflow-x-auto hide-scrollbar"><BalanceTrendChart data={monthlyData} range={chartRange} onRangeChange={setChartRange} /></div>
          <SpendingDonutChart
            data={effectiveCategoryBreakdown}
            activeCategory={useFinflowStore.getState().filters.category === 'all' ? '' : useFinflowStore.getState().filters.category}
            onSelectCategory={(category) => setFilter('category', useFinflowStore.getState().filters.category === category ? 'all' : category)}
          />

          <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">Recent Transactions</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Latest 8 movements across your accounts</p>
              </div>
              <Link to="/transactions" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-500">View all transactions <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((tx) => {
                const category = effectiveCategoryBreakdown.find((item) => item.id === tx.category) ?? useFinflowStore.getState().getCategoryMeta(tx.category);
                return (
                  <div key={tx.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60 md:grid-cols-[4px,auto,1fr,auto,auto] md:items-center">
                    <div className="h-full rounded-full" style={{ backgroundColor: category?.color ?? '#94a3b8' }} />
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg" style={{ backgroundColor: `${category?.color ?? '#94a3b8'}20` }}>{category?.emoji ?? '?'}</div>
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">{tx.description}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{tx.merchant}</p>
                    </div>
                    <Badge>{category?.label ?? tx.category}</Badge>
                    <div className="text-right">
                      <p className={`font-mono font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{formatSignedCurrency(tx.amount)}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">Balance Summary</h3>
            <Gauge rate={savingsRate} />
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-900/60">Savings {formatCurrency(effectiveSummary.net)}</div>
              <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-900/60">Expenses {formatCurrency(effectiveSummary.expenses)}</div>
              <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-900/60">Net {formatCurrency(effectiveSummary.totalBalance)}</div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">Role Access</h3>
            <div className="mt-4"><RoleToggle role={role} onChange={setRole} /></div>
            <Badge className={`mt-4 ${role === 'admin' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300'}`}>
              <ShieldCheck className="h-3.5 w-3.5" />
              {role === 'admin' ? 'Admin Mode - Full Access' : 'Viewer Mode - Read Only'}
            </Badge>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">Quick Stats</h3>
            <div className="mt-5 space-y-4 text-sm">
              <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-900/60"><p className="text-slate-500 dark:text-slate-400">Highest spend category</p><p className="mt-1 font-semibold text-slate-950 dark:text-white">{effectiveCategoryBreakdown[0]?.label ?? 'None'}</p></div>
              <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-900/60"><p className="text-slate-500 dark:text-slate-400">Most frequent merchant</p><p className="mt-1 font-semibold text-slate-950 dark:text-white">{mostFrequentMerchant}</p></div>
              <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-900/60"><p className="text-slate-500 dark:text-slate-400">Busiest spending day</p><p className="mt-1 font-semibold text-slate-950 dark:text-white">{busiestDay}</p></div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">Budget Snapshot</h3>
            <div className="mt-5 space-y-4">
              {budgetSnapshot.map((item) => (
                <div key={item.id}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="font-mono">{formatCurrency(item.amount)} / {formatCurrency(item.limit)}</span>
                  </div>
                  <ProgressBar value={Math.min(item.percent, 100)} color={item.color} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

