import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // UI state
  sidebarOpen: true,
  theme: 'light',
  currency: '₹',

  // Data state
  transactions: [],
  bills: [],
  goals: [],
  recurring: [],
  analytics: {
    summary: {},
    monthly: [],
    categories: []
  },

  // Loading states
  loading: {
    transactions: false,
    bills: false,
    goals: false,
    recurring: false,
    analytics: false
  },

  // Actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
  setCurrency: (currency) => set({ currency }),

  // Data actions
  setTransactions: (transactions) => set({ transactions }),
  setBills: (bills) => set({ bills }),
  setGoals: (goals) => set({ goals }),
  setRecurring: (recurring) => set({ recurring }),
  setAnalytics: (analytics) => set({ analytics }),

  // Loading actions
  setLoading: (key, loading) => set((state) => ({
    loading: { ...state.loading, [key]: loading }
  })),

  // API actions
  fetchTransactions: async (params = {}) => {
    set((state) => ({ loading: { ...state.loading, transactions: true } }));
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`http://localhost:3001/api/transactions?${query}`);
      const data = await response.json();
      set({ transactions: data });
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      set((state) => ({ loading: { ...state.loading, transactions: false } }));
    }
  },

  fetchBills: async () => {
    set((state) => ({ loading: { ...state.loading, bills: true } }));
    try {
      const response = await fetch('http://localhost:3001/api/bills');
      const data = await response.json();
      set({ bills: data });
    } catch (error) {
      console.error('Failed to fetch bills:', error);
    } finally {
      set((state) => ({ loading: { ...state.loading, bills: false } }));
    }
  },

  fetchGoals: async () => {
    set((state) => ({ loading: { ...state.loading, goals: true } }));
    try {
      const response = await fetch('http://localhost:3001/api/goals');
      const data = await response.json();
      set({ goals: data });
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      set((state) => ({ loading: { ...state.loading, goals: false } }));
    }
  },

  fetchRecurring: async () => {
    set((state) => ({ loading: { ...state.loading, recurring: true } }));
    try {
      const response = await fetch('http://localhost:3001/api/recurring');
      const data = await response.json();
      set({ recurring: data });
    } catch (error) {
      console.error('Failed to fetch recurring:', error);
    } finally {
      set((state) => ({ loading: { ...state.loading, recurring: false } }));
    }
  },

  fetchAnalytics: async () => {
    set((state) => ({ loading: { ...state.loading, analytics: true } }));
    try {
      const [summaryRes, monthlyRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:3001/api/analytics/summary'),
        fetch('http://localhost:3001/api/analytics/monthly'),
        fetch('http://localhost:3001/api/analytics/categories')
      ]);

      const [summary, monthly, categories] = await Promise.all([
        summaryRes.json(),
        monthlyRes.json(),
        categoriesRes.json()
      ]);

      set({ analytics: { summary, monthly, categories } });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      set((state) => ({ loading: { ...state.loading, analytics: false } }));
    }
  },

  // Add transaction
  addTransaction: async (transactionData) => {
    try {
      const response = await fetch('http://localhost:3001/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      const newTransaction = await response.json();

      // Update local state
      set((state) => ({
        transactions: [newTransaction, ...state.transactions]
      }));

      return newTransaction;
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    }
  }
}));