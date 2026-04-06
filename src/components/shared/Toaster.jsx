import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import useFinflowStore from "../../store/useFinflowStore";
import { cn } from '../../lib/utils';

function ToastItem({ toast }) {
  const removeToast = useFinflowStore((s) => s.removeToast);

  const colorMap = {
    success: {
      bg: 'bg-[var(--color-accent-surface)]',
      text: 'text-[var(--color-accent)]',
      border: 'border-[var(--color-accent)]',
      dot: 'bg-[var(--color-accent)]',
    },
    error: {
      bg: 'bg-[var(--color-accent-red-surface)]',
      text: 'text-[var(--color-accent-red)]',
      border: 'border-[var(--color-accent-red)]',
      dot: 'bg-[var(--color-accent-red)]',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-[var(--color-accent-amber)]',
      border: 'border-[var(--color-accent-amber)]',
      dot: 'bg-[var(--color-accent-amber)]',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-[var(--color-accent-blue)]',
      border: 'border-[var(--color-accent-blue)]',
      dot: 'bg-[var(--color-accent-blue)]',
    },
  };

  const colors = colorMap[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, x: 12 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 12, x: 12 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'max-w-xs rounded-lg border-l-4 px-4 py-3 shadow-elevated',
        colors.bg,
        colors.border,
        colors.text,
        'flex items-start gap-3'
      )}
    >
      <div className={cn('mt-1 h-2 w-2 rounded-full flex-shrink-0', colors.dot)} />
      <div className="flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              removeToast(toast.id);
            }}
            className="mt-1 text-xs font-semibold underline hover:no-underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

export function Toaster() {
  const toasts = useFinflowStore((s) => s.toasts);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-h-screen flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const addToast = useFinflowStore((s) => s.addToast);

  return {
    success: (message, action, duration) =>
      addToast({ message, type: 'success', action, duration }),
    error: (message, action, duration) =>
      addToast({ message, type: 'error', action, duration }),
    warning: (message, action, duration) =>
      addToast({ message, type: 'warning', action, duration }),
    info: (message, action, duration) =>
      addToast({ message, type: 'info', action, duration }),
  };
}
