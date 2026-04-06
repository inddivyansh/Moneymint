'use client';

import { useState } from 'react';
import TransactionTable from '@/components/dashboard/TransactionTable';
import TransactionForm from '@/components/dashboard/TransactionForm';
import ExcelUpload from '@/components/dashboard/ExcelUpload';
import ExportButton from '@/components/dashboard/ExportButton';
import { useDashboard } from '@/lib/dashboard-store';

export default function TransactionsPage() {
  const { state } = useDashboard();
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="space-y-6 nb-animate-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>History</p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Transactions</h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <ExportButton />
          {state.role === 'admin' && (
            <>
              <button type="button" onClick={() => { setShowImport(!showImport); setShowForm(false); }} className="nb-btn nb-btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                Import File
              </button>
              <button type="button" onClick={() => { setShowForm(!showForm); setShowImport(false); }} className="nb-btn nb-btn-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Transaction
              </button>
            </>
          )}
        </div>
      </div>

      {showImport && state.role === 'admin' && <ExcelUpload />}
      {showForm && state.role === 'admin' && <TransactionForm />}

      <TransactionTable />
    </div>
  );
}
