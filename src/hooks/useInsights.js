import { useMemo } from 'react';
import { eachMonthOfInterval, endOfMonth, format, parseISO, startOfMonth, subMonths } from 'date-fns';
import useFinflowStore, { CATEGORIES } from '../store/useFinflowStore';

const rangeToMonths = {
  month: 1,
  last3m: 3,
  last6m: 6,
  year: 12,
};

export function useInsights() {
  const transactions = useFinflowStore((state) => state.transactions);
  const selectedDateRange = useFinflowStore((state) => state.selectedDateRange);

  return useMemo(() => {
    const monthsBack = rangeToMonths[selectedDateRange] ?? 6;
    const end = endOfMonth(new Date('2026-03-31'));
    const start = startOfMonth(subMonths(end, monthsBack - 1));
    const months = eachMonthOfInterval({ start, end });
    const inRange = transactions.filter((tx) => {
      const date = parseISO(tx.date);
      return date >= start && date <= end;
    });

    const monthlyData = months.map((month) => {
      const key = format(month, 'yyyy-MM');
      const monthTransactions = inRange.filter((tx) => tx.date.startsWith(key));
      const income = monthTransactions
        .filter((tx) => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);
      const expenses = monthTransactions
        .filter((tx) => tx.type === 'expense')
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      return {
        monthKey: key,
        monthLabel: format(month, 'MMM'),
        income,
        expenses,
        net: income - expenses,
        count: monthTransactions.length,
      };
    });

    const expenseTransactions = inRange.filter((tx) => tx.type === 'expense');
    const totalExpenses = expenseTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const categoryRows = CATEGORIES.filter((item) => !['salary', 'freelance'].includes(item.id))
      .map((category) => {
        const items = expenseTransactions.filter((tx) => tx.category === category.id);
        const total = items.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
        return {
          ...category,
          total,
          percentage: totalExpenses ? (total / totalExpenses) * 100 : 0,
          transactions: items.length,
          average: items.length ? total / items.length : 0,
        };
      })
      .filter((row) => row.total > 0)
      .sort((a, b) => b.total - a.total);

    const pending = inRange.filter((tx) => tx.status === 'pending');
    const topCategory = categoryRows[0];
    const bestSavingsMonth = [...monthlyData].sort((a, b) => b.net - a.net)[0];
    const thisMonth = monthlyData[monthlyData.length - 1];
    const lastMonth = monthlyData[monthlyData.length - 2] ?? thisMonth;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayStats = days.map((label, index) => {
      const items = expenseTransactions.filter((tx) => parseISO(tx.date).getDay() === index);
      const total = items.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      return { label, total, average: items.length ? total / items.length : 0, count: items.length };
    });
    const busiestDay = [...dayStats].sort((a, b) => b.count - a.count)[0];

    const lastThreeMonthsStart = startOfMonth(subMonths(end, 2));
    const heatmapSource = transactions.filter((tx) => {
      const date = parseISO(tx.date);
      return date >= lastThreeMonthsStart && date <= end;
    });

    const heatmap = Array.from({ length: 12 }, (_, week) =>
      Array.from({ length: 7 }, (_, day) => {
        const items = heatmapSource.filter((tx) => {
          const date = parseISO(tx.date);
          const diffDays = Math.floor((date - lastThreeMonthsStart) / (1000 * 60 * 60 * 24));
          return Math.floor(diffDays / 7) === week && date.getDay() === day;
        });
        const total = items.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
        return { week, day, label: days[day], count: items.length, total };
      })
    ).flat();

    return {
      monthlyData,
      categoryRows,
      pending,
      topCategory,
      bestSavingsMonth,
      busiestDay,
      thisMonth,
      lastMonth,
      heatmap,
    };
  }, [selectedDateRange, transactions]);
}
