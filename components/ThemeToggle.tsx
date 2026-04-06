'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <button className="wl-btn-ghost flex items-center justify-center cursor-wait" style={{ padding: '0.5rem', width: '38px', height: '38px' }} disabled></button>;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="wl-btn-ghost flex items-center justify-center transition-transform hover:scale-105"
      style={{ padding: '0.5rem', width: '38px', height: '38px' }}
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-accent" />
      ) : (
        <Moon className="w-4 h-4 text-gray-800" />
      )}
    </button>
  );
}
