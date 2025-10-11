import { GlassPanel } from '@/components/glass-panel';
import { KPIWidget } from '@/components/kpi-widget';
import { kpiTiles } from '@/data/kpis';

export default function AnalyticsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-white">Analytics Hub</h1>
        <p className="text-sm text-slate-100/80">
          Verbinde Spotify, Apple Music, GA4, Meta, TikTok, YouTube & mehr. Bento-Layout mit Drag & Drop.
        </p>
      </header>
      <GlassPanel className="bg-white/5">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {kpiTiles.map((tile) => (
            <div key={tile.title} className="glass-tile border-white/5 bg-slate-900/60 p-5">
              <KPIWidget {...tile} />
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
