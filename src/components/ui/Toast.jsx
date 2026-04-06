import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useFinflowStore from '../../store/useFinflowStore';

export function Toast() {
  const toast = useFinflowStore((state) => state.toast);
  const clearToast = useFinflowStore((state) => state.clearToast);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(clearToast, 3000);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60]">
      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="pointer-events-auto min-w-[260px] rounded-2xl border px-4 py-3"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-elevated)' }}
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{toast.title}</p>
            {toast.description ? (
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{toast.description}</p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
