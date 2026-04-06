'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard-store';
import { exportCSV, exportJSON } from '@/lib/export';

export default function ExportButton() {
  const { state, filteredTransactions } = useDashboard();
  const [open, setOpen] = useState(false);

  const txToExport = filteredTransactions.length > 0 ? filteredTransactions : state.transactions;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="nb-btn nb-btn-sm"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 z-50 min-w-[160px]"
            style={{
              backgroundColor: 'var(--card)',
              border: 'var(--nb-border-width) solid var(--nb-border-color)',
              borderRadius: 'var(--nb-radius)',
              boxShadow: 'var(--nb-shadow)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                exportCSV(txToExport);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm font-bold transition-colors hover:bg-[var(--surface-2)]"
              style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--surface-3)' }}
            >
              Export as CSV
            </button>
            <button
              type="button"
              onClick={() => {
                exportJSON(txToExport);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm font-bold transition-colors hover:bg-[var(--surface-2)]"
              style={{ color: 'var(--text-primary)' }}
            >
              Export as JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
}
