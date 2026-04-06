'use client';

import InsightsPanel from '@/components/dashboard/InsightsPanel';

export default function InsightsPage() {
  return (
    <div className="space-y-6 nb-animate-in">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
          Intelligence
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          AI Analysis
        </h1>
      </div>
      <InsightsPanel />
    </div>
  );
}
