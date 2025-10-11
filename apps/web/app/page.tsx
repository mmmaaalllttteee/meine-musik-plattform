import { Hero } from '@/components/hero';
import { Navigation } from '@/components/navigation';
import { GlassTile } from '@/components/glass-tile';
import { GlassPanel } from '@/components/glass-panel';
import { kpiTiles } from '@/data/kpis';
import { modules } from '@/data/modules';
import { pricing } from '@/data/pricing';
import { KPIWidget } from '@/components/kpi-widget';

export default function HomePage() {
  return (
    <div className="relative pb-24">
      <Navigation />
      <Hero />
      <section id="features" className="mx-auto mt-24 w-full max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((module) => (
            <GlassTile key={module.title} title={`${module.icon} ${module.title}`} description={module.description}>
              <p className="text-sm text-slate-100/75">
                {module.title === 'Analytics Hub'
                  ? 'OAuth-Connectoren mit BullMQ Syncs und tägliche Snapshots für konsistente Reports.'
                  : 'Teamorientierte Funktionen, die Mandantenrechte, Gäste und DSGVO-Standards berücksichtigen.'}
              </p>
            </GlassTile>
          ))}
        </div>
      </section>

      <section id="analytics" className="mx-auto mt-24 w-full max-w-6xl px-6">
        <GlassPanel className="flex flex-col gap-6 bg-white/5">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-white/70">Analytics Hub</span>
            <h2 className="text-3xl font-semibold text-white">Mock-Daten für das KPI Bento Layout</h2>
            <p className="text-sm text-slate-100/80">
              KPI-Tiles können per Drag & Drop neu arrangiert werden. Jede Kachel folgt demselben Interface und lässt sich mit
              Live-Daten aus Spotify, Apple Music, TikTok, Meta und GA4 verbinden.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {kpiTiles.map((tile) => (
              <div key={tile.title} className="glass-tile border-white/5 bg-slate-900/60 p-5">
                <KPIWidget {...tile} />
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>

      <section id="pricing" className="mx-auto mt-24 w-full max-w-6xl px-6">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-3xl font-semibold text-white">Transparentes Pricing</h2>
          <p className="text-sm text-slate-100/80">
            Alle Preise exkl. MwSt. – vollständig über das CMS pflegbar und via ISR aktualisierbar.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {pricing.map((plan) => (
            <GlassPanel
              key={plan.name}
              className={`flex h-full flex-col gap-4 border-white/10 ${plan.highlight ? 'bg-gradient-to-br from-accent/40 via-accent-mint/30 to-accent-peach/40 text-slate-900' : 'bg-white/5'}`}
            >
              <div>
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className={`mt-2 text-sm ${plan.highlight ? 'text-slate-800/80' : 'text-slate-100/80'}`}>{plan.description}</p>
              </div>
              <div className="text-3xl font-semibold">{plan.price}</div>
              <ul className={`flex flex-1 flex-col gap-2 text-sm ${plan.highlight ? 'text-slate-800/80' : 'text-slate-100/75'}`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="inline-flex items-center gap-2">
                    <span>✨</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="/contact"
                className={`rounded-full px-4 py-2 text-center text-sm font-semibold shadow-lg transition ${plan.highlight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white/15 text-white hover:bg-white/25'}`}
              >
                {plan.cta}
              </a>
            </GlassPanel>
          ))}
        </div>
      </section>

      <section id="security" className="mx-auto mt-24 w-full max-w-6xl px-6">
        <GlassPanel className="grid gap-10 bg-white/5 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold text-white">Security & Compliance</h2>
            <p className="mt-4 text-sm text-slate-100/80">
              DSGVO-konforme Infrastruktur in der EU, Audit-Logs, Rollen- und Rechteverwaltung sowie regelmäßige Backups.
              OpenTelemetry & Sentry sichern Observability.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-slate-100/75">
            <p>• Verschlüsselte OAuth-Tokens (KMS) und BullMQ-Jobs für Refresh-Flows.</p>
            <p>• Share-Links mit Ablaufdatum, optionalem Passwort und Wasserzeichen.</p>
            <p>• CI/CD mit GitHub Actions, OWASP ZAP Scans & Accessibility Checks.</p>
            <p>• Terraform IaC für Staging/Prod-Parität.</p>
          </div>
        </GlassPanel>
      </section>

      <footer className="mx-auto mt-24 flex w-full max-w-6xl flex-col gap-4 px-6 pb-12 text-sm text-slate-100/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} We make IT work</span>
          <div className="flex gap-4">
            <a href="/legal/impressum" className="hover:text-white">
              Impressum
            </a>
            <a href="/legal/privacy" className="hover:text-white">
              Datenschutz
            </a>
            <a href="/legal/terms" className="hover:text-white">
              Nutzungsbedingungen
            </a>
          </div>
        </div>
        <p className="text-xs text-slate-100/50">
          Inhalte und Roadmap werden aus dem Headless CMS (Strapi) synchronisiert. Änderungen triggern automatische Revalidierung.
        </p>
      </footer>
    </div>
  );
}
