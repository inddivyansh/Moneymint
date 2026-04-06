'use client';

import NewsFeed from '@/components/dashboard/NewsFeed';

export default function NewsPage() {
  return (
    <div className="space-y-6 nb-animate-in">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
          Markets
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Financial News
        </h1>
      </div>
      <NewsFeed />
    </div>
  );
}
