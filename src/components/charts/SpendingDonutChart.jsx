import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

export function SpendingDonutChart({ data, onSelectCategory, activeCategory }) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
      <h3 className="text-xl font-bold text-slate-950 dark:text-white">Spending Breakdown</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Click a slice to filter transactions live</p>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr,1fr]">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="label"
                innerRadius={60}
                outerRadius={100}
                activeOuterRadius={108}
                paddingAngle={3}
                onClick={(entry) => onSelectCategory(entry.id)}
                isAnimationActive
              >
                {data.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} stroke={entry.id === activeCategory ? '#0f172a' : 'transparent'} strokeWidth={entry.id === activeCategory ? 3 : 0} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <text x="50%" y="48%" textAnchor="middle" className="fill-slate-500 text-sm">
                Total Spent
              </text>
              <text x="50%" y="58%" textAnchor="middle" className="fill-slate-950 text-xl font-bold dark:fill-white">
                {formatCurrency(total)}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory(item.id)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                activeCategory === item.id
                  ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/40'
                  : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-slate-900 dark:text-white">{item.label}</span>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(item.amount)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.percentage.toFixed(1)}%</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
