import { motion } from 'framer-motion';
import { Button } from './button';

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-[260px] flex-col items-center justify-center rounded-[18px] border border-dashed p-8 text-center"
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-card)' }}
    >
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: 'var(--bg-base)', color: 'var(--text-muted)' }}
      >
        {Icon ? <Icon className="h-8 w-8" /> : <span className="text-3xl">•</span>}
      </div>
      <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
      {action ? (
        <Button variant="primary" size="md" className="mt-6" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </motion.div>
  );
}
