'use client';

const insights = [
  'Top spending category: Track one category at a time to spot budget leaks quickly.',
  'Savings rate: Keep a consistent monthly target and compare it against your income.',
  'Average expense: Review recurring purchases before scaling discretionary spending.',
  'Risk check: A simple visual summary often makes more sense than a heavy AI pipeline for a frontend assignment.',
];

export default function InsightsPage() {
  return (
    <div className="space-y-6 nb-animate-in">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
          Intelligence
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Insights
        </h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {insights.map((insight, index) => (
          <div key={insight} className="nb-card p-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Insight 0{index + 1}
            </p>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {insight}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
