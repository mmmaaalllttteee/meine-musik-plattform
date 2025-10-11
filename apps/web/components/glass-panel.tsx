import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export function GlassPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('glass-panel border-white/5 bg-white/10 p-6 text-slate-100', className)} {...props} />;
}
