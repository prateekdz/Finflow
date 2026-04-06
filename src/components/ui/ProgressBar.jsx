import { motion } from 'framer-motion';

export function ProgressBar({ value, color = '#6366f1', trackClassName = '', barClassName = '' }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={`h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ${trackClassName}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${safeValue}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`h-full rounded-full ${barClassName}`}
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
