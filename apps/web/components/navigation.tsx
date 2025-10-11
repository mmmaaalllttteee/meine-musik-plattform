import Link from 'next/link';
import { cn } from '@/lib/utils';

const links = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#modules', label: 'Module' },
  { href: '#security', label: 'Security' }
];

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-sm">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-wide text-white">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg">🎧</span>
          We make IT work
        </Link>
        <nav className="hidden gap-8 text-slate-100/80 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className={cn('transition hover:text-white')}>{link.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white/40 hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-gradient-to-r from-accent-mint via-accent to-accent-peach px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-lg"
          >
            Jetzt starten
          </Link>
        </div>
      </div>
    </header>
  );
}
