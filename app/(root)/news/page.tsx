'use client';

import { useMemo, useState } from 'react';
import { useDashboard } from '@/lib/dashboard-store';

type ImpactLevel = 'high' | 'medium' | 'low';

const articles = [
  {
    id: 'n1',
    title: 'Markets open mixed as investors await policy cues',
    source: 'Market Desk',
    date: '06 Apr 2026',
    summary: 'Benchmark indices opened range-bound as investors priced in inflation and rate guidance signals.',
    tag: 'Macro',
    impact: 'high' as ImpactLevel,
    whyItMatters: 'Policy direction can influence borrowing costs, equity valuation multiples, and your SIP return expectations.',
  },
  {
    id: 'n2',
    title: 'Small-cap rotation continues across financial sectors',
    source: 'Daily Brief',
    date: '06 Apr 2026',
    summary: 'Capital is rotating into selective small-cap financial names after recent stability in earnings outlook.',
    tag: 'Equities',
    impact: 'medium' as ImpactLevel,
    whyItMatters: 'If your portfolio is concentrated in one market cap bucket, this is a reminder to rebalance risk.',
  },
  {
    id: 'n3',
    title: 'Retail investors keep focusing on long-term accumulation',
    source: 'Signal Report',
    date: '06 Apr 2026',
    summary: 'Systematic investing trends remain strong as households prefer disciplined monthly investing plans.',
    tag: 'Personal Finance',
    impact: 'low' as ImpactLevel,
    whyItMatters: 'Consistency beats timing. This trend supports building long-term habits over short-term speculation.',
  },
  {
    id: 'n4',
    title: 'Digital payments adoption rises in tier-2 cities',
    source: 'Payments Wire',
    date: '05 Apr 2026',
    summary: 'UPI-led digital payments growth accelerated in non-metro regions with stronger merchant acceptance.',
    tag: 'UPI',
    impact: 'medium' as ImpactLevel,
    whyItMatters: 'A higher digital footprint makes spending traceable, improving budgeting accuracy in apps like Moneymint.',
  },
  {
    id: 'n5',
    title: 'Commodity prices ease, helping near-term transport costs',
    source: 'Commodities Pulse',
    date: '05 Apr 2026',
    summary: 'Crude and select commodity softening may moderate logistics and commute related expenses.',
    tag: 'Commodities',
    impact: 'low' as ImpactLevel,
    whyItMatters: 'Potential easing in fuel-linked categories can create room to increase monthly savings.',
  },
];

export default function NewsPage() {
  const { state } = useDashboard();
  const [activeTag, setActiveTag] = useState<'All' | 'Macro' | 'Equities' | 'Personal Finance' | 'UPI' | 'Commodities'>('All');

  const userTopCategories = useMemo(() => {
    const expenses = state.transactions.filter((tx) => tx.type === 'expense');
    const categoryMap = expenses.reduce<Record<string, number>>((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});
    return Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name);
  }, [state.transactions]);

  const filtered = useMemo(() => {
    if (activeTag === 'All') return articles;
    return articles.filter((article) => article.tag === activeTag);
  }, [activeTag]);

  const impactStyles: Record<ImpactLevel, { label: string; bg: string; color: string }> = {
    high: { label: 'High Impact', bg: 'var(--expense-bg)', color: 'var(--expense)' },
    medium: { label: 'Medium Impact', bg: 'var(--warning-bg)', color: 'var(--warning)' },
    low: { label: 'Low Impact', bg: 'var(--info-bg)', color: 'var(--info)' },
  };

  return (
    <div className="space-y-5 nb-animate-in">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
          Markets
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Financial News
        </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Daily briefing with context on what matters for your money decisions.
          </p>
        </div>

        <div className="nb-card-flat px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Your focus categories
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-primary)' }}>
            {userTopCategories.length > 0 ? userTopCategories.join(' • ') : 'Add more expenses to personalize this feed'}
          </p>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="nb-card p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Stories today</p>
          <p className="text-lg font-extrabold mt-1" style={{ color: 'var(--text-primary)' }}>{articles.length}</p>
        </div>
        <div className="nb-card p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>High impact</p>
          <p className="text-lg font-extrabold mt-1" style={{ color: 'var(--expense)' }}>{articles.filter((a) => a.impact === 'high').length}</p>
        </div>
        <div className="nb-card p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Personalized feed</p>
          <p className="text-lg font-extrabold mt-1" style={{ color: 'var(--income)' }}>{filtered.length}</p>
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        {['All', 'Macro', 'Equities', 'Personal Finance', 'UPI', 'Commodities'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag as typeof activeTag)}
            className={`nb-btn nb-btn-sm ${activeTag === tag ? 'nb-btn-primary' : ''}`}
          >
            {tag}
          </button>
        ))}
      </section>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
        {filtered.map((article) => (
          <article key={article.id} className="nb-card p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest truncate" style={{ color: 'var(--text-muted)' }}>
                  {article.source}
                </p>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
                  {article.tag}
                </span>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0"
                style={{ backgroundColor: impactStyles[article.impact].bg, color: impactStyles[article.impact].color }}
              >
                {impactStyles[article.impact].label}
              </span>
            </div>

            <h2 className="text-base font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
              {article.title}
            </h2>

            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {article.summary}
            </p>

            <div className="nb-card-flat p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                Why this matters to you
              </p>
              <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{article.whyItMatters}</p>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2">
              <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>{article.date}</span>
              <button type="button" className="nb-btn nb-btn-sm">Save for later</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
