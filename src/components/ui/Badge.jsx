export function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${className}`}
      style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
    >
      {children}
    </span>
  );
}
