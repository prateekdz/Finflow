import confetti from 'canvas-confetti';
import { differenceInCalendarMonths, format } from 'date-fns';
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { ProgressBar } from '../components/ui/ProgressBar';
import useFinflowStore from '../store/useFinflowStore';
import { formatCurrency } from '../utils/formatCurrency';

const initialGoal = {
  title: '',
  target: '',
  saved: '',
  deadline: '2026-12-31',
  emoji: '🎯',
  color: '#6366f1',
};

const emojiOptions = ['🛡️', '💻', '✈️', '🏠', '🎓', '🚗', '📷', '🎯', '💎', '🪙', '🎮', '📚'];

function GoalRing({ percent, color, emoji }) {
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference;

  return (
    <div className="relative">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r="34" stroke="rgba(120,120,128,0.18)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="45"
          cy="45"
          r="34"
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl">{emoji}</span>
    </div>
  );
}

function useGoalCelebration(goals) {
  useEffect(() => {
    goals
      .filter((goal) => goal.saved >= goal.target)
      .forEach((goal) => {
        const key = `finflow-goal-complete-${goal.id}`;
        if (!window.localStorage.getItem(key)) {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          window.localStorage.setItem(key, '1');
        }
      });
  }, [goals]);
}

export function Goals() {
  const role = useFinflowStore((state) => state.role);
  const goals = useFinflowStore((state) => state.goals);
  const addGoal = useFinflowStore((state) => state.addGoal);
  const updateGoal = useFinflowStore((state) => state.updateGoal);
  const deleteGoal = useFinflowStore((state) => state.deleteGoal);
  const showToast = useFinflowStore((state) => state.showToast);
  const [goalForm, setGoalForm] = useState(initialGoal);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [moneyGoal, setMoneyGoal] = useState(null);
  const [moneyAmount, setMoneyAmount] = useState('');

  useGoalCelebration(goals);

  const activeGoals = useMemo(() => goals.filter((goal) => goal.saved < goal.target), [goals]);
  const completedGoals = useMemo(() => goals.filter((goal) => goal.saved >= goal.target), [goals]);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalPercent = totalTarget ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const openGoalModal = (goal = null) => {
    setEditingGoal(goal);
    setGoalForm(goal ? { ...goal } : initialGoal);
    setGoalModalOpen(true);
  };

  const saveGoal = () => {
    const payload = {
      ...goalForm,
      target: Number(goalForm.target),
      saved: Number(goalForm.saved),
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, payload);
      showToast({ title: 'Goal updated', description: payload.title });
    } else {
      addGoal(payload);
      showToast({ title: 'Goal created', description: payload.title });
    }

    setGoalModalOpen(false);
  };

  const addMoney = () => {
    const amount = Number(moneyAmount);
    if (!moneyGoal || !amount) return;

    const nextSaved = moneyGoal.saved + amount;
    updateGoal(moneyGoal.id, { saved: nextSaved });
    showToast({
      title: `Great! You're now ${Math.round((nextSaved / moneyGoal.target) * 100)}% of the way there`,
    });
    setMoneyGoal(null);
    setMoneyAmount('');
  };

  const deadlineTone = (deadline) => {
    const months = differenceInCalendarMonths(new Date(deadline), new Date('2026-04-06'));
    if (months < 1) return 'bg-[#ff3b30]/10 text-[#ff3b30]';
    if (months < 6) return 'bg-[#ff9500]/10 text-[#ff9500]';
    return 'bg-[#34c759]/10 text-[#34c759]';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3">
        {role === 'admin' ? (
          <Button type="button" onClick={() => openGoalModal()}>
            <PlusCircle className="h-4 w-4" />
            Add Goal
          </Button>
        ) : null}
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-[var(--text-secondary)]">Active Goals</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{activeGoals.length}</p>
        </div>
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-[var(--text-secondary)]">Total Target</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(totalTarget)}</p>
        </div>
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-[var(--text-secondary)]">Total Saved</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(totalSaved)}</p>
        </div>
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-[var(--text-secondary)]">Overall Progress</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{totalPercent}%</p>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {activeGoals.map((goal) => {
          const percent = Math.round((goal.saved / goal.target) * 100);
          const months = Math.max(1, differenceInCalendarMonths(new Date(goal.deadline), new Date('2026-04-06')));
          const monthlyNeed = Math.max(0, (goal.target - goal.saved) / months);

          return (
            <motion.section
              key={goal.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5"
              style={{ borderTopWidth: 4, borderTopColor: goal.color }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <GoalRing percent={percent} color={goal.color} emoji={goal.emoji} />
                  <div>
                    <p className="text-xl font-semibold text-[var(--text-primary)]">{goal.title}</p>
                    <p className="mt-1 font-mono text-sm text-[var(--text-secondary)]">
                      {formatCurrency(goal.saved)} saved of {formatCurrency(goal.target)}
                    </p>
                  </div>
                </div>
                <Badge className={deadlineTone(goal.deadline)}>Deadline {format(new Date(goal.deadline), 'dd MMM yyyy')}</Badge>
              </div>

              <div className="mt-5">
                <ProgressBar value={percent} color={goal.color} trackClassName="h-2 bg-black/5 dark:bg-white/10" />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--text-secondary)]">
                <span>{formatCurrency(goal.target - goal.saved)} remaining</span>
                <span>Need {formatCurrency(monthlyNeed)}/month</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button type="button" onClick={() => setMoneyGoal(goal)}>
                  + Add Money
                </Button>
                {role === 'admin' ? (
                  <>
                    <Button type="button" variant="secondary" onClick={() => openGoalModal(goal)}>
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button type="button" variant="danger" onClick={() => deleteGoal(goal.id)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </>
                ) : null}
              </div>
            </motion.section>
          );
        })}
      </div>

      {completedGoals.length ? (
        <section className="rounded-[18px] border border-[#34c759]/20 bg-[#34c759]/8 p-6">
          <PageHeader eyebrow="Completed" title="Goals Achieved" subtitle="Celebrating the milestones already crossed." />
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
                <p className="text-xl font-semibold text-[var(--text-primary)]">🎉 Goal Achieved! {goal.title}</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Completed on {format(new Date(goal.deadline), 'dd MMM yyyy')}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Modal open={goalModalOpen} onClose={() => setGoalModalOpen(false)} title={editingGoal ? 'Edit Goal' : 'Add Goal'}>
        <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            <input
              value={goalForm.title}
              onChange={(event) => setGoalForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Title"
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="number"
                value={goalForm.target}
                onChange={(event) => setGoalForm((current) => ({ ...current, target: event.target.value }))}
                placeholder="Target amount"
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
              <input
                type="number"
                value={goalForm.saved}
                onChange={(event) => setGoalForm((current) => ({ ...current, saved: event.target.value }))}
                placeholder="Current saved"
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </div>
            <input
              type="date"
              value={goalForm.deadline}
              onChange={(event) => setGoalForm((current) => ({ ...current, deadline: event.target.value }))}
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)]"
            />
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setGoalForm((current) => ({ ...current, emoji }))}
                  className={`rounded-[10px] border px-3 py-2 text-2xl ${
                    goalForm.emoji === emoji
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                      : 'border-[var(--border)] bg-[var(--bg-card)]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <input
              value={goalForm.color}
              onChange={(event) => setGoalForm((current) => ({ ...current, color: event.target.value }))}
              placeholder="#6366f1"
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </div>

          <div className="rounded-[18px] bg-[var(--bg-base)] p-5">
            <p className="text-sm font-semibold text-[var(--text-secondary)]">Live preview</p>
            <div className="mt-4 rounded-[18px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
              <p className="text-3xl">{goalForm.emoji}</p>
              <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{goalForm.title || 'Goal title'}</p>
              <p className="mt-2 font-mono text-[var(--text-secondary)]">
                {formatCurrency(Number(goalForm.saved || 0))} of {formatCurrency(Number(goalForm.target || 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => setGoalModalOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={saveGoal}>
            Save Goal
          </Button>
        </div>
      </Modal>

      <Modal open={Boolean(moneyGoal)} onClose={() => setMoneyGoal(null)} title="Add Money" className="md:max-w-md">
        {moneyGoal ? (
          <>
            <p className="text-sm text-[var(--text-secondary)]">Add to {moneyGoal.title}</p>
            <input
              type="number"
              value={moneyAmount}
              onChange={(event) => setMoneyAmount(event.target.value)}
              placeholder="Enter amount"
              className="mt-4 w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => setMoneyGoal(null)}>
                Cancel
              </Button>
              <Button type="button" onClick={addMoney}>
                Add Money
              </Button>
            </div>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
