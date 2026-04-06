import { ChevronRight, Menu, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Topbar({ title, subtitle, darkMode, toggleDarkMode, onMenuClick, actions }) {
  const location = useLocation();
  const crumbs = location.pathname.split('/').filter(Boolean);

  return (
    <div
      className="sticky top-0 z-50 border-b"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-glass)' }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-2xl border p-3 shadow-sm md:hidden"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
          >
            <Menu className="h-4 w-4" />
          </button>
          <div>
            <div className="mb-1 hidden items-center gap-1 text-xs md:flex" style={{ color: 'var(--text-secondary)' }}>
              <Link to="/">Finflow</Link>
              {crumbs.map((crumb) => (
                <span key={crumb} className="inline-flex items-center gap-1 capitalize">
                  <ChevronRight className="h-3 w-3" />
                  {crumb}
                </span>
              ))}
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
            {subtitle ? <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p> : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {actions}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="rounded-2xl border p-3 shadow-sm transition hover:-translate-y-0.5"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
