import { AnimatePresence, motion } from 'framer-motion';

export function Modal({ open, onClose, title, children, className = '' }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 md:items-center md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            className={`w-full rounded-t-[18px] border p-6 md:max-w-2xl md:rounded-[18px] ${className}`}
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-elevated)',
            }}
          >
            {title ? (
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border p-2 transition"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
            ) : null}
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
