import { useMemo } from 'react';
import { isWithinInterval, format } from 'date-fns';
import { useFinflowStore } from '../store/useFinflowStore';
import { useDateRange } from './useDateRange';

export function useChartData() {
  const transactions = useFinflowStore((s) => s.transactions);
  const { startDate, endDate } = useDateRange();

  const chartData = useMemo(() => {
    // Group transactions by date
    const dateMap = new Map();

    transactions.forEach((t) => {
      if (
        !isWithinInterval(new Date(t.date), {
          start: startDate,
          end: endDate,
        })
      ) {
        return;
      }

      const dateKey = t.date; // ISO date string (YYYY-MM-DD)
      const existing = dateMap.get(dateKey) || { income: 0, expenses: 0 };

      if (t.type === 'income') {
        existing.income += t.amount;
      } else {
        existing.expenses += t.amount;
      }

      dateMap.set(dateKey, existing);
    });

    // Create data points and calculate cumulative net balance
    const points = [];
    let cumulativeNet = 0;

    // Sort dates
    const sortedDates = Array.from(dateMap.keys()).sort();

    sortedDates.forEach((dateStr) => {
      const data = dateMap.get(dateStr);
      const dateObj = new Date(dateStr);
      const net = data.income - data.expenses;
      cumulativeNet += net;

      points.push({
        date: format(dateObj, 'dd MMM'),
        dateObj,
        income: data.income,
        expenses: data.expenses,
        net: cumulativeNet,
      });
    });

    return points;
  }, [transactions, startDate, endDate]);

  return chartData;
}
