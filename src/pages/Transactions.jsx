import { AnimatePresence, motion } from 'framer-motion';
import { FileJson, FileSpreadsheet, FileText, Lock, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/button';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/skeleton';
import { Tooltip } from '../components/ui/tooltip';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useInitialLoad } from '../hooks/useInitialLoad';
import { useTransactions } from '../hooks/useTransactions';
import useFinflowStore, { CATEGORIES, defaultFilters } from '../store/useFinflowStore';
import { exportCSV } from '../utils/exportCSV';
import { exportJSON } from '../utils/exportJSON';
import { exportPDF } from '../utils/exportPDF';
import { addTransactionApi, deleteTransactionApi, fetchTransactions, updateTransactionApi } from '../utils/mockApi';
import { formatCurrency, formatSignedCurrency } from '../utils/formatCurrency';

const initialForm = {
  description: '',
  merchant: '',
  amount: '',
  type: 'expense',
  category: 'food',
  date: '2026-04-06',
  status: 'cleared',
  notes: '',
  account: 'HDFC Salary Account',
};

const inputClass =
  'w-full rounded-[10px] border px-4 py-3 text-sm outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]';

export function Transactions() {
  const role = useFinflowStore((s) => s.role);
  const filters = useFinflowStore((s) => s.filters);
  const setFilter = useFinflowStore((s) => s.setFilter);
  const removeFilterValue = useFinflowStore((s) => s.removeFilterValue);
  const resetFilters = useFinflowStore((s) => s.resetFilters);
  const addTransaction = useFinflowStore((s) => s.addTransaction);
  const editTransaction = useFinflowStore((s) => s.editTransaction);
  const deleteTransaction = useFinflowStore((s) => s.deleteTransaction);
  const deleteTransactions = useFinflowStore((s) => s.deleteTransactions);
  const getCategoryMeta = useFinflowStore((s) => s.getCategoryMeta);
  const showToast = useFinflowStore((s) => s.showToast);
  const { transactions, filteredTransactions, groupedByDate, groupedByCategory } = useTransactions();

  const loading = useInitialLoad(800);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebouncedValue(searchInput, 200);
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [groupBy, setGroupBy] = useState('none');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formState, setFormState] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let active = true;
    fetchTransactions(transactions)
      .then(() => {
        if (!active) return;
        setApiLoading(false);
        setApiError('');
      })
      .catch(() => {
        if (!active) return;
        setApiLoading(false);
        setApiError('Unable to load transactions right now.');
      });
    return () => {
      active = false;
    };
  }, [transactions]);

  useEffect(() => {
    setFilter('search', debouncedSearch);
  }, [debouncedSearch, setFilter]);

  useEffect(() => {
    setPage(1);
  }, [filters, pageSize]);

  const stats = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { income, expenses, total: income - expenses, count: filteredTransactions.length };
  }, [filteredTransactions]);

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page, pageSize]);

  const activeChips = [
    filters.search && { key: 'search', label: filters.search },
    filters.type !== 'all' && { key: 'type', label: filters.type },
    filters.category !== 'all' && { key: 'category', label: getCategoryMeta(filters.category)?.label ?? filters.category },
    filters.status !== 'all' && { key: 'status', label: filters.status },
    filters.dateFrom && { key: 'dateFrom', label: `From ${filters.dateFrom}` },
    filters.dateTo && { key: 'dateTo', label: `To ${filters.dateTo}` },
    filters.amountMin && { key: 'amountMin', label: `Min ${filters.amountMin}` },
    filters.amountMax && { key: 'amountMax', label: `Max ${filters.amountMax}` },
    filters.account !== 'all' && { key: 'account', label: filters.account },
  ].filter(Boolean);

  const accounts = [...new Set(transactions.map((tx) => tx.account).filter(Boolean))];

  const exportRows = filteredTransactions.map((tx) => ({
    ID: tx.id,
    Date: tx.date,
    Description: tx.description,
    Merchant: tx.merchant,
    Type: tx.type,
    Category: getCategoryMeta(tx.category)?.label ?? tx.category,
    Amount: tx.amount,
    Status: tx.status,
    Account: tx.account,
    Notes: tx.notes,
  }));

  const validate = () => {
    const next = {};
    if (!formState.description.trim()) next.description = 'Required';
    if (!formState.merchant.trim()) next.merchant = 'Required';
    if (!formState.date) next.date = 'Required';
    if (!formState.amount || Number(formState.amount) <= 0) next.amount = 'Enter valid amount';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const groupedEntries = useMemo(() => {
    if (groupBy === 'date') return Object.entries(groupedByDate).sort((a, b) => b[0].localeCompare(a[0]));
    if (groupBy === 'category') return Object.entries(groupedByCategory).sort((a, b) => a[0].localeCompare(b[0]));
    return [];
  }, [groupBy, groupedByCategory, groupedByDate]);

  const openAdd = () => {
    setEditingId(null);
    setFormState(initialForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (tx) => {
    setEditingId(tx.id);
    setFormState({
      description: tx.description,
      merchant: tx.merchant,
      amount: Math.abs(tx.amount).toString(),
      type: tx.type,
      category: tx.category,
      date: tx.date,
      status: tx.status,
      notes: tx.notes ?? '',
      account: tx.account ?? 'HDFC Salary Account',
    });
    setErrors({});
    setModalOpen(true);
  };

  const submit = () => {
    if (!validate()) return;
    const payload = {
      ...formState,
      amount: formState.type === 'expense' ? -Math.abs(Number(formState.amount)) : Math.abs(Number(formState.amount)),
    };
    const run = async () => {
      if (editingId) {
        await updateTransactionApi(editingId, payload);
        editTransaction(editingId, payload);
        showToast({ title: 'Transaction updated', description: payload.description });
      } else {
        await addTransactionApi(payload);
        addTransaction(payload);
        showToast({ title: 'Transaction added', description: payload.description });
      }
      setModalOpen(false);
    };
    run();
  };

  const handleDelete = (transaction) => {
    const run = async () => {
      await deleteTransactionApi(transaction.id);
      deleteTransaction(transaction.id);
      showToast({ title: 'Transaction deleted', description: transaction.description });
      setDeleteTarget(null);
    };
    run();
  };

  const toggleRowSelection = (id) =>
    setSelectedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));

  const togglePageSelection = () => {
    const ids = paginated.map((tx) => tx.id);
    const allOnPage = ids.every((id) => selectedIds.includes(id));
    setSelectedIds((current) => (allOnPage ? current.filter((id) => !ids.includes(id)) : [...new Set([...current, ...ids])]));
  };

  const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(defaultFilters);

  return (
    <div className="space-y-6">
      <section
        className="flex flex-col gap-4 rounded-[18px] border p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Transaction workspace
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Search, filter, group, edit, and export every transaction without losing context.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{filteredTransactions.length} transactions</Badge>
          {role === 'viewer' ? <Badge><Lock className="h-3.5 w-3.5" /> Read only</Badge> : null}
          {role === 'admin' ? (
            <Button type="button" onClick={openAdd}>
              <Plus className="h-4 w-4" /> Add Transaction
            </Button>
          ) : null}
        </div>
      </section>

      <div className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)]/95 p-4 shadow-[var(--shadow-card)] md:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--text-secondary)' }}>
              Filter Workspace
            </p>
            <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
              Live filters keep the list, grouped view, and export set aligned in one place.
            </p>
          </div>
          <Badge>{role === 'admin' ? 'Admin tools enabled' : 'Viewer mode keeps this page read-only'}</Badge>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-12">
          <div className="relative sm:col-span-2 xl:col-span-4">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search transactions..." className={`${inputClass} pl-11`} style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }} />
          </div>
          <select value={filters.type} onChange={(e) => setFilter('type', e.target.value)} className={`${inputClass} xl:col-span-1`} style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <option value="all">All Types</option><option value="income">Income</option><option value="expense">Expense</option>
          </select>
          <select value={filters.category} onChange={(e) => setFilter('category', e.target.value)} className={`${inputClass} xl:col-span-2`} style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <option value="all">All Categories</option>
            {CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
          </select>
          <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className={`${inputClass} xl:col-span-1`} style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <option value="all">All Statuses</option><option value="cleared">Cleared</option><option value="pending">Pending</option><option value="cancelled">Cancelled</option>
          </select>
          <input type="date" value={filters.dateFrom} onChange={(e) => setFilter('dateFrom', e.target.value)} className={`${inputClass} xl:col-span-1`} style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }} />
          <input type="date" value={filters.dateTo} onChange={(e) => setFilter('dateTo', e.target.value)} className={`${inputClass} xl:col-span-1`} style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }} />
          <select
            value={`${filters.sortBy}:${filters.sortDir}`}
            onChange={(e) => {
              const [sortBy, sortDir] = e.target.value.split(':');
              setFilter('sortBy', sortBy);
              setFilter('sortDir', sortDir);
            }}
            className={`${inputClass} xl:col-span-1`}
            style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
          >
            <option value="date:desc">Date: Newest</option>
            <option value="date:asc">Date: Oldest</option>
            <option value="amount:desc">Amount: High-Low</option>
            <option value="amount:asc">Amount: Low-High</option>
            <option value="category:asc">Category: A-Z</option>
          </select>
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className={`${inputClass} xl:col-span-1`} style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <option value="none">Group: None</option>
            <option value="date">Group: Date</option>
            <option value="category">Group: Category</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdvanced((current) => !current)}>
            {showAdvanced ? 'Hide Advanced Filters' : 'Advanced Filters'}
          </Button>
          {hasActiveFilters ? (
            <Button type="button" variant="secondary" size="sm" onClick={() => { setSearchInput(''); resetFilters(); }}>
              Reset filters
            </Button>
          ) : null}
        </div>

        <AnimatePresence>
          {showAdvanced ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid gap-3 rounded-[18px] border border-[var(--border)] bg-[var(--bg-base)] p-4 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min amount"
                    value={filters.amountMin}
                    onChange={(e) => setFilter('amountMin', e.target.value)}
                    className={inputClass}
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  />
                  <span className="text-[var(--text-muted)]">-</span>
                  <input
                    type="number"
                    placeholder="Max amount"
                    value={filters.amountMax}
                    onChange={(e) => setFilter('amountMax', e.target.value)}
                    className={inputClass}
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  />
                </div>
                <select value={filters.account} onChange={(e) => setFilter('account', e.target.value)} className={inputClass} style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                  <option value="all">All Accounts</option>
                  {accounts.map((account) => (
                    <option key={account} value={account}>
                      {account}
                    </option>
                  ))}
                </select>
                <div className="flex items-center text-sm text-[var(--text-secondary)]">
                  Refine by amount range, funding account, and grouping without leaving the page.
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-4 flex flex-wrap gap-2">
          <AnimatePresence>
            {activeChips.map((chip) => (
              <motion.button
                key={chip.key}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                type="button"
                onClick={() => {
                  if (chip.key === 'search') setSearchInput('');
                  removeFilterValue(chip.key);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300"
              >
                <X className="h-3.5 w-3.5" /> {chip.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)]"><p className="text-sm text-[var(--text-secondary)]">Showing</p><p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{stats.count}</p></div>
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)]"><p className="text-sm text-[var(--text-secondary)]">Total</p><p className="mt-2 font-mono text-2xl font-bold text-[var(--text-primary)]">{formatSignedCurrency(stats.total)}</p></div>
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)]"><p className="text-sm text-[var(--text-secondary)]">Income</p><p className="mt-2 font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(stats.income)}</p></div>
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)]"><p className="text-sm text-[var(--text-secondary)]">Expenses</p><p className="mt-2 font-mono text-2xl font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(stats.expenses)}</p></div>
      </div>

      {selectedIds.length ? (
        <div className="flex flex-wrap items-center gap-3 rounded-[18px] border p-4" style={{ borderColor: 'rgba(220,38,38,0.18)', background: 'rgba(220,38,38,0.06)' }}>
          <Badge>{selectedIds.length} selected</Badge>
          {role === 'admin' ? (
            <Button type="button" variant="danger" onClick={() => { deleteTransactions(selectedIds); setSelectedIds([]); showToast({ title: 'Selected transactions deleted' }); }}>
              Delete Selected
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={() => exportJSON(exportRows.filter((row) => selectedIds.includes(row.ID)), 'finflow-selected')}>
            Export Selected
          </Button>
        </div>
      ) : null}

      <section className="rounded-[18px] border p-4 shadow-sm" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Results</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {groupBy === 'none' ? 'Table and cards stay in sync with the active filters.' : `Grouped by ${groupBy}.`}
            </p>
          </div>
          <Badge>{filteredTransactions.length} visible</Badge>
        </div>
        {loading || apiLoading ? (
          <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>
        ) : apiError ? (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
            {apiError}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your filters."
            action={{ label: 'Reset Filters', onClick: () => { setSearchInput(''); resetFilters(); } }}
          />
        ) : groupBy !== 'none' ? (
          <div className="space-y-5">
            {groupedEntries.map(([group, items]) => (
              <section key={group} className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-4 dark:border-[#1f1f1f] dark:bg-[#0f0f0f]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {groupBy === 'date'
                      ? new Date(group).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                      : getCategoryMeta(group)?.label ?? group}
                  </h3>
                  <Badge>{items.length} items</Badge>
                </div>
                <div className="space-y-3">
                  {items.map((tx) => {
                    const category = getCategoryMeta(tx.category);
                    return (
                      <div key={tx.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#1f1f1f] dark:bg-[#111111] md:grid-cols-[4px,auto,1fr,auto] md:items-center">
                        <div className="h-full rounded-full" style={{ backgroundColor: category.color }} />
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg" style={{ backgroundColor: `${category.color}18` }}>{category.emoji}</div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{tx.description}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{tx.merchant}</p>
                        </div>
                        <p className={`text-right font-mono font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{formatSignedCurrency(tx.amount)}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-10 bg-white dark:bg-[#111111]">
                  <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="pb-3"><input type="checkbox" checked={paginated.length > 0 && paginated.every((tx) => selectedIds.includes(tx.id))} onChange={togglePageSelection} /></th>
                    <th className="pb-3">Icon</th><th className="pb-3">Description</th><th className="pb-3">Category</th><th className="pb-3">Date</th><th className="pb-3 text-right">Amount</th><th className="pb-3">Status</th><th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((tx) => {
                    const category = getCategoryMeta(tx.category);
                    return (
                      <Fragment key={tx.id}>
                        <tr className="border-b border-slate-100 hover:bg-slate-50/70 dark:border-slate-900 dark:hover:bg-slate-900/40">
                          <td className="py-4"><input type="checkbox" checked={selectedIds.includes(tx.id)} onChange={() => toggleRowSelection(tx.id)} /></td>
                          <td className="py-4"><button type="button" onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)} className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg" style={{ backgroundColor: `${category.color}18` }}>{category.emoji}</button></td>
                          <td className="py-4"><p className="font-semibold text-slate-950 dark:text-white">{tx.description}</p><p className="text-xs text-slate-500 dark:text-slate-400">{tx.merchant}</p></td>
                          <td className="py-4"><Badge>{category.label}</Badge></td>
                          <td className="py-4">{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td className={`py-4 text-right font-mono font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{formatSignedCurrency(tx.amount)}</td>
                          <td className="py-4"><Badge>{tx.status === 'cleared' ? 'Cleared' : tx.status === 'pending' ? 'Pending' : 'Cancelled'}</Badge></td>
                          <td className="py-4 text-right">{role === 'admin' ? <div className="inline-flex gap-2"><Tooltip content="Edit transaction"><button type="button" aria-label="Edit transaction" onClick={() => openEdit(tx)} className="rounded-xl border border-slate-200 p-2 dark:border-slate-700"><Pencil className="h-4 w-4" /></button></Tooltip><Tooltip content="Delete transaction"><button type="button" aria-label="Delete transaction" onClick={() => setDeleteTarget(tx)} className="rounded-xl border border-rose-200 p-2 text-rose-600 dark:border-rose-900"><Trash2 className="h-4 w-4" /></button></Tooltip></div> : null}</td>
                        </tr>
                        <AnimatePresence>
                          {expandedId === tx.id ? (
                            <tr>
                              <td colSpan="8" className="p-0">
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-900/60">
                                  <div className="grid gap-3 md:grid-cols-4">
                                    <div><p className="text-xs text-slate-500">Date-time</p><p>{tx.date} 10:00 AM</p></div>
                                    <div><p className="text-xs text-slate-500">Transaction ID</p><p className="font-mono">{tx.id}</p></div>
                                    <div><p className="text-xs text-slate-500">Account</p><p>{tx.account}</p></div>
                                    <div><p className="text-xs text-slate-500">Notes</p><p>{tx.notes}</p></div>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          ) : null}
                        </AnimatePresence>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 lg:hidden">
              {paginated.map((tx) => {
                const category = getCategoryMeta(tx.category);
                return (
                  <div key={tx.id} className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <input type="checkbox" checked={selectedIds.includes(tx.id)} onChange={() => toggleRowSelection(tx.id)} className="mt-1" />
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg" style={{ backgroundColor: `${category.color}18` }}>{category.emoji}</div>
                        <div><p className="font-semibold text-slate-950 dark:text-white">{tx.description}</p><p className="text-xs text-slate-500 dark:text-slate-400">{tx.merchant}</p></div>
                      </div>
                      <p className={`font-mono text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{formatSignedCurrency(tx.amount)}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2"><Badge>{category.label}</Badge><Badge>{tx.status}</Badge></div>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    {role === 'admin' ? <div className="mt-4 flex gap-2"><button type="button" onClick={() => openEdit(tx)} className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold dark:border-slate-700">Edit</button><button type="button" onClick={() => setDeleteTarget(tx)} className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white">Delete</button></div> : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredTransactions.length)} of {filteredTransactions.length} transactions</p>
              <div className="flex flex-wrap items-center gap-3">
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className={inputClass} style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>{[10, 25, 50].map((size) => <option key={size} value={size}>{size} / page</option>)}</select>
                <Button type="button" variant="secondary" onClick={() => setPage((current) => Math.max(1, current - 1))}>Prev</Button>
                <Badge>Page {page} of {pageCount}</Badge>
                <Button type="button" variant="secondary" onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Next</Button>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="rounded-[18px] border p-4 shadow-sm" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Export filtered results</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Downloads only the transactions currently visible on this page state.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={() => exportCSV(exportRows, 'finflow-transactions')}><FileSpreadsheet className="h-4 w-4" /> Export CSV</Button>
            <Button type="button" variant="secondary" onClick={() => exportJSON(exportRows, 'finflow-transactions')}><FileJson className="h-4 w-4" /> Export JSON</Button>
            <Button type="button" variant="secondary" onClick={() => { const ok = exportPDF(filteredTransactions); if (!ok) showToast({ title: 'Popup blocked', description: 'Allow popups to export PDF.' }); }}><FileText className="h-4 w-4" /> Export PDF</Button>
          </div>
        </div>
      </section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Transaction' : 'Add Transaction'}>
        <div className="max-h-[72vh] overflow-y-auto pr-1">
          <div className="grid gap-4 xl:grid-cols-[1.15fr,0.85fr]">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Description</p>
                  <input
                    value={formState.description}
                    onChange={(e) => setFormState((current) => ({ ...current, description: e.target.value }))}
                    className={`${inputClass} ${errors.description ? 'border-rose-400' : ''}`}
                    style={{ borderColor: errors.description ? '#fb7185' : 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Merchant</p>
                  <input
                    value={formState.merchant}
                    onChange={(e) => setFormState((current) => ({ ...current, merchant: e.target.value }))}
                    className={`${inputClass} ${errors.merchant ? 'border-rose-400' : ''}`}
                    style={{ borderColor: errors.merchant ? '#fb7185' : 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Amount</p>
                  <input
                    type="number"
                    value={formState.amount}
                    onChange={(e) => setFormState((current) => ({ ...current, amount: e.target.value }))}
                    className={`${inputClass} ${errors.amount ? 'border-rose-400' : ''}`}
                    style={{ borderColor: errors.amount ? '#fb7185' : 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Type</p>
                  <select
                    value={formState.type}
                    onChange={(e) => setFormState((current) => ({ ...current, type: e.target.value, category: e.target.value === 'income' ? 'salary' : 'food' }))}
                    className={inputClass}
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Category</p>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState((current) => ({ ...current, category: e.target.value }))}
                    className={inputClass}
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  >
                    {CATEGORIES.filter((c) => (formState.type === 'income' ? ['salary', 'freelance'].includes(c.id) : !['salary', 'freelance'].includes(c.id))).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Date</p>
                  <input
                    type="date"
                    value={formState.date}
                    onChange={(e) => setFormState((current) => ({ ...current, date: e.target.value }))}
                    className={`${inputClass} ${errors.date ? 'border-rose-400' : ''}`}
                    style={{ borderColor: errors.date ? '#fb7185' : 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Status</p>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState((current) => ({ ...current, status: e.target.value }))}
                    className={inputClass}
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  >
                    <option value="cleared">Cleared</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Account</p>
                  <input
                    value={formState.account}
                    onChange={(e) => setFormState((current) => ({ ...current, account: e.target.value }))}
                    className={inputClass}
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Notes</p>
                <textarea
                  rows="4"
                  value={formState.notes}
                  onChange={(e) => setFormState((current) => ({ ...current, notes: e.target.value }))}
                  className={inputClass}
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
            <div
              className="h-fit rounded-[18px] border p-5"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}
            >
              <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Live preview</p>
              <div
                className="mt-4 rounded-[18px] border p-5"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}
              >
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {formState.description || 'Transaction title'}
                </p>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {formState.merchant || 'Merchant'}
                </p>
                <p className={`mt-4 font-mono text-lg font-semibold ${formState.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {formState.type === 'income' ? '+' : '-'}
                  {formatCurrency(Number(formState.amount || 0))}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{getCategoryMeta(formState.category)?.label ?? formState.category}</Badge>
                  <Badge>{formState.status}</Badge>
                </div>
                <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {formState.date || 'Choose a date'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={submit}>
            Save Transaction
          </Button>
        </div>
      </Modal>

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Delete Transaction" className="md:max-w-md">
        {deleteTarget ? (
          <>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              "{deleteTarget.description}" {formatSignedCurrency(deleteTarget.amount)}
            </p>
            <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>This cannot be undone.</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button type="button" variant="danger" onClick={() => handleDelete(deleteTarget)}>
                Delete Forever
              </Button>
            </div>
          </>
        ) : null}
      </Modal>
    </div>
  );
}

