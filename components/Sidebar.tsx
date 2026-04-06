'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ScrollText, PieChart, Smartphone, Newspaper, Sparkles, Ticket, UserRound } from 'lucide-react';

const NAV = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/transactions', label: 'Transactions', icon: ScrollText },
  { href: '/portfolio', label: 'Portfolio', icon: PieChart },
  { href: '/upi', label: 'UPI', icon: Smartphone },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/insights', label: 'Insights', icon: Sparkles },
  { href: '/rewards', label: 'Rewards', icon: Ticket },
  { href: '/profile', label: 'Profile', icon: UserRound },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/home') return pathname === '/home';
    return pathname.startsWith(href);
  };

  const handleNavClick = () => {
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
    }
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
                scroll={true}
                onClick={handleNavClick}
                className="flex items-center px-2.5 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: active ? 'var(--accent)' : 'transparent',
                  color: active ? '#1A1A1A' : 'var(--text-secondary)',
                  border: active ? '2px solid var(--nb-border-color)' : '2px solid transparent',
                  boxShadow: active ? 'var(--nb-shadow-sm)' : 'none',
                }}
                title={item.label}
              >
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="mt-auto p-3 text-center" style={{ borderTop: '1px solid var(--surface-3)' }}>
          <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
            Moneymint
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-3 left-3 right-3 z-40 mx-auto flex max-w-[calc(100%-1.5rem)] overflow-x-auto overscroll-x-contain snap-x snap-mandatory scrollbar-hide rounded-full border px-2 py-2 shadow-[0_18px_45px_rgba(0,0,0,0.12)]"
        style={{
          backgroundColor: 'var(--card)',
          border: 'var(--nb-border-width) solid var(--nb-border-color)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {NAV.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              scroll={true}
              onClick={handleNavClick}
              className="flex-none w-1/4 min-w-[25%] snap-start px-1.5"
              style={{
                color: active ? '#1A1A1A' : 'var(--text-muted)',
              }}
              title={item.label}
            >
              <span
                className="flex h-12 flex-col items-center justify-center gap-1 rounded-full border text-center transition-colors"
                style={{
                  backgroundColor: active ? 'var(--accent)' : 'transparent',
                  borderColor: active ? 'var(--nb-border-color)' : 'transparent',
                  boxShadow: active ? 'var(--nb-shadow-sm)' : 'none',
                }}
              >
                <Icon className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
