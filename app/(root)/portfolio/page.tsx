'use client';

import { useDashboard, currency } from '@/lib/dashboard-store';

export default function PortfolioPage() {
  const { state } = useDashboard();

  const dematTotal = state.dematAccounts.reduce((acc, d) => {
    acc.invested += d.invested;
    acc.current += d.currentValue;
    return acc;
  }, { invested: 0, current: 0 });

  const totalPnL = dematTotal.current - dematTotal.invested;
  const totalPnLPct = dematTotal.invested === 0 ? 0 : (totalPnL / dematTotal.invested) * 100;

  return (
    <div className="space-y-6 nb-animate-in">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
          Investments
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Portfolio
        </h1>
      </div>

      {/* Summary Cards */}
      {state.dematAccounts.length > 0 && (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-4">
          <div className="nb-card p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Invested
            </p>
            <p className="text-xl sm:text-2xl font-extrabold truncate" style={{ fontFamily: 'var(--font-display)' }}>
              {currency.format(dematTotal.invested)}
            </p>
          </div>

          <div className="nb-card p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Current Value
            </p>
            <p className="text-xl sm:text-2xl font-extrabold truncate" style={{ fontFamily: 'var(--font-display)' }}>
              {currency.format(dematTotal.current)}
            </p>
          </div>

          <div className="nb-card p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              P&L Amount
            </p>
            <p
              className="text-xl sm:text-2xl font-extrabold truncate"
              style={{
                fontFamily: 'var(--font-display)',
                color: totalPnL >= 0 ? 'var(--income)' : 'var(--expense)',
              }}
            >
              {totalPnL >= 0 ? '+' : ''}{currency.format(totalPnL)}
            </p>
          </div>

          <div className="nb-card p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              P&L %
            </p>
            <p
              className="text-xl sm:text-2xl font-extrabold truncate"
              style={{
                fontFamily: 'var(--font-display)',
                color: totalPnL >= 0 ? 'var(--income)' : 'var(--expense)',
              }}
            >
              {totalPnL >= 0 ? '+' : ''}{totalPnLPct.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {/* Demat Accounts */}
      <div className="nb-card p-5 sm:p-6">
        <h2 className="text-base font-bold mb-1">Demat Accounts</h2>
        <p className="text-xs mb-4 sm:mb-5" style={{ color: 'var(--text-muted)' }}>
          All linked demat accounts and their performance
        </p>

        {state.dematAccounts.length === 0 ? (
          <div className="nb-card-flat p-6 sm:p-8 text-center" style={{ color: 'var(--text-muted)' }}>
            <p className="text-sm">No demat accounts linked yet.</p>
            <p className="text-xs mt-2">Go to Profile to add your demat accounts.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.dematAccounts.map((account) => {
              const pnl = account.currentValue - account.invested;
              const pnlPct = account.invested === 0 ? 0 : (pnl / account.invested) * 100;
              const isProfit = pnl >= 0;

              return (
                <div key={account.id} className="nb-card-flat p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {account.broker}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                        {account.accountType} • {account.dpId}
                      </p>
                    </div>
                    <span
                      className={`nb-badge text-xs font-bold whitespace-nowrap shrink-0 ${
                        isProfit ? 'nb-badge-income' : 'nb-badge-expense'
                      }`}
                    >
                      {isProfit ? '+' : ''}{pnlPct.toFixed(2)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="nb-card-flat p-3 text-center">
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                        Invested
                      </p>
                      <p className="text-sm sm:text-base font-extrabold mt-1 truncate" style={{ color: 'var(--text-primary)' }}>
                        {currency.format(account.invested)}
                      </p>
                    </div>

                    <div className="nb-card-flat p-3 text-center">
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                        Current
                      </p>
                      <p className="text-sm sm:text-base font-extrabold mt-1 truncate" style={{ color: 'var(--text-primary)' }}>
                        {currency.format(account.currentValue)}
                      </p>
                    </div>

                    <div className="nb-card-flat p-3 text-center">
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                        P&L
                      </p>
                      <p
                        className="text-sm sm:text-base font-extrabold mt-1 truncate"
                        style={{
                          color: isProfit ? 'var(--income)' : 'var(--expense)',
                        }}
                      >
                        {isProfit ? '+' : ''}{currency.format(pnl)}
                      </p>
                    </div>
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
