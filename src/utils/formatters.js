/**
 * Format amount as Indian Rupees (₹)
 * Examples: 1000 → "₹1,000", 100000 → "₹1,00,000"
 */
export function formatINR(amount, decimals = 0) {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format amount as compact Indian Rupees
 * Examples: 1000000 → "₹10.00 L", 10000000 → "₹1.00 Cr"
 */
export function formatINRCompact(amount) {
  if (isNaN(amount)) return '₹0';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return formatINR(amount);
}

/**
 * Format date as "12 Mar" for display
 */
export function formatDate(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(dateObj);
}

/**
 * Format date as "12 Mar 2025"
 */
export function formatDateLong(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Format date as "Mar 2025" for charts
 */
export function formatMonthYear(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Format percentage with 1 decimal
 * Examples: 0.234 → "23.4%", 0.5 → "50.0%"
 */
export function formatPercent(value, decimals = 1) {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format date relative to today (Today, Yesterday, or date)
 */
export function formatDateRelative(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.getTime() === today.getTime()) {
    return 'Today';
  }
  if (date.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  return formatDate(dateStr);
}

/**
 * Format status badge
 */
export function formatStatusLabel(status) {
  const map = {
    cleared: 'Cleared',
    pending: 'Pending',
    cancelled: 'Cancelled',
  };
  return map[status] || status;
}

/**
 * Format transaction type label
 */
export function formatTypeLabel(type) {
  return type === 'income' ? 'Income' : 'Expense';
}

/**
 * Get status badge color class
 */
export function getStatusColor(status) {
  const map = {
    cleared: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return map[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
}

/**
 * Format large numbers compactly (K, L, Cr)
 */
export function formatCompactNumber(num) {
  if (num === 0) return '0';
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1e7) {
    return sign + (absNum / 1e7).toFixed(1).replace(/\.0$/, '') + 'Cr';
  }
  if (absNum >= 1e5) {
    return sign + (absNum / 1e5).toFixed(1).replace(/\.0$/, '') + 'L';
  }
  if (absNum >= 1e3) {
    return sign + (absNum / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return sign + absNum.toString();
}
