import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, DollarSign, X } from 'lucide-react';

const categoryOptions = {
  expense: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Education', 'Others'],
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other Income'],
};

const accounts = ['Bank Account', 'Cash', 'Credit Card', 'Investment Account'];

const getCategoryIcon = (category) => {
  const icons = {
    Food: '🍽️',
    Transport: '🚗',
    Shopping: '🛍️',
    Entertainment: '🎬',
    Health: '🏥',
    Bills: '📄',
    Education: '📚',
    Salary: '💰',
    Freelance: '💻',
    Investment: '📈',
    Business: '🏢',
    Gift: '🎁',
  };

  return icons[category] || '💳';
};

const fieldClass =
  'mt-1 w-full rounded-[10px] border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)]';

const TransactionForm = ({ isOpen, onClose, onSubmit, initialData = null, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    amount: initialData?.amount || '',
    type: initialData?.type || 'expense',
    category: initialData?.category || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    account: initialData?.account || 'Bank Account',
    notes: initialData?.notes || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        id: initialData?.id || Date.now(),
        created_at: new Date().toISOString(),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewAmount = parseFloat(formData.amount) || 0;

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-4 z-50 overflow-hidden rounded-[18px] border md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-3xl md:-translate-x-1/2 md:-translate-y-1/2"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-elevated)' }}
          >
            <div className="flex items-center justify-between border-b p-6" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {mode === 'edit' ? 'Edit Transaction' : 'Add New Transaction'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 transition-opacity hover:opacity-75"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Close transaction form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-88px)] overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-[18px] border p-4" style={{ background: 'var(--bg-base)', borderColor: 'var(--border)' }}>
                  <p className="mb-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Preview
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-2xl">{getCategoryIcon(formData.category)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium" style={{ color: 'var(--text-primary)' }}>
                        {formData.description || 'Transaction description'}
                      </p>
                      <p className="truncate text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {formData.category || 'Category'} • {formData.account}
                      </p>
                    </div>
                    <div className={`font-mono text-lg font-bold ${formData.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.type === 'income' ? '+' : '-'}₹{previewAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Transaction Type
                  </label>
                  <div className="mt-2 flex gap-2">
                    {['expense', 'income'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleInputChange('type', type)}
                        className="flex-1 rounded-[10px] border px-4 py-2.5 text-sm font-medium transition-colors"
                        style={
                          formData.type === type
                            ? {
                                background: type === 'income' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                                borderColor: type === 'income' ? 'rgba(34,197,94,0.32)' : 'rgba(239,68,68,0.32)',
                                color: type === 'income' ? '#15803d' : '#dc2626',
                              }
                            : { background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }
                        }
                      >
                        {type === 'income' ? '💰 Income' : '💸 Expense'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Description *
                  </label>
                  <input
                    id="description"
                    type="text"
                    placeholder="e.g., Grocery shopping, Salary, Coffee"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={fieldClass}
                    style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Amount *
                  </label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className="w-full rounded-[10px] border py-2.5 pl-10 pr-3 font-mono text-sm outline-none transition-colors focus:border-[var(--accent)]"
                      style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="category" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Category *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={fieldClass}
                      style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      required
                    >
                      <option value="">Select category</option>
                      {categoryOptions[formData.type].map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="account" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Account
                    </label>
                    <select
                      id="account"
                      value={formData.account}
                      onChange={(e) => handleInputChange('account', e.target.value)}
                      className={fieldClass}
                      style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    >
                      {accounts.map((account) => (
                        <option key={account} value={account}>
                          {account}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Date *
                  </label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full rounded-[10px] border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[var(--accent)]"
                      style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    placeholder="Add any additional notes..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className={fieldClass}
                    style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-[10px] border px-4 py-2.5 text-sm font-semibold transition-all"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-[10px] px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
                    style={{ background: 'var(--accent)' }}
                  >
                    {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Transaction' : 'Add Transaction'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default TransactionForm;
