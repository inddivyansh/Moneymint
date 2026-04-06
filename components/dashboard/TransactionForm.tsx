'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useDashboard, draftDefaults, type Transaction, type TransactionDraft, type TransactionType } from '@/lib/dashboard-store';

export default function TransactionForm() {
  const { state, dispatch } = useDashboard();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TransactionDraft>(draftDefaults);

  // Listen for edit events from transaction table
  useEffect(() => {
    function handleEdit(e: Event) {
      const tx = (e as CustomEvent<Transaction>).detail;
      setEditingId(tx.id);
      setDraft({
        date: tx.date,
        title: tx.title,
        amount: String(tx.amount),
        category: tx.category,
        type: tx.type,
      });
      // Scroll form into view
      document.getElementById('transaction-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    window.addEventListener('edit-transaction', handleEdit);
    return () => window.removeEventListener('edit-transaction', handleEdit);
  }, []);

  function resetForm() {
    setEditingId(null);
    setDraft(draftDefaults);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (state.role !== 'admin') return;

    const amount = Number(draft.amount);
    if (!draft.title.trim() || !draft.category.trim() || !draft.date || isNaN(amount) || amount <= 0) {
      return;
    }

    const tx: Transaction = {
      id: editingId ?? `tx-${Date.now()}`,
      date: draft.date,
      title: draft.title.trim(),
      amount,
      category: draft.category.trim(),
      type: draft.type,
    };

    dispatch({ type: editingId ? 'UPDATE_TRANSACTION' : 'ADD_TRANSACTION', payload: tx });
    resetForm();
  }

  if (state.role !== 'admin') {
    return (
      <article id="transaction-form" className="nb-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <span className="nb-badge nb-badge-neutral">LOCKED</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Switch to Admin role to add or edit transactions.
        </p>
      </article>
    );
  }

  return (
    <article id="transaction-form" className="nb-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">
          {editingId ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <span className="nb-badge nb-badge-income">ADMIN</span>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Date
            </span>
            <input
              type="date"
              value={draft.date}
              onChange={(e) => setDraft((p) => ({ ...p, date: e.target.value }))}
              className="nb-input"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Title
            </span>
            <input
              value={draft.title}
              onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
              placeholder="Transaction title"
              className="nb-input"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Amount
            </span>
            <input
              value={draft.amount}
              onChange={(e) => setDraft((p) => ({ ...p, amount: e.target.value }))}
              inputMode="decimal"
              placeholder="0"
              className="nb-input"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Type
            </span>
            <select
              value={draft.type}
              onChange={(e) => setDraft((p) => ({ ...p, type: e.target.value as TransactionType }))}
              className="nb-select"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Category
            </span>
            <input
              value={draft.category}
              onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
              placeholder="Food, Salary, Travel..."
              className="nb-input"
            />
          </label>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="submit" className="nb-btn nb-btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {editingId ? (
                <>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </>
              ) : (
                <>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </>
              )}
            </svg>
            {editingId ? 'Update' : 'Add'} Transaction
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="nb-btn">
              Cancel
            </button>
          )}
        </div>
      </form>
    </article>
  );
}
