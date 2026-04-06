'use client';

import { useDashboard, currency } from '@/lib/dashboard-store';

const COLORS = ['#FFD60A', '#22C55E', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#10B981'];

export default function SpendingBreakdown() {
  const { spendingByCategory } = useDashboard();

  if (spendingByCategory.length === 0) {
    return (
      <article className="nb-card premium-panel p-5">
        <h2 className="text-lg font-bold mb-4">Spending Breakdown</h2>
        <div className="nb-card-flat p-8 text-center" style={{ color: 'var(--text-muted)' }}>
          No expense data available.
        </div>
      </article>
    );
  }

  const maxTotal = spendingByCategory[0]?.total ?? 1;

  return (
    <article className="nb-card premium-panel p-5">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">Spending Breakdown</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Where your money goes</p>
        </div>
        <span className="nb-badge nb-badge-neutral">CATEGORICAL</span>
      </header>

      <div className="space-y-3">
        {spendingByCategory.map((item, index) => {
          const widthPct = (item.total / maxTotal) * 100;
          const color = COLORS[index % COLORS.length];

          return (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-sm border-2"
                    style={{ backgroundColor: color, borderColor: 'var(--nb-border-color)' }}
                  />
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                    {item.percentage.toFixed(1)}%
                  </span>
                  <span className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    {currency.format(item.total)}
                  </span>
                </div>
              </div>
              <div
                className="h-3 overflow-hidden rounded-sm"
                style={{
                  backgroundColor: 'var(--surface-2)',
                  border: '1.5px solid var(--nb-border-color)',
                }}
              >
                <div
                  className="h-full rounded-sm transition-all duration-500"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
