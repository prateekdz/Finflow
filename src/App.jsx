import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MobileNav } from './components/layout/MobileNav';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { BackToTop } from './components/ui/BackToTop';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageWrapper } from './components/ui/PageWrapper';
import { Skeleton } from './components/ui/Skeleton';
import { Toast } from './components/ui/Toast';
import useFinflowStore from './store/useFinflowStore';

const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const Transactions = lazy(() => import('./pages/Transactions').then((module) => ({ default: module.Transactions })));
const Insights = lazy(() => import('./pages/Insights').then((module) => ({ default: module.Insights })));
const Budget = lazy(() => import('./pages/Budget').then((module) => ({ default: module.Budget })));
const Goals = lazy(() => import('./pages/Goals').then((module) => ({ default: module.Goals })));
const Settings = lazy(() => import('./pages/Settings').then((module) => ({ default: module.Settings })));
const Analytics = lazy(() => import('./pages/Analytics').then((module) => ({ default: module.Analytics })));
const Bills = lazy(() => import('./pages/Bills').then((module) => ({ default: module.Bills })));
const Recurring = lazy(() => import('./pages/Recurring').then((module) => ({ default: module.Recurring })));

const pageMeta = {
  '/': { title: 'Dashboard', subtitle: 'A polished command center for your finances' },
  '/transactions': { title: 'Transactions', subtitle: 'Filter, review, and manage every movement of money' },
  '/insights': { title: 'Insights', subtitle: 'Your financial story, visualized' },
  '/budget': { title: 'Budget', subtitle: 'Track category limits and stay within plan' },
  '/goals': { title: 'Goals', subtitle: 'Build momentum toward every savings milestone' },
  '/settings': { title: 'Settings', subtitle: 'Personalize Finflow and manage your local data' },
  '/analytics': { title: 'Analytics', subtitle: 'Deeper reporting on merchants, savings, and long-term trends' },
  '/bills': { title: 'Bills', subtitle: 'Track due dates, overdue items, and payment status' },
  '/recurring': { title: 'Recurring', subtitle: 'Manage subscriptions, salary flows, and repeat expenses' },
};

export default function App() {
  const location = useLocation();
  const role = useFinflowStore((state) => state.role);
  const setRole = useFinflowStore((state) => state.setRole);
  const darkMode = useFinflowStore((state) => state.darkMode);
  const toggleDarkMode = useFinflowStore((state) => state.toggleDarkMode);
  const settings = useFinflowStore((state) => state.settings);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const currentMeta = pageMeta[location.pathname] ?? pageMeta['/'];

  const accentMap = {
    indigo: '#6366f1',
    violet: '#8b5cf6',
    cyan: '#06b6d4',
    rose: '#f43f5e',
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent', accentMap[settings.accentColor] ?? '#6366f1');
  }, [settings.accentColor]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200">
      <Sidebar role={role} setRole={setRole} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <AnimatePresence>
        {mobileSidebarOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              className="h-full w-72"
              onClick={(event) => event.stopPropagation()}
            >
              <Sidebar role={role} setRole={setRole} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className={`mx-auto max-w-7xl px-4 py-6 pb-28 md:px-6 md:pb-10 ${settings.compactMode ? 'text-[0.95rem]' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
              >
                <ErrorBoundary>
                  <Suspense
                    fallback={
                      <div className="space-y-4">
                        <Skeleton className="h-32 rounded-[18px]" />
                        <Skeleton className="h-80 rounded-[18px]" />
                      </div>
                    }
                  >
                    <PageWrapper>
                      <Routes location={location}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/insights" element={<Insights />} />
                        <Route path="/budget" element={<Budget />} />
                        <Route path="/goals" element={<Goals />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/bills" element={<Bills />} />
                        <Route path="/recurring" element={<Recurring />} />
                      </Routes>
                    </PageWrapper>
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <MobileNav />
      <BackToTop />
      <Toast />
    </div>
  );
}
