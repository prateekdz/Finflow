export function formatCurrency(value, options = {}) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

export function formatCompactCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatSignedCurrency(value) {
  const prefix = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${prefix}${formatCurrency(Math.abs(value))}`;
}
