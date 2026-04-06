import { CATEGORIES, mockTransactions } from './mockData';

const income = mockTransactions
  .filter((tx) => tx.type === 'income')
  .reduce((sum, tx) => sum + tx.amount, 0);

const expenses = mockTransactions
  .filter((tx) => tx.type === 'expense')
  .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

const net = income - expenses;

export const MOCK_BALANCE_SUMMARY = {
  income,
  expenses,
  net,
  totalBalance: 245830 + net,
  savingsRate: income ? (net / income) * 100 : 0,
};

export const MOCK_RECENT_TRANSACTIONS = [...mockTransactions]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 8);

export const MOCK_SPENDING_BREAKDOWN = CATEGORIES
  .filter((category) => !['salary', 'freelance'].includes(category.id))
  .map((category) => {
    const items = mockTransactions.filter(
      (tx) => tx.type === 'expense' && tx.category === category.id
    );
    const amount = items.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return {
      ...category,
      amount,
      count: items.length,
      percentage: expenses ? (amount / expenses) * 100 : 0,
    };
  })
  .filter((item) => item.amount > 0)
  .sort((a, b) => b.amount - a.amount);
