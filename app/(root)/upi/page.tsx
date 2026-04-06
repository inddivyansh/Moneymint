'use client';

import { useState } from 'react';
import { useDashboard, currency, type UPIApp } from '@/lib/dashboard-store';

export default function UPIPage() {
  const { state, dispatch } = useDashboard();
  const isAdmin = state.role === 'admin';
  const txns = state.upiTransactions;

  const [showAddApp, setShowAddApp] = useState(false);
  const [appDraft, setAppDraft] = useState({ name: '', upiId: '', type: 'upi' as 'upi' | 'wallet', balance: '' });

  const totalSent = txns.filter(t => t.type === 'sent' && t.status === 'success').reduce((s, t) => s + t.amount, 0);
  const totalReceived = txns.filter(t => t.type === 'received' && t.status === 'success').reduce((s, t) => s + t.amount, 0);

  function addApp() {
    if (!appDraft.name.trim() || !appDraft.upiId.trim()) return;
    const app: UPIApp = {
      id: `app-${Date.now()}`,
      name: appDraft.name.trim(),
      upiId: appDraft.upiId.trim(),
      type: appDraft.type,
      balance: appDraft.type === 'wallet' ? Number(appDraft.balance) || 0 : undefined,
    };
    dispatch({ type: 'ADD_UPI_APP', payload: app });
    setAppDraft({ name: '', upiId: '', type: 'upi', balance: '' });
    setShowAddApp(false);
  }

  return (
    <div className="space-y-6 nb-animate-in">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Payments</p>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>UPI Transactions</h1>
      </div>

      {/* Connected Apps & Wallets */}
      <div className="nb-card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
          <h2 className="text-sm sm:text-base font-bold">Connected Apps & Wallets</h2>
          {isAdmin && (
            <button type="button" onClick={() => setShowAddApp(!showAddApp)} className="nb-btn nb-btn-sm nb-btn-primary text-xs whitespace-nowrap">
              {showAddApp ? 'Cancel' : '+ Add'}
            </button>
          )}
        </div>

        {showAddApp && (
          <div className="nb-card-flat p-3 sm:p-4 mb-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              <label className="block">
                <span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>App Name</span>
                <input value={appDraft.name} onChange={e => setAppDraft(p => ({ ...p, name: e.target.value }))} className="nb-input text-sm" placeholder="Google Pay" />
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>UPI ID</span>
                <input value={appDraft.upiId} onChange={e => setAppDraft(p => ({ ...p, upiId: e.target.value }))} className="nb-input text-sm" placeholder="name@bank" />
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Type</span>
                <select value={appDraft.type} onChange={e => setAppDraft(p => ({ ...p, type: e.target.value as 'upi' | 'wallet' }))} className="nb-select text-sm">
                  <option value="upi">UPI App</option>
                  <option value="wallet">Wallet</option>
                </select>
              </label>
            </div>
            {appDraft.type === 'wallet' && (
              <label className="block">
                <span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Wallet Balance</span>
                <input value={appDraft.balance} onChange={e => setAppDraft(p => ({ ...p, balance: e.target.value }))} className="nb-input text-sm" placeholder="0" inputMode="decimal" />
              </label>
            )}
            <button type="button" onClick={addApp} className="nb-btn nb-btn-primary nb-btn-sm text-xs">Add App</button>
          </div>
        )}

        {state.upiApps.length === 0 ? (
          <p className="text-xs sm:text-sm py-2" style={{ color: 'var(--text-muted)' }}>No UPI apps connected.</p>
        ) : (
          <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {state.upiApps.map((app) => (
              <div key={app.id} className="nb-card-flat p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md text-xs font-black shrink-0" style={{ backgroundColor: app.type === 'wallet' ? 'var(--accent)' : 'var(--surface-3)', color: app.type === 'wallet' ? '#1A1A1A' : 'var(--text-primary)', border: '2px solid var(--nb-border-color)' }}>
                      {app.name[0]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{app.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{app.upiId}</p>
                    </div>
                  </div>
                  {app.type === 'wallet' && app.balance !== undefined && (
                    <p className="text-xs mt-1 font-bold" style={{ color: 'var(--income)' }}>Balance: {currency.format(app.balance)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 justify-end sm:justify-end">
                  <span className="nb-badge nb-badge-neutral text-[8px] sm:text-[9px]">{app.type.toUpperCase()}</span>
                  {isAdmin && (
                    <button type="button" onClick={() => dispatch({ type: 'REMOVE_UPI_APP', payload: app.id })} className="nb-btn nb-btn-sm nb-btn-danger text-xs">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="nb-card p-4 sm:p-5 accent-strip-expense">
          <p className="text-xs font-bold uppercase tracking-widest mb-1 sm:mb-2" style={{ color: 'var(--text-muted)' }}>Total Sent</p>
          <p className="text-lg sm:text-2xl font-extrabold truncate" style={{ fontFamily: 'var(--font-display)' }}>{currency.format(totalSent)}</p>
        </div>
        <div className="nb-card p-4 sm:p-5 accent-strip-income">
          <p className="text-xs font-bold uppercase tracking-widest mb-1 sm:mb-2" style={{ color: 'var(--text-muted)' }}>Total Received</p>
          <p className="text-lg sm:text-2xl font-extrabold truncate" style={{ fontFamily: 'var(--font-display)' }}>{currency.format(totalReceived)}</p>
        </div>
        <div className="nb-card p-4 sm:p-5 accent-strip-left">
          <p className="text-xs font-bold uppercase tracking-widest mb-1 sm:mb-2" style={{ color: 'var(--text-muted)' }}>Transactions</p>
          <p className="text-lg sm:text-2xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>{txns.length}</p>
        </div>
      </div>

      {/* UPI List */}
      {txns.length === 0 ? (
        <div className="nb-card p-6 sm:p-8 text-center" style={{ color: 'var(--text-muted)' }}>No UPI transactions found.</div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {txns.map((tx) => {
            const isSent = tx.type === 'sent';
            return (
              <div key={tx.id} className="nb-card-flat p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-md shrink-0 text-xs font-black" style={{ backgroundColor: isSent ? 'var(--expense-bg)' : 'var(--income-bg)', color: isSent ? 'var(--expense)' : 'var(--income)', border: '2px solid var(--nb-border-color)' }}>
                      {isSent ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{tx.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{tx.app} &middot; {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-extrabold whitespace-nowrap" style={{ color: isSent ? 'var(--expense)' : 'var(--income)' }}>{isSent ? '-' : '+'}{currency.format(tx.amount)}</p>
                    <span className={`nb-badge text-[8px] sm:text-[9px] ${tx.status === 'success' ? 'nb-badge-income' : tx.status === 'pending' ? 'nb-badge-warning' : 'nb-badge-expense'}`}>{tx.status}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[10px] sm:text-xs overflow-x-auto" style={{ color: 'var(--text-muted)' }}>
                  <span className="whitespace-nowrap">Ref: {tx.reference}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="whitespace-nowrap">UPI: {tx.upiId}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
