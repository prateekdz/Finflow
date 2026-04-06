import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatINR } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-card border border-border rounded-card p-3 shadow-lg">
        <p className="text-text-primary font-medium mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-text-primary text-sm">
            Balance: <span className="font-mono font-bold">{formatINR(payload[0].value)}</span>
          </p>
          <p className="text-gain text-sm">
            Income: <span className="font-mono">{formatINR(payload[1].value)}</span>
          </p>
          <p className="text-loss text-sm">
            Expenses: <span className="font-mono">{formatINR(payload[2].value)}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function BalanceTrendChart({ data }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-bg-card border border-border rounded-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-text-primary text-lg font-semibold">Balance Trend</h3>
        <p className="text-text-muted text-sm">Your financial journey over time</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
            <XAxis
              dataKey="date"
              stroke="var(--color-text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--color-text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatINR(value, true)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="var(--color-accent)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-accent)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="var(--color-gain)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="var(--color-loss)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
