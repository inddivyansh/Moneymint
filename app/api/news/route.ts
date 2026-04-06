import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.NEWSDATA_KEY;

    if (!apiKey) {
      return NextResponse.json({
        articles: [],
        message: 'News feed not configured. Add NEWSDATA_KEY to .env.local.',
      });
    }

    const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&category=business&language=en&size=8`;

    const response = await fetch(url, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!response.ok) {
      console.error('NewsData API error:', response.status);
      return NextResponse.json({ articles: [], message: 'News API error' });
    }

    const data = await response.json();

    const articles = (data.results ?? []).map((item: Record<string, unknown>) => ({
      title: item.title ?? '',
      link: item.link ?? '#',
      source_name: item.source_name ?? 'Unknown',
      pubDate: item.pubDate ?? '',
      description: item.description ?? '',
      category: item.category ?? [],
    }));

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json({ articles: [], message: 'Failed to fetch news' });
  }
}
