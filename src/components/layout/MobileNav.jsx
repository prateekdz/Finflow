import { Goal, Home, Lightbulb, Settings, Wallet, WalletCards } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/transactions', label: 'Transactions', icon: Wallet },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
  { to: '/budget', label: 'Budget', icon: WalletCards },
  { to: '/goals', label: 'Goals', icon: Goal },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--bg-glass)] pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="grid grid-cols-6">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-medium transition-colors duration-150',
                isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]',
              ].join(' ')
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
