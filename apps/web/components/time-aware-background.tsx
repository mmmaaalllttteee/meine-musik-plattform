'use client';

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type ThemeWindow = 'light' | 'dawn' | 'dark';

function resolveThemeWindow(date = new Date()): ThemeWindow {
  const hours = date.getHours();
  if (hours >= 7 && hours < 19) return 'light';
  if (hours >= 19 && hours < 22) return 'dawn';
  return 'dark';
}

export function TimeAwareBackground() {
  const [themeWindow, setThemeWindow] = useState<ThemeWindow>(() => resolveThemeWindow());

  useEffect(() => {
    const timer = setInterval(() => setThemeWindow(resolveThemeWindow()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const gradient = useMemo(() => {
    switch (themeWindow) {
      case 'light':
        return 'from-white/60 via-white/30 to-slate-200/20';
      case 'dawn':
        return 'from-amber-200/40 via-fuchsia-300/30 to-indigo-500/40';
      default:
        return 'from-slate-900/90 via-slate-800/80 to-indigo-950/70';
    }
  }, [themeWindow]);

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br transition-[background-image] duration-700 ease-in-out',
        gradient
      )}
    />
  );
}
