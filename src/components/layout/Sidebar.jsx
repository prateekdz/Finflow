import {
  BarChart3,
  CalendarClock,
  Goal,
  Home,
  Lightbulb,
  Moon,
  RefreshCcw,
  Settings,
  Sun,
  Wallet,
  WalletCards,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import useFinflowStore from '../../store/useFinflowStore';
import { RoleToggle } from '../ui/RoleToggle';

function FinflowMark() {
  return (
    <div className="flex items-center gap-3 px-1">
      <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#0a84ff_0%,#5ac8fa_50%,#34c759_100%)] text-base font-bold text-white shadow-[var(--shadow-card)]">
        F
      </div>
      <div>
        <p className="text-base font-semibold text-[var(--text-primary)]">Finflow</p>
        <p className="text-xs text-[var(--text-secondary)]">Personal Finance</p>
      </div>
    </div>
  );
}

const primaryItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/transactions', label: 'Transactions', icon: Wallet },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
  { to: '/budget', label: 'Budget', icon: WalletCards },
  { to: '/goals', label: 'Goals', icon: Goal },
];

const secondaryItems = [
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/bills', label: 'Bills', icon: CalendarClock },
  { to: '/recurring', label: 'Recurring', icon: RefreshCcw },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function SidebarItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-[var(--accent)]/12 text-[var(--accent)] shadow-sm ring-1 ring-[var(--accent)]/20 dark:bg-[var(--accent)] dark:text-white dark:ring-0'
            : 'text-[var(--text-secondary)] hover:bg-black/5 hover:text-[var(--text-primary)] dark:hover:bg-white/5',
        ].join(' ')
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-150 group-hover:scale-110" />
      <span>{label}</span>
    </NavLink>
  );
}

export function Sidebar({ role, setRole, darkMode, toggleDarkMode }) {
  const location = useLocation();
  const settings = useFinflowStore((state) => state.settings);

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--bg-glass)] px-4 py-5 md:flex">
      <div className="flex min-h-full flex-col">
        <FinflowMark />

        <div className="mt-8">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">Main</p>
          <nav className="mt-3 space-y-1">
            {primaryItems.map((item) => (
              <SidebarItem key={item.to} {...item} />
            ))}
          </nav>
        </div>

        <div className="mt-8">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">Workspace</p>
          <nav className="mt-3 space-y-1">
            {secondaryItems.map((item) => (
              <SidebarItem key={item.to} {...item} />
            ))}
          </nav>
        </div>

        <div className="mt-8 rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Display</p>
              <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">Dark Mode</p>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-primary)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="mt-auto rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)]/12 text-sm font-semibold text-[var(--accent)]">
              {settings.userAvatar}
            </div>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">{settings.userName}</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {role === 'admin' ? 'Admin mode' : 'Viewer mode'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <RoleToggle role={role} onChange={setRole} />
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            {location.pathname === '/settings'
              ? 'Profile and preferences are editable here.'
              : 'Settings sync instantly across the workspace.'}
          </p>
        </div>
      </div>
    </aside>
  );
}
