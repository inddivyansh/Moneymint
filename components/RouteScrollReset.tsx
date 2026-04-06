'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';

export default function RouteScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Disable browser-driven restoration for this SPA shell.
    window.history.scrollRestoration = 'manual';

    const resetTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    const onPageShow = () => resetTop();
    const onPopState = () => resetTop();

    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Route transitions can race with paint/restore; nudge to top in a few ticks.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 60);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Keep route navigation deterministic: always open pages from top.
    window.history.scrollRestoration = 'manual';
  }, [pathname]);

  return null;
}
