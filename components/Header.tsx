import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: 'var(--background)',
        borderBottom: 'var(--nb-border-width) solid var(--nb-border-color)',
      }}
    >
      <div className="container flex items-center justify-between py-4 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span
            className="inline-flex items-center justify-center w-9 h-9 text-sm font-black rounded-md"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#1A1A1A',
              border: '2px solid var(--nb-border-color)',
              boxShadow: 'var(--nb-shadow-sm)',
            }}
          >
            M
          </span>
          <div className="hidden sm:flex flex-col leading-tight">
            <span
              className="text-lg font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Moneymint
            </span>
            <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
              by Divyansh Nagar
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* User avatar */}
          <div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{
              border: 'var(--nb-border-width) solid var(--nb-border-color)',
              borderRadius: 'var(--nb-radius)',
              backgroundColor: 'var(--surface-2)',
            }}
          >
            <span
              className="inline-flex items-center justify-center w-7 h-7 text-xs font-black rounded-md"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#1A1A1A',
                border: '2px solid var(--nb-border-color)',
              }}
            >
              D
            </span>
            <span
              className="hidden md:block text-sm font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Divyansh Nagar
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
