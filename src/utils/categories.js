export const expenseCategories = [
  { name: 'Food & Dining', icon: '🍔', color: '#f97316' },
  { name: 'Transport', icon: '🚗', color: '#3b82f6' },
  { name: 'Utilities', icon: '💡', color: '#eab308' },
  { name: 'Entertainment', icon: '🎬', color: '#ec4899' },
  { name: 'Shopping', icon: '🛍', color: '#8b5cf6' },
  { name: 'Healthcare', icon: '🏥', color: '#ef4444' },
  { name: 'Education', icon: '📚', color: '#06b6d4' },
  { name: 'Travel', icon: '✈', color: '#6366f1' },
];

export const incomeCategories = [
  { name: 'Salary', icon: '💼', color: '#22c55e' },
  { name: 'Freelance', icon: '💻', color: '#10b981' },
  { name: 'Investment Returns', icon: '📈', color: '#16a34a' },
  { name: 'Bonus', icon: '🎁', color: '#34d399' },
];

export const allCategories = [...expenseCategories, ...incomeCategories];

// Map category name to color
export const categoryColorMap = {
  ...Object.fromEntries(
    incomeCategories.map(c => [c.name, c.color])
  ),
  ...Object.fromEntries(
    expenseCategories.map(c => [c.name, c.color])
  ),
};

// Map category name to icon
export const categoryIconMap = {
  ...Object.fromEntries(
    incomeCategories.map(c => [c.name, c.icon])
  ),
  ...Object.fromEntries(
    expenseCategories.map(c => [c.name, c.icon])
  ),
};
