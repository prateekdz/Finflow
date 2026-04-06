import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

export function BalanceTrendChart({ data, range, onRangeChange }) {
  const rangeOptions = [
    { value: '6m', label: '6M' },
    { value: '3m', label: '3M' },
    { value: '1m', label: '1M' },
  ];

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">Balance Trend</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Income and expenses across time</p>
        </div>
        <div className="inline-flex rounded-full bg-slate-100 p-1 dark:bg-slate-800">
          {rangeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onRangeChange(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                range === option.value
                  ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[320px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.32} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.25} />
            <XAxis dataKey="monthLabel" stroke="#64748b" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#64748b" width={90} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Area type="monotone" dataKey="income" stroke="#6366f1" fill="url(#incomeGradient)" strokeWidth={3} isAnimationActive />
            <Area type="monotone" dataKey="expenses" stroke="#06b6d4" fill="url(#expenseGradient)" strokeWidth={3} isAnimationActive />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
