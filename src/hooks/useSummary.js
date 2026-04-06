import { useMemo } from 'react';
import { isWithinInterval } from 'date-fns';
import useFinflowStore from "../store/useFinflowStore";
import { useDateRange } from './useDateRange';

export function useSummary() {
  const transactions = useFinflowStore((s) => s.transactions);
  const { startDate, endDate } = useDateRange();

  // Get comparison period (previous same length)
  const periodLength = useMemo(() => Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  ), [startDate, endDate]);

  const prevStart = useMemo(() => {
    const date = new Date(startDate);
    date.setDate(date.getDate() - periodLength);
    return date;
  }, [startDate, periodLength]);

  const prevEnd = useMemo(() => {
    const date = new Date(startDate);
    date.setDate(date.getDate() - 1);
    return date;
  }, [startDate]);

  const summary = useMemo(() => {
    // Current period
    const currentFiltered = transactions.filter((t) =>
      isWithinInterval(new Date(t.date), {
        start: startDate,
        end: endDate,
      })
    );

    const currentIncome = currentFiltered
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpenses = currentFiltered
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Previous period for comparison
    const prevFiltered = transactions.filter((t) =>
      isWithinInterval(new Date(t.date), {
        start: prevStart,
        end: prevEnd,
      })
    );

    const prevIncome = prevFiltered
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const prevExpenses = prevFiltered
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate changes
    const incomeChangePercent =
      prevIncome === 0
        ? 0
        : ((currentIncome - prevIncome) / prevIncome) * 100;

    const expenseChangePercent =
      prevExpenses === 0
        ? 0
        : ((currentExpenses - prevExpenses) / prevExpenses) * 100;

    const totalBalance = currentIncome - currentExpenses;
    const savingsRate =
      currentIncome === 0
        ? 0
        : ((currentIncome - currentExpenses) / currentIncome) * 100;

    return {
      totalBalance: Math.max(totalBalance, 0), // Ensure non-negative
      totalIncome: currentIncome,
      totalExpenses: currentExpenses,
      savingsRate: Math.max(savingsRate, 0),
      incomeChangePercent,
      expenseChangePercent,
    };
  }, [transactions, startDate, endDate, prevStart, prevEnd]);

  return summary;
}
