import { Bar, BarChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatCurrency';

export function IncomeExpenseBarChart({ data }) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-950 dark:text-white">Income vs Expenses</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Grouped monthly bars with savings overlay</p>
      </div>
      <div className="h-[360px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.25} />
            <XAxis dataKey="monthLabel" stroke="#64748b" />
            <YAxis tickFormatter={(value) => formatCompactCurrency(value)} stroke="#64748b" width={80} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="income" fill="#6366f1" radius={[12, 12, 0, 0]} isAnimationActive />
            <Bar dataKey="expenses" fill="#06b6d4" radius={[12, 12, 0, 0]} isAnimationActive />
            <Line type="monotone" dataKey="net" stroke="#16a34a" strokeDasharray="5 5" strokeWidth={3} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
