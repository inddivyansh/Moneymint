'use client';

import { useState, useEffect } from 'react';

type NewsItem = {
  title: string;
  link: string;
  source_name: string;
  pubDate: string;
  description: string;
  category: string[];
};

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchNews(); }, []);

  async function fetchNews() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setNews(data.articles ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <button type="button" onClick={fetchNews} disabled={loading} className="nb-btn nb-btn-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'animate-spin' : ''}>
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Refresh
        </button>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="nb-card p-5">
              <div className="nb-skeleton h-4 w-20 mb-3" />
              <div className="nb-skeleton h-5 w-full mb-2" />
              <div className="nb-skeleton h-5 w-3/4 mb-4" />
              <div className="nb-skeleton h-3 w-full mb-1" />
              <div className="nb-skeleton h-3 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="nb-card p-8 text-center">
          <p className="text-sm font-bold mb-3" style={{ color: 'var(--expense)' }}>{error}</p>
          <button type="button" onClick={fetchNews} className="nb-btn nb-btn-sm">Try Again</button>
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <div className="nb-card p-8 text-center" style={{ color: 'var(--text-muted)' }}>
          No financial news available right now.
        </div>
      )}

      {!loading && !error && news.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item, i) => (
            <a
              key={`${item.link}-${i}`}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="nb-card p-5 flex flex-col"
            >
              {item.category?.[0] && (
                <span className="nb-badge nb-badge-info mb-3 self-start" style={{ fontSize: '0.6rem' }}>
                  {item.category[0]}
                </span>
              )}
              <h3 className="text-sm font-bold mb-2 leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </h3>
              {item.description && (
                <p className="text-xs leading-relaxed line-clamp-3 flex-1 mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                <span>{item.source_name}</span>
                <span>{new Date(item.pubDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
