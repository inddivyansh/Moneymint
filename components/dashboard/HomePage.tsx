'use client';

import { useDashboard, currency, PIE_COLORS } from '@/lib/dashboard-store';
import RoleSwitcher from '@/components/dashboard/RoleSwitcher';

export default function HomePage() {
  const { totals, totalBankBalance, currentMonthSpending, state } = useDashboard();

  // Pie chart math
  const total = currentMonthSpending.reduce((s, c) => s + c.total, 0);
  let cumulative = 0;

  // P&L
  const dematTotal = state.dematAccounts.reduce((acc, d) => {
    acc.invested += d.invested;
    acc.current += d.currentValue;
    return acc;
  }, { invested: 0, current: 0 });

  return (
    <div className="space-y-8 nb-animate-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Overview
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome back, {state.profile.name.split(' ')[0]}
          </h1>
        </div>
        <RoleSwitcher />
      </div>

      {/* Summary Cards - 3 max */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="nb-card p-5 accent-strip-left">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Account Balance
          </p>
          <p className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
            {currency.format(totalBankBalance)}
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Across {state.bankAccounts.length} bank account{state.bankAccounts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="nb-card p-5 accent-strip-expense">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Spent Today
          </p>
          <p className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
            {currency.format(totals.spentToday)}
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            {totals.spentToday === 0 ? 'Nothing spent yet' : 'Today\'s outflow'}
          </p>
        </div>

        <div className="nb-card p-5 accent-strip-income">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Savings Rate
          </p>
          <p className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
            {totals.savingsRate.toFixed(1)}%
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Of total income saved
          </p>
        </div>
      </div>

      {/* Pie Chart + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Donut Chart */}
        <div className="nb-card p-6">
          <h2 className="text-base font-bold mb-1">This Month&apos;s Spending</h2>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Category breakdown for {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>

          {currentMonthSpending.length === 0 ? (
            <div className="nb-card-flat p-8 text-center" style={{ color: 'var(--text-muted)' }}>
              No expenses this month yet.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* SVG Donut */}
              <svg viewBox="0 0 200 200" className="w-44 h-44 shrink-0">
                {currentMonthSpending.map((item, i) => {
                  const pct = total === 0 ? 0 : item.total / total;
                  const startAngle = cumulative * 360;
                  cumulative += pct;
                  const endAngle = cumulative * 360;
                  
                  const startRad = ((startAngle - 90) * Math.PI) / 180;
                  const endRad = ((endAngle - 90) * Math.PI) / 180;
                  const largeArc = pct > 0.5 ? 1 : 0;

                  const outerR = 90;
                  const innerR = 55;

                  const x1o = 100 + outerR * Math.cos(startRad);
                  const y1o = 100 + outerR * Math.sin(startRad);
                  const x2o = 100 + outerR * Math.cos(endRad);
                  const y2o = 100 + outerR * Math.sin(endRad);

                  const x1i = 100 + innerR * Math.cos(endRad);
                  const y1i = 100 + innerR * Math.sin(endRad);
                  const x2i = 100 + innerR * Math.cos(startRad);
                  const y2i = 100 + innerR * Math.sin(startRad);

                  const d = [
                    `M ${x1o} ${y1o}`,
                    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}`,
                    `L ${x1i} ${y1i}`,
                    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2i} ${y2i}`,
                    'Z',
                  ].join(' ');

                  return (
                    <path
                      key={item.category}
                      d={d}
                      fill={item.color}
                      stroke="var(--nb-border-color)"
                      strokeWidth="1.5"
                    />
                  );
                })}
                {/* Center text */}
                <text x="100" y="95" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--text-primary)" fontFamily="var(--font-display)">
                  {currency.format(total)}
                </text>
                <text x="100" y="112" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text-muted)">
                  TOTAL
                </text>
              </svg>

              {/* Legend */}
              <div className="space-y-2 flex-1 min-w-0">
                {currentMonthSpending.map((item) => (
                  <div key={item.category} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0 border"
                        style={{ backgroundColor: item.color, borderColor: 'var(--nb-border-color)' }}
                      />
                      <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {item.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold shrink-0" style={{ color: 'var(--text-muted)' }}>
                      {item.percentage.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* P&L Summary */}
        <div className="nb-card p-6">
          <h2 className="text-base font-bold mb-1">Portfolio P&L</h2>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Profit & loss across demat accounts</p>

          {state.dematAccounts.length === 0 ? (
            <div className="nb-card-flat p-8 text-center" style={{ color: 'var(--text-muted)' }}>
              No demat accounts linked.
            </div>
          ) : (
            <div className="space-y-3">
              {state.dematAccounts.map((d) => {
                const pnl = d.currentValue - d.invested;
                const pnlPct = d.invested === 0 ? 0 : (pnl / d.invested) * 100;
                const isProfit = pnl >= 0;

                return (
                  <div key={d.id} className="nb-card-flat p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{d.broker}</span>
                      <span
                        className={`nb-badge ${isProfit ? 'nb-badge-income' : 'nb-badge-expense'}`}
                      >
                        {isProfit ? '+' : ''}{pnlPct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Invested</p>
                        <p className="text-sm font-bold">{currency.format(d.invested)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Current</p>
                        <p className="text-sm font-bold">{currency.format(d.currentValue)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>P&L</p>
                        <p className="text-sm font-extrabold" style={{ color: isProfit ? 'var(--income)' : 'var(--expense)' }}>
                          {isProfit ? '+' : ''}{currency.format(pnl)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Total */}
              <div className="pt-2" style={{ borderTop: '2px solid var(--surface-3)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Total P&L</span>
                  <span
                    className="text-base font-extrabold"
                    style={{ color: dematTotal.current - dematTotal.invested >= 0 ? 'var(--income)' : 'var(--expense)' }}
                  >
                    {dematTotal.current - dematTotal.invested >= 0 ? '+' : ''}
                    {currency.format(dematTotal.current - dematTotal.invested)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
