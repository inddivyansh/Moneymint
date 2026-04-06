'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard-store';

export default function RewardsPage() {
  const { state, dispatch } = useDashboard();
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'redeemed'>('all');

  const coupons = state.coupons.filter(c => {
    if (filter === 'active') return !c.redeemed;
    if (filter === 'redeemed') return c.redeemed;
    return true;
  });

  function copyReferral() {
    navigator.clipboard.writeText(state.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
  }

  return (
    <div className="space-y-6 sm:space-y-8 nb-animate-in">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Earn & Save</p>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Rewards & Coupons</h1>
      </div>

      {/* Referral Offer */}
      <div className="nb-card p-4 sm:p-6" style={{ borderLeftWidth: 5, borderLeftColor: 'var(--accent)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-bold mb-1">Refer & Earn</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Invite friends to Moneymint and earn <span className="font-extrabold" style={{ color: 'var(--income)' }}>₹500</span> for each successful referral. Your friend gets <span className="font-extrabold" style={{ color: 'var(--income)' }}>₹200</span> too!
            </p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="nb-card-flat px-3 sm:px-4 py-2 w-full sm:w-auto flex items-center justify-center gap-2 min-w-0">
              <span className="text-xs sm:text-sm font-extrabold tracking-wider break-all text-center" style={{ color: 'var(--text-primary)' }}>{state.referralCode}</span>
            </div>
            <button type="button" onClick={copyReferral} className="nb-btn nb-btn-primary nb-btn-sm w-full sm:w-auto justify-center">
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  Copy Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Referral stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-5">
          <div className="nb-card-flat p-3 text-center">
            <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Referrals</p>
            <p className="text-lg font-extrabold">3</p>
          </div>
          <div className="nb-card-flat p-3 text-center">
            <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Earned</p>
            <p className="text-lg font-extrabold" style={{ color: 'var(--income)' }}>₹1,500</p>
          </div>
          <div className="nb-card-flat p-3 text-center">
            <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Pending</p>
            <p className="text-lg font-extrabold" style={{ color: 'var(--accent)' }}>1</p>
          </div>
        </div>
      </div>

      {/* Coupons */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold">Your Coupons</h2>
          <div className="nb-segment w-full sm:w-auto">
            {(['all', 'active', 'redeemed'] as const).map(f => (
              <button key={f} type="button" onClick={() => setFilter(f)} className={`nb-segment-btn flex-1 ${filter === f ? 'nb-segment-btn-active' : ''}`}>{f}</button>
            ))}
          </div>
        </div>

        {coupons.length === 0 ? (
          <div className="nb-card p-8 text-center" style={{ color: 'var(--text-muted)' }}>No coupons in this category.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.map(coupon => {
              const expired = new Date(coupon.expiresAt) < new Date();
              const isActive = !coupon.redeemed && !expired;

              return (
                <div
                  key={coupon.id}
                  className="nb-card p-5 flex flex-col min-w-0 overflow-hidden"
                  style={{ opacity: coupon.redeemed || expired ? 0.6 : 1 }}
                >
                  <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
                    <span className="nb-badge nb-badge-neutral text-[9px] max-w-[58%] truncate">{coupon.category}</span>
                    {coupon.redeemed ? (
                      <span className="nb-badge nb-badge-income text-[9px]">REDEEMED</span>
                    ) : expired ? (
                      <span className="nb-badge nb-badge-expense text-[9px]">EXPIRED</span>
                    ) : (
                      <span className="nb-badge nb-badge-warning text-[9px]">ACTIVE</span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold mb-1 break-words" style={{ color: 'var(--text-primary)' }}>{coupon.title}</h3>
                  <p className="text-xs mb-3 flex-1 break-words" style={{ color: 'var(--text-muted)' }}>{coupon.description}</p>

                  <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
                    <span className="text-xs truncate min-w-0" style={{ color: 'var(--text-muted)' }}>{coupon.brand}</span>
                    <span className="text-lg font-extrabold shrink-0" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{coupon.discount}</span>
                  </div>

                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="nb-card-flat px-3 py-1.5 flex-1 text-center min-w-0"
                      style={{
                        borderStyle: 'dashed',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        color: 'var(--text-primary)',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {coupon.code}
                    </div>
                    {isActive && (
                      <button type="button" onClick={() => copyCode(coupon.code)} className="nb-btn nb-btn-sm" title="Copy code">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                      </button>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-2 mt-3">
                    <span className="text-xs break-words" style={{ color: 'var(--text-muted)' }}>
                      Expires: {new Date(coupon.expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    {isActive && (
                      <button type="button" onClick={() => dispatch({ type: 'REDEEM_COUPON', payload: coupon.id })} className="nb-btn nb-btn-sm nb-btn-primary shrink-0">
                        Redeem
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
