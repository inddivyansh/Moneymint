'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/home', label: 'Home', short: 'H' },
  { href: '/transactions', label: 'Transactions', short: 'T' },
  { href: '/portfolio', label: 'Portfolio', short: 'P' },
  { href: '/upi', label: 'UPI', short: 'U' },
  { href: '/news', label: 'News', short: 'N' },
  { href: '/insights', label: 'Insights', short: 'I' },
  { href: '/rewards', label: 'Rewards', short: 'R' },
  { href: '/profile', label: 'Profile', short: 'Pr' },
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
        <div className="p-4 pb-3" style={{ borderBottom: '1px solid var(--surface-3)' }}>
          <Link href="/home" className="flex items-center gap-2">
            <Image src="/assets/icons/moneymintlogo.png" alt="Moneymint logo" width={32} height={32} className="shrink-0" />
            <span className="text-base font-extrabold tracking-tight hidden lg:inline" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Moneymint
            </span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-2.5 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: active ? 'var(--accent)' : 'transparent',
                  color: active ? '#1A1A1A' : 'var(--text-secondary)',
                  border: active ? '2px solid var(--nb-border-color)' : '2px solid transparent',
                  boxShadow: active ? 'var(--nb-shadow-sm)' : 'none',
                }}
                title={item.label}
              >
                <span className="hidden lg:inline">{item.label}</span>
                <span className="lg:hidden">{item.short}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 text-center" style={{ borderTop: '1px solid var(--surface-3)' }}>
          <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
            Moneymint
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex overflow-x-auto"
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
              className="flex-1 flex items-center justify-center py-2 text-center transition-colors min-w-max sm:min-w-fit"
              style={{
                color: active ? '#1A1A1A' : 'var(--text-muted)',
                backgroundColor: active ? 'var(--accent)' : 'transparent',
              }}
              title={item.label}
            >
              <span className="text-xs sm:text-sm font-bold leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
