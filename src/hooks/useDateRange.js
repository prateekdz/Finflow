import { useMemo } from 'react';
import { subMonths, startOfDay, endOfDay } from 'date-fns';
import useFinflowStore from "../store/useFinflowStore";

export function useDateRange() {
  const selectedDateRange = useFinflowStore((s) => s.selectedDateRange);
  const dateFrom = useFinflowStore((s) => s.filters.dateFrom);
  const dateTo = useFinflowStore((s) => s.filters.dateTo);

  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    let start;
    let end = endOfDay(today);

    // Use custom dates if available
    if (dateFrom || dateTo) {
      start = dateFrom ? new Date(dateFrom) : startOfDay(subMonths(today, 6));
      end = dateTo ? new Date(dateTo) : endOfDay(today);
      return { startDate: start, endDate: end };
    }

    // Otherwise use preset
    switch (selectedDateRange) {
      case 'last1m':
        start = startOfDay(subMonths(today, 1));
        break;
      case 'last3m':
        start = startOfDay(subMonths(today, 3));
        break;
      case 'last6m':
        start = startOfDay(subMonths(today, 6));
        break;
      case 'last12m':
        start = startOfDay(subMonths(today, 12));
        break;
      case 'all':
      default:
        // Default to 6 months ago
        start = startOfDay(subMonths(today, 6));
        break;
    }

    return { startDate: start, endDate: end };
  }, [selectedDateRange, dateFrom, dateTo]);

  return { startDate, endDate };
}
