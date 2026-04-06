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
    <div className="space-y-6 sm:space-y-8 nb-animate-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Overview
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight truncate" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome back, {state.profile.name.split(' ')[0]}
          </h1>
        </div>
        <RoleSwitcher />
      </div>

      {/* Summary Cards - 2 on mobile, 3 on tablet+ */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3">
        <div className="nb-card p-4 sm:p-5 accent-strip-left">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Account Balance
          </p>
          <p className="text-lg sm:text-2xl md:text-3xl font-extrabold truncate" style={{ fontFamily: 'var(--font-display)' }}>
            {currency.format(totalBankBalance)}
          </p>
          <p className="text-[10px] sm:text-xs mt-1 sm:mt-2" style={{ color: 'var(--text-muted)' }}>
            {state.bankAccounts.length} account{state.bankAccounts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="nb-card p-4 sm:p-5 accent-strip-expense">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Spent Today
          </p>
          <p className="text-lg sm:text-2xl md:text-3xl font-extrabold truncate" style={{ fontFamily: 'var(--font-display)' }}>
            {currency.format(totals.spentToday)}
          </p>
          <p className="text-[10px] sm:text-xs mt-1 sm:mt-2" style={{ color: 'var(--text-muted)' }}>
            {totals.spentToday === 0 ? 'No outflow' : 'Today'}
          </p>
        </div>

        <div className="nb-card p-4 sm:p-5 accent-strip-income">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Savings Rate
          </p>
          <p className="text-lg sm:text-2xl md:text-3xl font-extrabold truncate" style={{ fontFamily: 'var(--font-display)' }}>
            {totals.savingsRate.toFixed(1)}%
          </p>
          <p className="text-[10px] sm:text-xs mt-1 sm:mt-2" style={{ color: 'var(--text-muted)' }}>
            Of total income
          </p>
        </div>
      </div>

      {/* Pie Chart + Recent Activity */}
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
        {/* Donut Chart */}
        <div className="nb-card p-4 sm:p-6">
          <h2 className="text-sm sm:text-base font-bold mb-1">This Month's Spending</h2>
          <p className="text-xs mb-4 sm:mb-5" style={{ color: 'var(--text-muted)' }}>Category breakdown for {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>

          {currentMonthSpending.length === 0 ? (
            <div className="nb-card-flat p-6 sm:p-8 text-center" style={{ color: 'var(--text-muted)' }}>
              No expenses this month yet.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {/* SVG Donut - responsive size */}
              <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 shrink-0">
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
                <text x="100" y="95" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--text-primary)" fontFamily="var(--font-display)">
                  {currency.format(total)}
                </text>
                <text x="100" y="112" textAnchor="middle" fontSize="8" fontWeight="600" fill="var(--text-muted)">
                  TOTAL
                </text>
              </svg>

              {/* Legend - scrolls on mobile if needed */}
              <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0 max-h-40 sm:max-h-52 overflow-y-auto">
                {currentMonthSpending.map((item) => (
                  <div key={item.category} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm shrink-0 border"
                        style={{ backgroundColor: item.color, borderColor: 'var(--nb-border-color)' }}
                      />
                      <span className="text-xs sm:text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
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
        <div className="nb-card p-4 sm:p-6">
          <h2 className="text-sm sm:text-base font-bold mb-1">Portfolio P&L</h2>
          <p className="text-xs mb-4 sm:mb-5" style={{ color: 'var(--text-muted)' }}>Profit & loss across demat accounts</p>

          {state.dematAccounts.length === 0 ? (
            <div className="nb-card-flat p-6 sm:p-8 text-center" style={{ color: 'var(--text-muted)' }}>
              <p className="text-xs sm:text-sm">No demat accounts linked.</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {state.dematAccounts.map((d) => {
                const pnl = d.currentValue - d.invested;
                const pnlPct = d.invested === 0 ? 0 : (pnl / d.invested) * 100;
                const isProfit = pnl >= 0;

                return (
                  <div key={d.id} className="nb-card-flat p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{d.broker}</span>
                      <span
                        className={`nb-badge text-[10px] sm:text-xs font-bold whitespace-nowrap shrink-0 ${
                          isProfit ? 'nb-badge-income' : 'nb-badge-expense'
                        }`}
                      >
                        {isProfit ? '+' : ''}{pnlPct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Invested</p>
                        <p className="text-xs sm:text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }} title={currency.format(d.invested)}>{currency.format(d.invested)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Current</p>
                        <p className="text-xs sm:text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }} title={currency.format(d.currentValue)}>{currency.format(d.currentValue)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>P&L</p>
                        <p className="text-xs sm:text-sm font-extrabold mt-0.5" style={{ color: isProfit ? 'var(--income)' : 'var(--expense)' }} title={currency.format(pnl)}>
                          {isProfit ? '+' : ''}{currency.format(pnl)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Total */}
              <div className="pt-2 sm:pt-3" style={{ borderTop: '2px solid var(--surface-3)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Total P&L</span>
                  <span
                    className="text-sm sm:text-base font-extrabold"
                    style={{ color: dematTotal.current - dematTotal.invested >= 0 ? 'var(--income)' : 'var(--expense)' }}
                    title={currency.format(dematTotal.current - dematTotal.invested)}
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
