'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

const NAV = [
  { href: '/home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { href: '/transactions', label: 'Transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { href: '/upi', label: 'UPI', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href: '/news', label: 'News', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { href: '/insights', label: 'AI Analysis', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { href: '/rewards', label: 'Rewards', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
  { href: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/home') return pathname === '/home';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[220px] z-40"
        style={{
          backgroundColor: 'var(--card)',
          borderRight: 'var(--nb-border-width) solid var(--nb-border-color)',
        }}
      >
        {/* Logo */}
        <div className="p-5 pb-4" style={{ borderBottom: '1px solid var(--surface-3)' }}>
          <Link href="/home" className="flex items-center gap-2.5">
            <span
              className="inline-flex items-center justify-center w-8 h-8 text-xs font-black rounded-md"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#1A1A1A',
                border: '2px solid var(--nb-border-color)',
              }}
            >
              M
            </span>
            <span className="text-base font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Moneymint
            </span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 px-3 space-y-1">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: active ? 'var(--accent)' : 'transparent',
                  color: active ? '#1A1A1A' : 'var(--text-secondary)',
                  border: active ? '2px solid var(--nb-border-color)' : '2px solid transparent',
                  boxShadow: active ? 'var(--nb-shadow-sm)' : 'none',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 space-y-3" style={{ borderTop: '1px solid var(--surface-3)' }}>
          <ThemeToggle />
          <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
            by Divyansh Nagar
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{
          backgroundColor: 'var(--card)',
          borderTop: 'var(--nb-border-width) solid var(--nb-border-color)',
        }}
      >
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-center transition-colors"
              style={{
                color: active ? '#1A1A1A' : 'var(--text-muted)',
                backgroundColor: active ? 'var(--accent)' : 'transparent',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span className="text-[10px] font-bold leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
