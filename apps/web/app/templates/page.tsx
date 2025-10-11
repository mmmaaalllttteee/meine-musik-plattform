import { GlassPanel } from '@/components/glass-panel';

const templates = [
  { id: 'nda', name: 'NDA (Deutsch)', version: '1.0.0', type: 'Vertrag' },
  { id: 'promo-plan', name: 'Promo Plan XLSX', version: '0.9.2', type: 'Template' }
];

export default function TemplatesPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-white">Templates & Verträge</h1>
        <p className="text-sm text-slate-100/80">
          Versionierte Bibliothek. Vertragsgenerator nutzt JSON-Schema, DOCX-Merge und PDF-Export.
        </p>
      </header>
      <GlassPanel className="bg-white/5">
        <ul className="space-y-4 text-sm text-slate-100/80">
          {templates.map((template) => (
            <li key={template.id} className="flex items-center justify-between">
              <div>
                <p className="text-white">{template.name}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-100/60">
                  {template.type} • Version {template.version}
                </p>
              </div>
              <button className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white">
                Herunterladen
              </button>
            </li>
          ))}
        </ul>
      </GlassPanel>
    </div>
  );
}
