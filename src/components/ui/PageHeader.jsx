export function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-end md:justify-between" style={{ borderColor: 'var(--border)' }}>
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--text-secondary)' }}>
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
        {subtitle ? <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
