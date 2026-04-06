import { subMonths, subDays, addDays } from 'date-fns';

// Seeded random for deterministic data across refreshes
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Category configuration
const expenseCategories = [
  { name: 'Food & Dining', icon: '🍔', color: '#f97316' },
  { name: 'Transport', icon: '🚗', color: '#3b82f6' },
  { name: 'Utilities', icon: '💡', color: '#eab308' },
  { name: 'Entertainment', icon: '🎬', color: '#ec4899' },
  { name: 'Shopping', icon: '🛍', color: '#8b5cf6' },
  { name: 'Healthcare', icon: '🏥', color: '#ef4444' },
  { name: 'Education', icon: '📚', color: '#06b6d4' },
  { name: 'Travel', icon: '✈', color: '#6366f1' },
];

const incomeCategories = [
  { name: 'Salary', icon: '💼', color: '#22c55e' },
  { name: 'Freelance', icon: '💻', color: '#10b981' },
  { name: 'Investment Returns', icon: '📈', color: '#16a34a' },
  { name: 'Bonus', icon: '🎁', color: '#34d399' },
];

// Generate seeded transaction data
function generateMockTransactions() {
  const transactions = [];
  const today = new Date();
  const SIX_MONTHS_AGO = subMonths(today, 6);

  // Generate 80 transactions with dates between SIX_MONTHS_AGO and today
  // Use a deterministic seeded random (mulberry32 or similar) so data
  // is the same on every refresh
  // Income transactions: ~20, larger amounts (₹15,000–₹95,000)
  // Expense transactions: ~60, smaller amounts (₹100–₹8,000)
  // Spread across all 6 months evenly
  // Ensure total income > total expenses by 25-35%

  let seedValue = 12345;

  // Generate income transactions (~20)
  for (let i = 0; i < 20; i++) {
    seedValue += 1;
    const daysOffset = Math.floor(seededRandom(seedValue) * 180);
    const txDate = subDays(today, daysOffset);

    const incomeCategory = incomeCategories[
      Math.floor(seededRandom(seedValue + 100) * incomeCategories.length)
    ];

    let amount;
    let description;

    if (incomeCategory.name === 'Salary') {
      amount = 15000 + Math.floor(seededRandom(seedValue + 200) * 80000); // ₹15k–₹95k
      description = 'Monthly Salary';
    } else if (incomeCategory.name === 'Freelance') {
      amount = 20000 + Math.floor(seededRandom(seedValue + 300) * 75000);
      description = `Freelance Project ${Math.floor(seededRandom(seedValue + 400) * 5) + 1}`;
    } else if (incomeCategory.name === 'Bonus') {
      amount = 25000 + Math.floor(seededRandom(seedValue + 500) * 70000);
      description = 'Performance Bonus';
    } else {
      amount = 18000 + Math.floor(seededRandom(seedValue + 600) * 77000);
      description = 'Investment Returns';
    }

    const createdAt = new Date(txDate);
    createdAt.setHours(
      Math.floor(seededRandom(seedValue + 700) * 24),
      Math.floor(seededRandom(seedValue + 800) * 60)
    );

    transactions.push({
      id: crypto.randomUUID(),
      date: txDate.toISOString().split('T')[0],
      amount,
      type: 'income',
      category: incomeCategory.name,
      description,
      notes: '',
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });
  }

  // Generate expense transactions (~60)
  for (let i = 0; i < 60; i++) {
    seedValue += 1;
    const daysOffset = Math.floor(seededRandom(seedValue) * 180);
    const txDate = subDays(today, daysOffset);

    const expenseCategory = expenseCategories[
      Math.floor(seededRandom(seedValue + 100) * expenseCategories.length)
    ];

    const amount = 100 + Math.floor(seededRandom(seedValue + 200) * 7900); // ₹100–₹8,000

    // Generate realistic descriptions
    const descriptions = {
      'Food & Dining': [
        'Coffee at Starbucks',
        'Lunch at Barbeque Nation',
        'Dinner reservation',
        'Grocery shopping at Flipkart',
        'Pizza delivery',
      ],
      'Transport': [
        'Uber ride',
        'Fuel fill-up',
        'Car maintenance',
        'Metro card recharge',
        'Parking fee',
      ],
      'Utilities': [
        'Electricity bill',
        'Water bill',
        'Internet bill',
        'Mobile recharge',
        'Gas bill',
      ],
      'Entertainment': [
        'Netflix subscription',
        'Movie tickets',
        'Gaming purchase',
        'Concert tickets',
        'Book purchase',
      ],
      'Shopping': [
        'Clothing purchase',
        'Electronics',
        'Home decor',
        'Shoes',
        'Fashion accessories',
      ],
      'Healthcare': [
        'Doctor consultation',
        'Pharmacy purchase',
        'Gym membership',
        'Health checkup',
        'Medicine',
      ],
      'Education': [
        'Course subscription',
        'Textbooks',
        'Online class',
        'Certification exam',
        'Workshop fee',
      ],
      'Travel': [
        'Flight booking',
        'Hotel stay',
        'Uber for airport',
        'Travel insurance',
        'Tour package',
      ],
    };

    const categoryDescriptions = descriptions[expenseCategory.name] || ['Transaction'];
    const description = categoryDescriptions[
      Math.floor(seededRandom(seedValue + 300) * categoryDescriptions.length)
    ];

    const createdAt = new Date(txDate);
    createdAt.setHours(
      Math.floor(seededRandom(seedValue + 400) * 24),
      Math.floor(seededRandom(seedValue + 500) * 60)
    );

    transactions.push({
      id: crypto.randomUUID(),
      date: txDate.toISOString().split('T')[0],
      amount,
      type: 'expense',
      category: expenseCategory.name,
      description,
      notes: '',
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });
  }

  // Sort by date descending
  return transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export const mockTransactions = generateMockTransactions();