import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { BUDGET_LIMITS, CATEGORIES, MOCK_GOALS, mockTransactions } from '../data/mockData';

export const defaultFilters = {
  search: '',
  type: 'all',
  category: 'all',
  dateFrom: '',
  dateTo: '',
  status: 'all',
  sortBy: 'date',
  sortDir: 'desc',
  amountMin: '',
  amountMax: '',
  account: 'all',
};

const recurringSeed = [
  {
    id: 'rec-1',
    title: 'Netflix',
    amount: 649,
    type: 'expense',
    frequency: 'monthly',
    nextDate: '2026-04-12',
    category: 'entertainment',
  },
  {
    id: 'rec-2',
    title: 'Rent',
    amount: 28500,
    type: 'expense',
    frequency: 'monthly',
    nextDate: '2026-04-08',
    category: 'bills',
  },
  {
    id: 'rec-3',
    title: 'Salary',
    amount: 85000,
    type: 'income',
    frequency: 'monthly',
    nextDate: '2026-05-01',
    category: 'salary',
  },
];

const sorters = {
  date: (a, b) => new Date(a.date) - new Date(b.date),
  amount: (a, b) => Math.abs(a.amount) - Math.abs(b.amount),
  category: (a, b) => a.category.localeCompare(b.category),
};

const makeId = () => Date.now() + Math.floor(Math.random() * 1000);

export function applyFilters(transactions, filters) {
  const search = filters.search.toLowerCase().trim();

  const filtered = transactions.filter((tx) => {
    if (search) {
      const haystack = [tx.description, tx.merchant, tx.category, tx.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if (filters.type !== 'all' && tx.type !== filters.type) return false;
    if (filters.category !== 'all' && tx.category !== filters.category) return false;
    if (filters.status !== 'all' && tx.status !== filters.status) return false;
    if (filters.account !== 'all' && tx.account !== filters.account) return false;
    if (filters.dateFrom && tx.date < filters.dateFrom) return false;
    if (filters.dateTo && tx.date > filters.dateTo) return false;
    if (filters.amountMin && Math.abs(tx.amount) < Number(filters.amountMin)) return false;
    if (filters.amountMax && Math.abs(tx.amount) > Number(filters.amountMax)) return false;

    return true;
  });

  filtered.sort((a, b) => {
    const sorter = sorters[filters.sortBy] ?? sorters.date;
    const factor = filters.sortDir === 'asc' ? 1 : -1;
    return sorter(a, b) * factor;
  });

  return filtered;
}

const useFinflowStore = create(
  persist(
    (set, get) => ({
      role: 'admin',
      darkMode: false,
      transactions: mockTransactions,
      filters: defaultFilters,
      selectedDateRange: 'last6m',
      budgetLimits: { ...BUDGET_LIMITS },
      goals: [...MOCK_GOALS],
      recurring: [...recurringSeed],
      settings: {
        currency: 'INR',
        dateFormat: 'DD MMM YYYY',
        userName: 'Rohan Sharma',
        userAvatar: 'RS',
        compactMode: false,
        showTickerBar: true,
        defaultPage: 'dashboard',
        notificationsEnabled: true,
        accentColor: 'indigo',
      },
      toast: null,

      setRole: (role) => set({ role }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      removeFilterValue: (key) =>
        set((state) => ({
          filters: { ...state.filters, [key]: defaultFilters[key] },
        })),
      resetFilters: () => set({ filters: defaultFilters }),
      setSelectedDateRange: (selectedDateRange) => set({ selectedDateRange }),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            {
              ...transaction,
              id: makeId(),
              createdAt: new Date().toISOString(),
            },
            ...state.transactions,
          ],
        })),
      editTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),
      deleteTransactions: (ids) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => !ids.includes(tx.id)),
        })),

      setBudgetLimit: (category, amount) =>
        set((state) => ({
          budgetLimits: {
            ...state.budgetLimits,
            [category]: Number(amount),
          },
        })),

      addGoal: (goal) =>
        set((state) => ({
          goals: [{ ...goal, id: makeId() }, ...state.goals],
        })),
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),

      addRecurring: (item) =>
        set((state) => ({
          recurring: [{ ...item, id: `rec-${makeId()}` }, ...state.recurring],
        })),
      updateRecurring: (id, updates) =>
        set((state) => ({
          recurring: state.recurring.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      deleteRecurring: (id) =>
        set((state) => ({
          recurring: state.recurring.filter((item) => item.id !== id),
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      resetToMockData: () =>
        set({
          transactions: mockTransactions,
          budgetLimits: { ...BUDGET_LIMITS },
          goals: [...MOCK_GOALS],
          recurring: [...recurringSeed],
          filters: defaultFilters,
        }),

      showToast: (toast) => set({ toast }),
      clearToast: () => set({ toast: null }),

      getFilteredTransactions: () => applyFilters(get().transactions, get().filters),
      getCategoryMeta: (id) => CATEGORIES.find((item) => item.id === id),
    }),
    {
      name: 'finflow-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        budgetLimits: state.budgetLimits,
        goals: state.goals,
        recurring: state.recurring,
        settings: state.settings,
        role: state.role,
        darkMode: state.darkMode,
        filters: state.filters,
        selectedDateRange: state.selectedDateRange,
      }),
    }
  )
);

export { CATEGORIES };
export default useFinflowStore;
