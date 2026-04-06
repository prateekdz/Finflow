import { Download, RotateCcw, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import useFinflowStore from '../store/useFinflowStore';

const avatars = ['RS', 'AK', 'PM', 'JD', 'SK', 'AR'];
const accents = ['indigo', 'violet', 'cyan', 'rose'];

export function Settings() {
  const role = useFinflowStore((state) => state.role);
  const setRole = useFinflowStore((state) => state.setRole);
  const darkMode = useFinflowStore((state) => state.darkMode);
  const toggleDarkMode = useFinflowStore((state) => state.toggleDarkMode);
  const settings = useFinflowStore((state) => state.settings);
  const updateSettings = useFinflowStore((state) => state.updateSettings);
  const resetFilters = useFinflowStore((state) => state.resetFilters);
  const resetToMockData = useFinflowStore((state) => state.resetToMockData);
  const showToast = useFinflowStore((state) => state.showToast);
  const [confirmReset, setConfirmReset] = useState(false);

  const previewAccent = useMemo(() => {
    const map = {
      indigo: '#6366f1',
      violet: '#8b5cf6',
      cyan: '#06b6d4',
      rose: '#f43f5e',
    };
    return map[settings.accentColor] ?? '#6366f1';
  }, [settings.accentColor]);

  const exportAllData = () => {
    const snapshot = window.localStorage.getItem('finflow-storage') ?? '{}';
    const blob = new Blob([snapshot], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'finflow-storage.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const ToggleRow = ({ title, description, active, onToggle }) => (
    <div className="flex items-center justify-between rounded-[18px] bg-[var(--bg-base)] p-4">
      <div>
        <p className="font-semibold text-[var(--text-primary)]">{title}</p>
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          active ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'
        }`}
      >
        {active ? 'On' : 'Off'}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Profile</h3>
            <div className="mt-5 flex flex-wrap gap-3">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => updateSettings({ userAvatar: avatar })}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold ${
                    settings.userAvatar === avatar
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                      : 'border-[var(--border)] text-[var(--text-secondary)]'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Name</span>
                <input
                  value={settings.userName}
                  onChange={(event) => updateSettings({ userName: event.target.value })}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Role</span>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-[var(--text-primary)]"
                >
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Appearance</h3>
            <div className="mt-5 space-y-4">
              <ToggleRow title="Dark Mode" description="Premium dark surfaces across the product." active={darkMode} onToggle={toggleDarkMode} />
              <ToggleRow
                title="Compact Mode"
                description="Reduce spacing and type scale slightly."
                active={settings.compactMode}
                onToggle={() => updateSettings({ compactMode: !settings.compactMode })}
              />
              <div>
                <p className="mb-3 font-semibold text-[var(--text-primary)]">Accent Color</p>
                <div className="flex flex-wrap gap-3">
                  {accents.map((accent) => (
                    <button
                      key={accent}
                      type="button"
                      onClick={() => updateSettings({ accentColor: accent })}
                      className={`rounded-[10px] border px-4 py-3 text-sm font-semibold capitalize ${
                        settings.accentColor === accent
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                          : 'border-[var(--border)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <span
                        className={`mr-2 inline-block h-3 w-3 rounded-full ${
                          accent === 'indigo'
                            ? 'bg-indigo-500'
                            : accent === 'violet'
                              ? 'bg-violet-500'
                              : accent === 'cyan'
                                ? 'bg-cyan-500'
                                : 'bg-rose-500'
                        }`}
                      />
                      {accent}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Display Preferences</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Currency Symbol</span>
                <select
                  value={settings.currency}
                  onChange={(event) => updateSettings({ currency: event.target.value })}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-[var(--text-primary)]"
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                </select>
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Date Format</span>
                <select
                  value={settings.dateFormat}
                  onChange={(event) => updateSettings({ dateFormat: event.target.value })}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-[var(--text-primary)]"
                >
                  <option value="DD MMM YYYY">DD MMM YYYY</option>
                  <option value="MMM DD, YYYY">MMM DD, YYYY</option>
                </select>
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Default Page</span>
                <select
                  value={settings.defaultPage}
                  onChange={(event) => updateSettings({ defaultPage: event.target.value })}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-[var(--text-primary)]"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="transactions">Transactions</option>
                  <option value="insights">Insights</option>
                  <option value="budget">Budget</option>
                  <option value="goals">Goals</option>
                </select>
              </label>
              <ToggleRow
                title="Show Ticker Bar"
                description="Visible on the dashboard header."
                active={settings.showTickerBar}
                onToggle={() => updateSettings({ showTickerBar: !settings.showTickerBar })}
              />
            </div>
          </section>

          <section className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Data Management</h3>
            <div className="mt-5 space-y-3">
              <Button type="button" variant="secondary" className="w-full justify-between" onClick={exportAllData}>
                <span>Export All Data as JSON</span>
                <Download className="h-4 w-4" />
              </Button>
              <Button type="button" variant="danger" className="w-full justify-between" onClick={() => setConfirmReset(true)}>
                <span>Reset to Mock Data</span>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full justify-between"
                onClick={() => {
                  resetFilters();
                  showToast({ title: 'Filters cleared' });
                }}
              >
                <span>Clear All Filters</span>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </section>
        </div>

        <section className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
          <PageHeader eyebrow="Preview" title="Live Settings Preview" subtitle="Your changes update the product instantly." actions={<Badge>{role === 'admin' ? 'Admin' : 'Viewer'}</Badge>} />
          <div className="mt-6 rounded-[18px] border border-[var(--border)] p-5" style={{ background: darkMode ? '#111111' : '#ffffff' }}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ backgroundColor: previewAccent }}>
                {settings.userAvatar}
              </div>
              <div>
                <p className="font-semibold" style={{ color: darkMode ? '#f5f5f7' : '#1d1d1f' }}>{settings.userName}</p>
                <p className="text-sm" style={{ color: darkMode ? '#98989d' : '#6e6e73' }}>
                  {darkMode ? 'Dark appearance' : 'Light appearance'} • {settings.accentColor} accent
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <div className="rounded-[18px] p-4" style={{ background: darkMode ? '#1c1c1e' : '#f5f5f7' }}>
                <p className="text-sm font-medium" style={{ color: darkMode ? '#98989d' : '#6e6e73' }}>Default Page</p>
                <p className="mt-1 font-semibold" style={{ color: darkMode ? '#f5f5f7' : '#1d1d1f' }}>{settings.defaultPage}</p>
              </div>
              <div className="rounded-[18px] p-4" style={{ background: darkMode ? '#1c1c1e' : '#f5f5f7' }}>
                <p className="text-sm font-medium" style={{ color: darkMode ? '#98989d' : '#6e6e73' }}>Ticker Visibility</p>
                <p className="mt-1 font-semibold" style={{ color: darkMode ? '#f5f5f7' : '#1d1d1f' }}>
                  {settings.showTickerBar ? 'Visible on dashboard' : 'Hidden for a quieter layout'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
        <PageHeader eyebrow="About" title="Finflow v1.0.0" subtitle="Built with React + Vite + Recharts + Zustand" actions={<Badge>Assignment submission by {settings.userName}</Badge>} />
      </section>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Reset to Mock Data" className="md:max-w-md">
        <p className="text-sm text-[var(--text-secondary)]">
          This will restore transactions, budgets, goals, recurring items, and filters to the seeded Finflow defaults.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => setConfirmReset(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              resetToMockData();
              setConfirmReset(false);
              showToast({ title: 'Finflow reset complete' });
            }}
          >
            Reset
          </Button>
        </div>
      </Modal>
    </div>
  );
}
