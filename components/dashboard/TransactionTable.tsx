'use client';

import { useState } from 'react';
import { useDashboard, currency, type SortBy, type TransactionType } from '@/lib/dashboard-store';

const PAGE_SIZE = 10;

export default function TransactionTable() {
  const { state, dispatch, filteredTransactions, categories } = useDashboard();
  const [page, setPage] = useState(0);

  const { search, type: typeFilter, category: categoryFilter, sortBy } = state.filters;

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const paged = filteredTransactions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset page when filters change
  const setFilterAndResetPage = (payload: Parameters<typeof dispatch>[0] extends { type: 'SET_FILTERS'; payload: infer P } ? P : never) => {
    setPage(0);
    dispatch({ type: 'SET_FILTERS', payload });
  };

  function fillForm(txId: string) {
    const tx = state.transactions.find((t) => t.id === txId);
    if (!tx) return;
    // Scroll to form and dispatch a custom event
    window.dispatchEvent(new CustomEvent('edit-transaction', { detail: tx }));
  }

  return (
    <article className="nb-card p-4 sm:p-5">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold">Transactions</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Search, sort, and filter your activity
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="nb-badge nb-badge-neutral">
            {filteredTransactions.length} RECORDS
          </span>
          {state.role === 'viewer' && (
            <span className="nb-badge nb-badge-info">VIEW ONLY</span>
          )}
        </div>
      </header>

      {/* Filters */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 mb-5">
        {/* Search */}
        <div className="relative">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setFilterAndResetPage({ search: e.target.value })}
            placeholder="Search title, category, date..."
            className="nb-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Type filter - segmented */}
        <div className="nb-segment self-start w-full sm:w-auto">
          {(['all', 'income', 'expense'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterAndResetPage({ type: t })}
              className={`nb-segment-btn flex-1 ${typeFilter === t ? 'nb-segment-btn-active' : ''}`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>

        {/* Category */}
        <select
          value={categoryFilter}
          onChange={(e) => setFilterAndResetPage({ category: e.target.value })}
          className="nb-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setFilterAndResetPage({ sortBy: e.target.value as SortBy })}
          className="nb-select"
        >
          <option value="date-desc">Date: Newest</option>
          <option value="date-asc">Date: Oldest</option>
          <option value="amount-desc">Amount: High to Low</option>
          <option value="amount-asc">Amount: Low to High</option>
        </select>
      </div>

      {/* Empty state */}
      {filteredTransactions.length === 0 ? (
        <div className="nb-card-flat p-8 text-center">
          <p className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            No transactions match these filters.
          </p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Try adjusting your search or filters.
          </p>
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'CLEAR_FILTERS' });
              setPage(0);
            }}
            className="nb-btn nb-btn-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="nb-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  {state.role === 'admin' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {paged.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {tx.title}
                    </td>
                    <td>
                      <span className="nb-badge nb-badge-neutral">{tx.category}</span>
                    </td>
                    <td>
                      <span className={`nb-badge ${tx.type === 'income' ? 'nb-badge-income' : 'nb-badge-expense'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="font-extrabold" style={{ color: tx.type === 'income' ? 'var(--income)' : 'var(--expense)' }}>
                      {tx.type === 'income' ? '+' : '-'}{currency.format(tx.amount)}
                    </td>
                    {state.role === 'admin' && (
                      <td>
                        <button
                          type="button"
                          onClick={() => fillForm(tx.id)}
                          className="nb-btn nb-btn-sm"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-3 md:hidden">
            {paged.map((tx) => (
              <article key={tx.id} className="nb-card-flat p-3.5 sm:p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="font-bold text-sm break-words" style={{ color: 'var(--text-primary)' }}>{tx.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {new Date(tx.date).toLocaleDateString('en-IN')}
                      {' / '}
                      {tx.category}
                    </p>
                  </div>
                  <span
                    className="text-sm font-extrabold whitespace-nowrap"
                    style={{ color: tx.type === 'income' ? 'var(--income)' : 'var(--expense)' }}
                  >
                    {tx.type === 'income' ? '+' : '-'}{currency.format(tx.amount)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`nb-badge ${tx.type === 'income' ? 'nb-badge-income' : 'nb-badge-expense'}`}>
                    {tx.type}
                  </span>
                  {state.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => fillForm(tx.id)}
                      className="nb-btn nb-btn-sm ml-auto"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
              <p className="text-xs font-bold text-center sm:text-left" style={{ color: 'var(--text-muted)' }}>
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex items-center justify-center sm:justify-end gap-1.5 sm:gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="nb-btn nb-btn-sm"
                >
                  Prev
                </button>

                {/* Compact mobile pagination */}
                <div className="sm:hidden flex items-center gap-1.5">
                  <span className="text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>Go to</span>
                  <select
                    value={page}
                    onChange={(e) => setPage(Number(e.target.value))}
                    className="nb-select"
                    style={{ width: 96, padding: '0.3rem 1.8rem 0.3rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    {Array.from({ length: totalPages }, (_, i) => (
                      <option key={i} value={i}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Numbered desktop/tablet pagination */}
                <div className="hidden sm:flex gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i;
                  } else if (page < 3) {
                    pageNum = i;
                  } else if (page >= totalPages - 3) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setPage(pageNum)}
                      className={`nb-btn nb-btn-sm ${page === pageNum ? 'nb-btn-primary' : ''}`}
                      style={{ minWidth: 36 }}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
                </div>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="nb-btn nb-btn-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </article>
  );
}
