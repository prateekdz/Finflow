import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';

export function SummaryCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  format = 'currency',
  className = '',
}) {
  const animatedValue = useCountUp(value, 2000);

  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString('en-IN');
    }
  };

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-bg-card border border-border rounded-card p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-text-muted text-sm font-medium mb-1">{title}</p>
          <p className="text-text-primary text-2xl font-bold font-mono">
            {formatValue(animatedValue)}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  change >= 0 ? 'text-gain' : 'text-loss'
                }`}
              >
                {formatChange(change)}
              </span>
              {changeLabel && (
                <span className="text-text-muted text-sm ml-1">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="ml-4">
          <div className="w-12 h-12 bg-accent-surface rounded-lg flex items-center justify-center">
            <div className="text-accent">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}