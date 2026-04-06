import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatINR } from '../../utils/formatters';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-bg-card border border-border rounded-card p-3 shadow-lg">
        <p className="text-text-primary font-medium mb-1">{data.name}</p>
        <p className="text-text-primary text-sm">
          Amount: <span className="font-mono font-bold">{formatINR(data.value)}</span>
        </p>
        <p className="text-text-muted text-sm">
          {data.percentage.toFixed(1)}% of total expenses
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-text-primary text-sm">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function SpendingBreakdown({ data }) {

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-bg-card border border-border rounded-card p-6 shadow-sm"
      >
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-text-primary text-lg font-semibold mb-2">No Expenses Yet</h3>
          <p className="text-text-muted text-sm">Start tracking your expenses to see the breakdown</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-bg-card border border-border rounded-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-text-primary text-lg font-semibold">Spending Breakdown</h3>
        <p className="text-text-muted text-sm">Where your money goes</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
