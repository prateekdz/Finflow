import { useMemo } from 'react';
import useFinflowStore, { CATEGORIES } from '../store/useFinflowStore';

export function useTransactions() {
  const transactions = useFinflowStore((state) => state.transactions);
  const filters = useFinflowStore((state) => state.filters);
  const getFilteredTransactions = useFinflowStore((state) => state.getFilteredTransactions);

  return useMemo(() => {
    const filteredTransactions = getFilteredTransactions();
    const income = filteredTransactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = filteredTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const net = income - expenses;

    const categoryBreakdown = CATEGORIES.map((category) => {
      const items = filteredTransactions.filter(
        (tx) => tx.type === 'expense' && tx.category === category.id
      );
      const amount = items.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      return {
        ...category,
        amount,
        percentage: expenses ? (amount / expenses) * 100 : 0,
        count: items.length,
      };
    }).filter((item) => item.amount > 0);

    const groupedByDate = filteredTransactions.reduce((groups, transaction) => {
      const key = transaction.date;
      if (!groups[key]) groups[key] = [];
      groups[key].push(transaction);
      return groups;
    }, {});

    const groupedByCategory = filteredTransactions.reduce((groups, transaction) => {
      const key = transaction.category;
      if (!groups[key]) groups[key] = [];
      groups[key].push(transaction);
      return groups;
    }, {});

    return {
      transactions,
      filteredTransactions,
      filters,
      groupedByDate,
      groupedByCategory,
      summary: {
        income,
        expenses,
        net,
        totalBalance: 245830 + net,
      },
      categoryBreakdown: categoryBreakdown.sort((a, b) => b.amount - a.amount),
    };
  }, [transactions, filters, getFilteredTransactions]);
}
