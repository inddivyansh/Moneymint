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
      <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between py-3 sm:py-4 gap-2 sm:gap-4">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 group shrink-0">
          <span
            className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-xs font-black rounded-md"
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
              className="text-sm sm:text-lg font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Moneymint
            </span>
            <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
              Finance Dashboard
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <ThemeToggle />

          {/* User avatar */}
          <div
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5"
            style={{
              border: 'var(--nb-border-width) solid var(--nb-border-color)',
              borderRadius: 'var(--nb-radius)',
              backgroundColor: 'var(--surface-2)',
            }}
          >
            <span
              className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 text-[10px] sm:text-xs font-black rounded-md"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#1A1A1A',
                border: '2px solid var(--nb-border-color)',
              }}
            >
              D
            </span>
            <span
              className="hidden md:block text-xs sm:text-sm font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Divyansh
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
