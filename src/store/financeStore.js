import { create } from "zustand";
import { subDays } from "date-fns";

const initialTransactions = [
  { id: 1, date: subDays(new Date(), 1).toISOString(), description: "Reliance Industries Ltd", category: "stocks", type: "income", status: "Completed", amount: 25000 },
  { id: 2, date: subDays(new Date(), 2).toISOString(), description: "Monthly Salary", category: "salary", type: "income", status: "Completed", amount: 85000 },
  { id: 3, date: subDays(new Date(), 3).toISOString(), description: "Grocery Shopping", category: "food", type: "expense", status: "Completed", amount: 3200 },
  { id: 4, date: subDays(new Date(), 4).toISOString(), description: "HDFC Bank Dividend", category: "dividend", type: "income", status: "Completed", amount: 1250 },
  { id: 5, date: subDays(new Date(), 5).toISOString(), description: "Electricity Bill", category: "utilities", type: "expense", status: "Pending", amount: 1800 },
];

const initialHoldings = [
  { symbol: "RELIANCE", name: "Reliance Industries", exchange: "NSE", qty: 10, avg: 2450, ltp: 2789, sector: "Energy" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", exchange: "NSE", qty: 15, avg: 1580, ltp: 1623, sector: "Banking" },
  { symbol: "INFY", name: "Infosys Ltd", exchange: "NSE", qty: 20, avg: 1420, ltp: 1518, sector: "IT" },
  { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE", qty: 8, avg: 3980, ltp: 4120, sector: "IT" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", exchange: "NSE", qty: 25, avg: 925, ltp: 978, sector: "Banking" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd", exchange: "NSE", qty: 5, avg: 6890, ltp: 7234, sector: "Finance" },
  { symbol: "WIPRO", name: "Wipro Ltd", exchange: "NSE", qty: 30, avg: 415, ltp: 432, sector: "IT" },
  { symbol: "SBIN", name: "State Bank of India", exchange: "NSE", qty: 40, avg: 588, ltp: 612, sector: "Banking" },
];

const defaultTransactionFilters = {
  search: "",
  category: "all",
  type: "all",
  status: "all",
  sortBy: "date",
  sortOrder: "desc",
};

const initialFunds = {
  availableBalance: 48500,
  usedMargin: 12000,
  withdrawable: 36500,
  nextSettlement: 22000,
  monthlyInflow: 92500,
};

const initialFundHistory = [
  { date: "Jan 12, 2025", type: "credit", description: "IMPS from HDFC xxxx4821", amount: 25000 },
  { date: "Jan 05, 2025", type: "debit", description: "Withdrawal to HDFC xxxx4821", amount: 10000 },
  { date: "Dec 22, 2024", type: "credit", description: "NEFT from SBI xxxx9901", amount: 50000 },
  { date: "Dec 10, 2024", type: "debit", description: "Withdrawal to SBI xxxx9901", amount: 5000 },
  { date: "Dec 01, 2024", type: "credit", description: "IMPS from ICICI xxxx2210", amount: 15000 },
];

const defaultAllocation = [
  { name: "Stocks", value: 45 },
  { name: "Mutual Funds", value: 30 },
  { name: "Crypto", value: 15 },
  { name: "Bonds", value: 10 },
];

const initialTrend = [
  { date: "Nov", balance: 1065000 },
  { date: "Dec", balance: 1115000 },
  { date: "Jan", balance: 1158000 },
  { date: "Feb", balance: 1195000 },
  { date: "Mar", balance: 1232000 },
  { date: "Apr", balance: 1283000 },
];

const watchlist = [
  { symbol: "ZOMATO", price: "₹182.45", change: +2.4, up: true },
  { symbol: "PAYTM", price: "₹426.30", change: -1.2, up: false },
  { symbol: "NYKAA", price: "₹148.70", change: +0.8, up: true },
  { symbol: "ONGC", price: "₹258.90", change: +1.6, up: true },
];

const sortFunctions = {
  date: (a, b, order) => {
    const diff = new Date(a.date) - new Date(b.date);
    return order === "asc" ? diff : -diff;
  },
  amount: (a, b, order) => {
    const diff = a.amount - b.amount;
    return order === "asc" ? diff : -diff;
  },
};

export const useFinanceStore = create((set, get) => ({
  transactions: initialTransactions,
  filters: defaultTransactionFilters,
  holdings: initialHoldings,
  funds: initialFunds,
  fundHistory: initialFundHistory,
  watchlist,
  categoryBreakdown: defaultAllocation,
  balanceTrend: initialTrend,
  setTransactionFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetTransactionFilters: () => set({ filters: defaultTransactionFilters }),
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        {
          ...transaction,
          id: Date.now(),
          date: new Date().toISOString(),
          status: transaction.status || "Completed",
        },
        ...state.transactions,
      ],
    })),
  deleteTransaction: (id) => set((state) => ({ transactions: state.transactions.filter((tx) => tx.id !== id) })),
  addFunds: (amount, description) =>
    set((state) => ({
      funds: {
        ...state.funds,
        availableBalance: state.funds.availableBalance + amount,
        withdrawable: state.funds.withdrawable + amount,
      },
      fundHistory: [
        {
          date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          type: "credit",
          description,
          amount,
        },
        ...state.fundHistory,
      ],
    })),
  withdrawFunds: (amount, description) =>
    set((state) => ({
      funds: {
        ...state.funds,
        availableBalance: Math.max(0, state.funds.availableBalance - amount),
        withdrawable: Math.max(0, state.funds.withdrawable - amount),
      },
      fundHistory: [
        {
          date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          type: "debit",
          description,
          amount,
        },
        ...state.fundHistory,
      ],
    })),
  getVisibleTransactions: () => {
    const { transactions, filters } = get();
    return transactions
      .filter((transaction) => {
        if (filters.type !== "all" && transaction.type !== filters.type) return false;
        if (filters.category !== "all" && transaction.category !== filters.category) return false;
        if (filters.status !== "all" && transaction.status !== filters.status) return false;
        if (filters.search) {
          const search = filters.search.toLowerCase();
          return (
            transaction.description.toLowerCase().includes(search) ||
            transaction.category.toLowerCase().includes(search) ||
            transaction.type.toLowerCase().includes(search)
          );
        }
        return true;
      })
      .sort((a, b) => sortFunctions[filters.sortBy](a, b, filters.sortOrder));
  },
  getDashboardSummary: () => {
    const { holdings, funds } = get();
    const totalInvested = holdings.reduce((sum, holding) => sum + holding.avg * holding.qty, 0);
    const totalCurrent = holdings.reduce((sum, holding) => sum + holding.ltp * holding.qty, 0);
    const totalBalance = totalCurrent + funds.availableBalance;
    return {
      totalBalance,
      totalIncome: get().transactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0),
      totalExpenses: get().transactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0),
      balanceChange: totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0,
      incomeChange: 12.4,
      expenseChange: -3.8,
      totalInvested,
      totalCurrent,
    };
  },
  getPortfolioSummary: () => {
    const { holdings, funds } = get();
    const totalInvested = holdings.reduce((sum, holding) => sum + holding.avg * holding.qty, 0);
    const totalCurrent = holdings.reduce((sum, holding) => sum + holding.ltp * holding.qty, 0);
    return {
      totalInvested,
      totalCurrent,
      portfolioValue: totalCurrent + funds.availableBalance,
      balanceChange: totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0,
      sectorAllocation: holdings.reduce((acc, holding) => {
        acc[holding.sector] = (acc[holding.sector] || 0) + holding.qty * holding.ltp;
        return acc;
      }, {}),
    };
  },
  getInsightsAnalytics: () => {
    const transactions = get().transactions;
    const income = transactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = transactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
    const categoryTotals = transactions.reduce((acc, tx) => {
      if (tx.type === "expense") {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      }
      return acc;
    }, {});
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] || ["None", 0];
    return {
      topCategory: topCategory[0],
      topCategoryAmount: topCategory[1],
      monthlyComparison: income > 0 ? ((income - expenses) / income) * 100 : 0,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
      avgTransactionAmount: transactions.length ? transactions.reduce((sum, tx) => sum + tx.amount, 0) / transactions.length : 0,
      totalTransactions: transactions.length,
    };
  },
  getBalanceTrend: () => get().balanceTrend,
  getCategoryBreakdown: () => get().categoryBreakdown,
  getTopHoldings: () => get().holdings.slice().sort((a, b) => b.ltp * b.qty - a.ltp * a.qty).slice(0, 4),
}));
