import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MiniSparkline } from '../charts/MiniSparkline';
import { formatCurrency } from '../../utils/formatCurrency';

function CountUpValue({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 900;

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      setDisplay(Math.round(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span>{formatCurrency(display)}</span>;
}

export function SummaryCard({ title, value, trend, icon, color, data, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="rounded-[18px] border p-5 transition-shadow hover:shadow-xl"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
          <p className="mt-2 font-mono text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            <CountUpValue value={value} />
          </p>
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
          style={{ backgroundColor: `${color}16`, color }}
        >
          {icon}
        </div>
      </div>
      <div className="mb-3 flex items-center gap-2 text-sm">
        <span className="font-semibold" style={{ color }}>
          {trend}
        </span>
      </div>
      <MiniSparkline data={data} color={color} />
    </motion.div>
  );
}
