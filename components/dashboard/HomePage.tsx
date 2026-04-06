'use client';

import { useMemo } from 'react';
import { useDashboard, currency, PIE_COLORS } from '@/lib/dashboard-store';
import RoleSwitcher from '@/components/dashboard/RoleSwitcher';

export default function HomePage() {
  const { totals, totalBankBalance, currentMonthSpending, state } = useDashboard();
  const recentTransactions = useMemo(
    () => [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [state.transactions],
  );

  const latestTransaction = recentTransactions[0];
  const largestExpense = useMemo(
    () => [...state.transactions].filter((tx) => tx.type === 'expense').sort((a, b) => b.amount - a.amount)[0],
    [state.transactions],
  );
  const largestIncome = useMemo(
    () => [...state.transactions].filter((tx) => tx.type === 'income').sort((a, b) => b.amount - a.amount)[0],
    [state.transactions],
  );
  const currentCategory = currentMonthSpending[0];
  const monthExpenseTotal = currentMonthSpending.reduce((sum, item) => sum + item.total, 0);
  const monthlySpendTarget = Math.max(1, Math.round(totals.income * 0.65));
  const monthlySpendProgress = Math.min(100, (monthExpenseTotal / monthlySpendTarget) * 100);

  const todayKey = new Date().toISOString().slice(0, 10);
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = yesterdayDate.toISOString().slice(0, 10);

  const todayTotals = state.transactions.reduce(
    (acc, tx) => {
      if (tx.date !== todayKey) return acc;
      if (tx.type === 'income') acc.income += tx.amount;
      if (tx.type === 'expense') acc.expense += tx.amount;
      return acc;
    },
    { income: 0, expense: 0 },
  );

  const yesterdayTotals = state.transactions.reduce(
    (acc, tx) => {
      if (tx.date !== yesterdayKey) return acc;
      if (tx.type === 'income') acc.income += tx.amount;
      if (tx.type === 'expense') acc.expense += tx.amount;
      return acc;
    },
    { income: 0, expense: 0 },
  );

  const todayNet = todayTotals.income - todayTotals.expense;
  const yesterdayNet = yesterdayTotals.income - yesterdayTotals.expense;
  const netDelta = todayNet - yesterdayNet;
  const aiSignal =
    totals.savingsRate >= 25
      ? 'Healthy cash retention. Keep the current pace and protect your savings before optional spending.'
      : totals.savingsRate >= 12
        ? 'Your finances are stable but a few category caps could raise your savings rate quickly.'
        : 'Your current pattern is spending-heavy. The best next move is to slow discretionary categories this week.';

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
    <div className="space-y-4 sm:space-y-5 nb-animate-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Overview
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight truncate" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome back, {state.profile.name.split(' ')[0]}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            A quick read on your money, latest activity, and what changed recently.
          </p>
        </div>
        <RoleSwitcher />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-2.5 sm:gap-3 grid-cols-2 xl:grid-cols-4">
        <div className="nb-card p-3 sm:p-3.5 accent-strip-left nb-animate-soft" style={{ animationDelay: '0ms' }}>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Account Balance
          </p>
          <p className="text-base sm:text-xl md:text-2xl font-extrabold truncate" style={{ fontFamily: 'var(--font-display)' }}>
            {currency.format(totalBankBalance)}
          </p>
          <p className="text-[10px] sm:text-xs mt-1 sm:mt-2" style={{ color: 'var(--text-muted)' }}>
            {state.bankAccounts.length} account{state.bankAccounts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="nb-card p-3 sm:p-3.5 accent-strip-expense nb-animate-soft" style={{ animationDelay: '60ms' }}>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Spent Today
          </p>
          <p className="text-base sm:text-xl md:text-2xl font-extrabold truncate" style={{ fontFamily: 'var(--font-display)' }}>
            {currency.format(totals.spentToday)}
          </p>
          <p className="text-[10px] sm:text-xs mt-1 sm:mt-2" style={{ color: 'var(--text-muted)' }}>
            {totals.spentToday === 0 ? 'No outflow' : 'Today'}
          </p>
        </div>

        <div className="nb-card p-3 sm:p-3.5 accent-strip-income nb-animate-soft" style={{ animationDelay: '120ms' }}>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Savings Rate
          </p>
          <p className="text-base sm:text-xl md:text-2xl font-extrabold truncate" style={{ fontFamily: 'var(--font-display)' }}>
            {totals.savingsRate.toFixed(1)}%
          </p>
          <p className="text-[10px] sm:text-xs mt-1 sm:mt-2" style={{ color: 'var(--text-muted)' }}>
            Of total income
          </p>
        </div>

        <div className="nb-card p-3 sm:p-3.5 accent-strip-info nb-animate-soft col-span-2 xl:col-span-1" style={{ animationDelay: '180ms' }}>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Spending Goal
          </p>
          <p className="text-base sm:text-xl md:text-2xl font-extrabold truncate" style={{ fontFamily: 'var(--font-display)' }}>
            {monthlySpendProgress.toFixed(0)}%
          </p>
          <div className="mt-2 h-2 rounded-full" style={{ backgroundColor: 'var(--surface-2)' }}>
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${monthlySpendProgress}%`, backgroundColor: monthlySpendProgress > 100 ? 'var(--expense)' : 'var(--info)' }}
            />
          </div>
          <p className="text-[10px] sm:text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Target: {currency.format(monthlySpendTarget)} this month
          </p>
        </div>
      </div>

      {/* Pie Chart + Recent Activity */}
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        {/* Donut Chart */}
        <div className="space-y-4">
          <div className="nb-card p-3.5 sm:p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold mb-1">This Month's Spending</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Category breakdown for {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
              <span className="nb-badge nb-badge-neutral">{currentMonthSpending.length} categories</span>
            </div>

            {currentMonthSpending.length === 0 ? (
              <div className="nb-card-flat p-4 sm:p-5 text-center" style={{ color: 'var(--text-muted)' }}>
                No expenses this month yet.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                {/* SVG Donut - responsive size */}
                <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 shrink-0">
                  {currentMonthSpending.map((item) => {
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

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="nb-card-flat p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Top category</p>
                <p className="text-sm font-bold mt-1 truncate" style={{ color: 'var(--text-primary)' }}>
                  {currentCategory ? currentCategory.category : 'N/A'}
                </p>
              </div>
              <div className="nb-card-flat p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Largest income</p>
                <p className="text-sm font-bold mt-1 truncate" style={{ color: 'var(--text-primary)' }}>
                  {largestIncome ? currency.format(largestIncome.amount) : currency.format(0)}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="nb-card p-3.5 sm:p-4 nb-animate-soft" style={{ animationDelay: '120ms' }}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold mb-1">Recent Activity</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Your latest transactions with useful context</p>
              </div>
              <span className="nb-badge nb-badge-neutral">{recentTransactions.length} latest</span>
            </div>

            <div className="space-y-2">
              {recentTransactions.map((tx, index) => (
                <div
                  key={tx.id}
                  className="nb-card-flat p-3 flex items-center justify-between gap-3"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${tx.type === 'income' ? 'bg-[color:var(--income)]' : 'bg-[color:var(--expense)]'}`} />
                      <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {tx.title}
                      </p>
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} • {tx.category} • {tx.type === 'income' ? 'Income' : 'Expense'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold" style={{ color: tx.type === 'income' ? 'var(--income)' : 'var(--expense)' }}>
                      {tx.type === 'income' ? '+' : '-'}{currency.format(tx.amount)}
                    </p>
                    <p className="text-[10px] uppercase font-bold mt-1" style={{ color: 'var(--text-muted)' }}>
                      {index === 0 ? 'Latest' : index === 1 ? 'Recent' : 'Earlier'}
                    </p>
                  </div>
                </div>
              ))}

              {latestTransaction && (
                <div className="nb-card-flat p-3 mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Last transaction detail</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Title</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{latestTransaction.title}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Amount</p>
                      <p className="text-sm font-bold" style={{ color: latestTransaction.type === 'income' ? 'var(--income)' : 'var(--expense)' }}>
                        {latestTransaction.type === 'income' ? '+' : '-'}{currency.format(latestTransaction.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Category</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{latestTransaction.category}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Date</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {new Date(latestTransaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="nb-card p-3.5 sm:p-4 nb-animate-soft" style={{ animationDelay: '180ms' }}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold mb-1">AI Daily Signal</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>A lightweight summary based on your current activity</p>
              </div>
              <span className={`nb-badge text-[10px] font-bold ${totals.savingsRate >= 25 ? 'nb-badge-income' : totals.savingsRate >= 12 ? 'nb-badge-warning' : 'nb-badge-expense'}`}>
                {totals.savingsRate >= 25 ? 'Strong' : totals.savingsRate >= 12 ? 'Watch' : 'Risk'}
              </span>
            </div>

            <div className="nb-card-flat p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Today vs yesterday</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Today net</p>
                  <p className="text-sm font-bold mt-1" style={{ color: todayNet >= 0 ? 'var(--income)' : 'var(--expense)' }}>
                    {todayNet >= 0 ? '+' : ''}{currency.format(todayNet)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Yesterday net</p>
                  <p className="text-sm font-bold mt-1" style={{ color: yesterdayNet >= 0 ? 'var(--income)' : 'var(--expense)' }}>
                    {yesterdayNet >= 0 ? '+' : ''}{currency.format(yesterdayNet)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Delta</p>
                  <p className="text-sm font-bold mt-1" style={{ color: netDelta >= 0 ? 'var(--income)' : 'var(--expense)' }}>
                    {netDelta >= 0 ? '+' : ''}{currency.format(netDelta)}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {aiSignal}
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="nb-card-flat p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Largest expense</p>
                <p className="text-sm font-bold mt-1 truncate" style={{ color: 'var(--text-primary)' }}>
                  {largestExpense ? `${largestExpense.title} • ${currency.format(largestExpense.amount)}` : 'No expense recorded'}
                </p>
              </div>
              <div className="nb-card-flat p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Best savings cue</p>
                <p className="text-sm font-bold mt-1 truncate" style={{ color: 'var(--text-primary)' }}>
                  {currentCategory ? `${currentCategory.category} is leading spend this month` : 'Track more activity for a sharper cue'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* P&L Summary */}
        <div className="space-y-4">
          <div className="nb-card p-3.5 sm:p-4 nb-animate-soft" style={{ animationDelay: '180ms' }}>
            <h2 className="text-sm sm:text-base font-bold mb-1">Portfolio P&L</h2>
            <p className="text-xs mb-4 sm:mb-5" style={{ color: 'var(--text-muted)' }}>Profit & loss across demat accounts</p>

            {state.dematAccounts.length === 0 ? (
              <div className="nb-card-flat p-4 sm:p-5 text-center" style={{ color: 'var(--text-muted)' }}>
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

          <div className="nb-card p-3.5 sm:p-4 nb-animate-soft" style={{ animationDelay: '240ms' }}>
            <h2 className="text-sm sm:text-base font-bold mb-1">Quick take</h2>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {largestExpense
                ? `Your largest expense is ${largestExpense.title} at ${currency.format(largestExpense.amount)}. `
                : 'You have no expense transactions yet. '}
              {largestIncome
                ? `Your largest income is ${largestIncome.title} at ${currency.format(largestIncome.amount)}. `
                : 'Add income entries to get a clearer cashflow summary. '}
              Track the latest activity above for a fast daily check-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
