import { GlassPanel } from '@/components/glass-panel';
import { GlassTile } from '@/components/glass-tile';
import { KPIWidget } from '@/components/kpi-widget';
import { kpiTiles } from '@/data/kpis';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-slate-100/80">
          Personalisierbare KPI-Tiles, Notizen und Ankündigungen aus dem CMS. Die Datenquellen werden über das Analytics-Modul
          definiert.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {kpiTiles.map((tile) => (
          <GlassTile key={tile.title} title={tile.title} description="Letzte 28 Tage">
            <KPIWidget {...tile} />
          </GlassTile>
        ))}
      </section>
      <GlassPanel className="bg-white/5">
        <h2 className="text-2xl font-semibold text-white">Ankündigungen & Roadmap</h2>
        <p className="mt-2 text-sm text-slate-100/80">
          Inhalte werden aus Strapi synchronisiert. Webhooks triggern automatische Revalidierung der entsprechenden Routen.
        </p>
        <Link href="/news" className="mt-4 inline-flex items-center text-sm text-accent hover:text-white">
          Zum Newsroom →
        </Link>
      </GlassPanel>
    </div>
  );
}
