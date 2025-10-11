import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'We make IT work — Service Hub',
  description:
    'Mandantenfähige Collaboration-Plattform für Artists, Labels und Musik-Teams. Projekte, Dateien, Analytics und Moodboards in einer Oberfläche.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-slate-950 text-slate-100 antialiased', inter.className)}>
        <Providers>
          <main className="relative flex min-h-screen flex-col">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(126,87,194,0.35),_rgba(13,25,43,0.95))]" />
            <div className="pointer-events-none fixed inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 via-transparent to-transparent mix-blend-screen" />
            <div className="relative flex-1">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
