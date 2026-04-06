export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] transition-all duration-150 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]';
  const variants = {
    primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm',
    secondary:
      'border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]',
    danger: 'bg-[var(--accent-red)] text-white hover:opacity-90',
    ghost:
      'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
