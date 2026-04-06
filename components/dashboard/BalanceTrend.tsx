'use client';

import { useDashboard, currency, formatSignedCurrency } from '@/lib/dashboard-store';

export default function BalanceTrend() {
  const { monthlyData } = useDashboard();

  if (monthlyData.length === 0) {
    return (
      <article className="nb-card p-5">
        <h2 className="text-lg font-bold mb-4">Balance Trend</h2>
        <div className="nb-card-flat p-8 text-center" style={{ color: 'var(--text-muted)' }}>
          No trend data available yet.
        </div>
      </article>
    );
  }

  const balances = monthlyData.map((d) => d.balance);
  const incomes = monthlyData.map((d) => d.income);
  const expenses = monthlyData.map((d) => d.expense);

  const allValues = [...balances, ...incomes, ...expenses.map(v => -v)];
  const maxVal = Math.max(...incomes, ...expenses, ...balances.map(Math.abs));
  const chartHeight = 200;
  const chartWidth = 600;
  const padding = { top: 20, right: 20, bottom: 40, left: 20 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  const barGroupWidth = plotWidth / monthlyData.length;
  const barWidth = Math.min(barGroupWidth * 0.35, 32);
  const gap = 4;

  return (
    <article className="nb-card p-5">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">Balance Trend</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Monthly income vs expenses</p>
        </div>
        <span className="nb-badge nb-badge-neutral">TIME BASED</span>
      </header>

      <div className="overflow-x-auto scrollbar-hide">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full"
          style={{ minWidth: 400 }}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padding.top + plotHeight * (1 - pct);
            return (
              <g key={pct}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="var(--surface-3)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}

          {/* Bars */}
          {monthlyData.map((item, i) => {
            const cx = padding.left + barGroupWidth * i + barGroupWidth / 2;
            const incomeH = maxVal === 0 ? 0 : (item.income / maxVal) * plotHeight;
            const expenseH = maxVal === 0 ? 0 : (item.expense / maxVal) * plotHeight;

            return (
              <g key={item.month}>
                {/* Income bar */}
                <rect
                  x={cx - barWidth - gap / 2}
                  y={padding.top + plotHeight - incomeH}
                  width={barWidth}
                  height={incomeH}
                  fill="var(--income)"
                  stroke="var(--nb-border-color)"
                  strokeWidth="1.5"
                  rx="2"
                />
                {/* Expense bar */}
                <rect
                  x={cx + gap / 2}
                  y={padding.top + plotHeight - expenseH}
                  width={barWidth}
                  height={expenseH}
                  fill="var(--expense)"
                  stroke="var(--nb-border-color)"
                  strokeWidth="1.5"
                  rx="2"
                />
                {/* Month label */}
                <text
                  x={cx}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="var(--text-muted)"
                  fontFamily="var(--font-sans)"
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          {/* Baseline */}
          <line
            x1={padding.left}
            y1={padding.top + plotHeight}
            x2={chartWidth - padding.right}
            y2={padding.top + plotHeight}
            stroke="var(--nb-border-color)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm border-2" style={{ backgroundColor: 'var(--income)', borderColor: 'var(--nb-border-color)' }} />
          Income
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm border-2" style={{ backgroundColor: 'var(--expense)', borderColor: 'var(--nb-border-color)' }} />
          Expenses
        </span>
      </div>

      {/* Monthly summary pills */}
      <div className="flex flex-wrap gap-2 mt-3">
        {monthlyData.map((item) => (
          <span
            key={item.month}
            className="nb-badge nb-badge-neutral text-xs"
          >
            {item.label}: {formatSignedCurrency(item.balance)}
          </span>
        ))}
      </div>
    </article>
  );
}
