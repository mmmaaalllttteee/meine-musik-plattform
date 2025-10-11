import Link from 'next/link';
import { GlassPanel } from '@/components/glass-panel';

const demoProjects = [
  { id: 'proj-1', name: 'Album "Spectrum"', status: 'active', slug: 'album-spectrum' },
  { id: 'proj-2', name: 'Festival Kampagne', status: 'planning', slug: 'festival-kampagne' }
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-white">Projekte</h1>
        <p className="text-sm text-slate-100/80">
          Mandantenfähige Projektstruktur mit granularen Rollen, Share-Links und Templates.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {demoProjects.map((project) => (
          <GlassPanel key={project.id} className="bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">{project.name}</h2>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-100/60">Status: {project.status}</p>
              </div>
              <Link href={`/projects/${project.slug}`} className="text-sm text-accent hover:text-white">
                Öffnen →
              </Link>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-slate-100/70">
              <li>• Kanban-Boards mit Drag & Drop</li>
              <li>• Moodboard Canvas mit Live-Cursor</li>
              <li>• Datei-Ordner, Presigned Uploads & Versionierung</li>
            </ul>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
