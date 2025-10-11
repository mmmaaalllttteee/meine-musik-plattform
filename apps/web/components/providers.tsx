'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ReactNode, useMemo } from 'react';
import { ThemeProvider } from 'next-themes';
import { UIStateProvider } from '@/stores/ui-store';

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" enableSystem defaultTheme="system">
        <QueryClientProvider client={queryClient}>
          <UIStateProvider>{children}</UIStateProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
