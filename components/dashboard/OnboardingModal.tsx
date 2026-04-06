'use client';

import { useDashboard } from '@/lib/dashboard-store';

export default function OnboardingModal() {
  const { state, dispatch } = useDashboard();

  if (state.onboarded) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="w-full max-w-md p-6 md:p-8 nb-animate-in"
        style={{
          backgroundColor: 'var(--card)',
          border: 'var(--nb-border-width) solid var(--nb-border-color)',
          borderRadius: 'var(--nb-radius)',
          boxShadow: 'var(--nb-shadow-lg)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span
            className="inline-flex items-center justify-center w-10 h-10 text-sm font-black rounded-md"
            style={{ backgroundColor: 'var(--accent)', color: '#1A1A1A', border: '2px solid var(--nb-border-color)' }}
          >
            M
          </span>
          <h2 className="text-xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>Welcome to Moneymint</h2>
        </div>

        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Your personal finance dashboard is ready with demo data. You can manage bank accounts and demat accounts from the Profile page.
        </p>

        <div className="nb-card-flat p-4 mb-5">
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>Demo accounts loaded</p>
          <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li>2 bank accounts (SBI, HDFC)</li>
            <li>2 demat accounts (Zerodha, Groww)</li>
            <li>28 transactions + 12 UPI records</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_ONBOARDED', payload: true })}
            className="nb-btn nb-btn-primary flex-1"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
