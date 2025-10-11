import { GlassPanel } from '@/components/glass-panel';

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-white">Einstellungen</h1>
        <p className="text-sm text-slate-100/80">
          Verwalte Profil, Organisation, Theme-Automatik, Abrechnung und SSO.
        </p>
      </header>
      <GlassPanel className="space-y-4 bg-white/5">
        <h2 className="text-2xl font-semibold text-white">Theme & Dynamik</h2>
        <p className="text-sm text-slate-100/80">
          Light: 07–19 Uhr · Dämmerung: 19–22 Uhr · Night: 22–07 Uhr. Auto-Mode berücksichtigt die lokale Zeitzone.
        </p>
        <div className="grid gap-4 text-sm text-slate-100/80">
          <label className="flex items-center justify-between">
            <span>Automatische Umschaltung</span>
            <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-white/30 bg-white/10" />
          </label>
          <label className="flex items-center justify-between">
            <span>Manuelles Theme</span>
            <select className="rounded-lg border border-white/20 bg-white/10 px-3 py-2">
              <option>System</option>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </label>
        </div>
      </GlassPanel>
    </div>
  );
}
