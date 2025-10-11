'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface UIState {
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  kpiSelection: string[];
  setKpiSelection: (tiles: string[]) => void;
}

const UIStateContext = createContext<UIState | undefined>(undefined);

export const defaultKpis = ['spotify-listens', 'youtube-views', 'tiktok-views', 'instagram-reach'];

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [kpiSelection, setKpiSelection] = useState<string[]>(defaultKpis);

  const value = useMemo(
    () => ({
      reducedMotion,
      setReducedMotion,
      kpiSelection,
      setKpiSelection
    }),
    [reducedMotion, kpiSelection]
  );

  return <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>;
}

export function useUIState() {
  const ctx = useContext(UIStateContext);

  if (!ctx) {
    throw new Error('useUIState must be used inside UIStateProvider');
  }

  return ctx;
}
