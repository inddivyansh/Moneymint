'use client';

import { DashboardProvider, useDashboard, seedTransactions } from '@/lib/dashboard-store';
import SummaryCards from './SummaryCards';
import BalanceTrend from './BalanceTrend';
import SpendingBreakdown from './SpendingBreakdown';
import TransactionTable from './TransactionTable';
import TransactionForm from './TransactionForm';
import InsightsPanel from './InsightsPanel';
import NewsFeed from './NewsFeed';
import RoleSwitcher from './RoleSwitcher';
import ExportButton from './ExportButton';

function DashboardContent() {
  const { state, dispatch } = useDashboard();

  return (
    <div className="space-y-6 nb-animate-in">
      {/* Hero Section */}
      <section
        className="nb-card p-6 md:p-8"
        style={{ borderLeftWidth: 6, borderLeftColor: 'var(--accent)' }}
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="text-xs font-extrabold uppercase tracking-[0.25em] mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Personal Finance Dashboard
            </p>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Moneymint
            </h1>
            <p className="text-sm mt-2 max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Track spending, manage transactions, and understand your financial patterns. 
              Switch to Admin to add or edit entries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <RoleSwitcher />
            <ExportButton />
            <button
              type="button"
              onClick={() => dispatch({ type: 'RESET_TRANSACTIONS', payload: seedTransactions })}
              className="nb-btn nb-btn-sm"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Reset Data
            </button>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Row */}
      <section className="grid gap-6 lg:grid-cols-2">
        <BalanceTrend />
        <SpendingBreakdown />
      </section>

      {/* Transactions + Form */}
      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <TransactionTable />
        <aside className="space-y-6">
          <TransactionForm />
        </aside>
      </section>

      {/* Insights + News */}
      <section className="grid gap-6 lg:grid-cols-2">
        <InsightsPanel />
        <NewsFeed />
      </section>
    </div>
  );
}

export default function FinanceDashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
