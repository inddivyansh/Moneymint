'use client';

const articles = [
  {
    title: 'Markets open mixed as investors await policy cues',
    source: 'Market Desk',
    date: '06 Apr 2026',
    summary: 'A calm, front-end-friendly placeholder news feed that keeps the layout working without a backend or external API.',
  },
  {
    title: 'Small-cap rotation continues across financial sectors',
    source: 'Daily Brief',
    date: '06 Apr 2026',
    summary: 'Use this screen to showcase card layout, spacing, and hierarchy without depending on live data.',
  },
  {
    title: 'Retail investors keep focusing on long-term accumulation',
    source: 'Signal Report',
    date: '06 Apr 2026',
    summary: 'Static content keeps the assignment self-contained and Vercel-safe for review.',
  },
];

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article key={article.title} className="nb-card p-5 flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              {article.source}
            </p>
            <h2 className="text-sm font-bold mb-2 leading-snug" style={{ color: 'var(--text-primary)' }}>
              {article.title}
            </h2>
            <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
              {article.summary}
            </p>
            <div className="mt-4 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
              {article.date}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
