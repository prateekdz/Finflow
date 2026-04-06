import { useMemo } from 'react';
import { Line, LineChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/formatCurrency';
import useFinflowStore from '../store/useFinflowStore';

export function Analytics() {
  const { transactions } = useTransactions();
  const getCategoryMeta = useFinflowStore((state) => state.getCategoryMeta);

  const monthly = useMemo(() => {
    const map = new Map();
    transactions.forEach((tx) => {
      const key = tx.date.slice(0, 7);
      if (!map.has(key)) map.set(key, { month: key, income: 0, expenses: 0, net: 0 });
      const bucket = map.get(key);
      if (tx.type === 'income') bucket.income += tx.amount;
      else bucket.expenses += Math.abs(tx.amount);
      bucket.net = bucket.income - bucket.expenses;
    });
    return [...map.values()].sort((a, b) => a.month.localeCompare(b.month)).map((item) => ({
      ...item,
      label: new Date(`${item.month}-01`).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      savingsRate: item.income ? (item.net / item.income) * 100 : 0,
    }));
  }, [transactions]);

  const merchantData = useMemo(() => {
    const map = new Map();
    transactions.filter((tx) => tx.type === 'expense').forEach((tx) => {
      map.set(tx.merchant, (map.get(tx.merchant) ?? 0) + Math.abs(tx.amount));
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value], index) => ({
      name,
      value,
      color: ['#0071e3', '#34c759', '#ff9500', '#af52de', '#ff3b30'][index],
    }));
  }, [transactions]);

  const netWorth = monthly.reduce((acc, item) => {
    const previous = acc.at(-1)?.value ?? 0;
    acc.push({ label: item.label, value: previous + item.net });
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[18px] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
          <h3 className="text-lg font-semibold">Year-over-year style monthly comparison</h3>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="income" fill="#34c759" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="#ff3b30" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[18px] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
          <h3 className="text-lg font-semibold">Monthly savings rate trend</h3>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(value) => `${Math.round(value)}%`} />
                <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                <Line type="monotone" dataKey="savingsRate" stroke="#0071e3" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[18px] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
          <h3 className="text-lg font-semibold">Top 5 merchants</h3>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={merchantData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
                  {merchantData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[18px] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
          <h3 className="text-lg font-semibold">Net worth tracker</h3>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={netWorth}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="value" stroke="#34c759" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
