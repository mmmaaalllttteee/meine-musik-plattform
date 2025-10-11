import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassTileProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: ReactNode;
  footer?: ReactNode;
}

export function GlassTile({ className, title, description, icon, footer, children, ...props }: GlassTileProps) {
  return (
    <section
      className={cn(
        'glass-tile group flex h-full flex-col justify-between border-white/10 bg-white/10 p-6 text-slate-100 shadow-glass backdrop-blur-xl',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white drop-shadow">{title}</h3>
          {description ? <p className="mt-2 text-sm text-slate-200/80">{description}</p> : null}
        </div>
        {icon ? <div className="text-accent-mint opacity-80 transition duration-200 group-hover:opacity-100">{icon}</div> : null}
      </div>
      <div className="mt-6 flex-1">{children}</div>
      {footer ? <div className="mt-6 text-xs text-slate-200/70">{footer}</div> : null}
    </section>
  );
}
