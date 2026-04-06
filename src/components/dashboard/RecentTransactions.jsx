import { motion } from 'framer-motion';
import { formatINR } from '../../utils/formatters';
import { allCategories } from '../../utils/categories';

export function RecentTransactions({ transactions }) {
  const getCategoryInfo = (categoryName) => {
    return allCategories.find(cat => cat.name === categoryName) || allCategories[0];
  };

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-bg-card border border-border rounded-card p-6 shadow-sm"
      >
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-text-primary text-lg font-semibold mb-2">No Recent Transactions</h3>
          <p className="text-text-muted text-sm">Your recent transactions will appear here</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-bg-card border border-border rounded-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-text-primary text-lg font-semibold">Recent Transactions</h3>
        <p className="text-text-muted text-sm">Your latest financial activity</p>
      </div>

      <div className="space-y-3">
        {transactions.slice(0, 5).map((transaction, index) => {
          const categoryInfo = getCategoryInfo(transaction.category);
          const isIncome = transaction.type === 'income';

          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-bg-sunken transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: categoryInfo.color + '20' }}
                >
                  {categoryInfo.emoji}
                </div>
                <div>
                  <p className="text-text-primary font-medium text-sm">
                    {transaction.merchant}
                  </p>
                  <p className="text-text-muted text-xs">
                    {new Date(transaction.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short'
                    })} • {transaction.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-mono font-bold text-sm ${
                  isIncome ? 'text-gain' : 'text-loss'
                }`}>
                  {isIncome ? '+' : '-'}{formatINR(Math.abs(transaction.amount))}
                </p>
                <p className="text-text-muted text-xs">{transaction.account}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {transactions.length > 5 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-text-muted text-sm text-center">
            +{transactions.length - 5} more transactions
          </p>
        </div>
      )}
    </motion.div>
  );
}
