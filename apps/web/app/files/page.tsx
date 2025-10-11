import { GlassPanel } from '@/components/glass-panel';

const files = [
  { id: 'file-1', name: 'Single Artwork.png', size: '4.1 MB', type: 'Bild', updatedAt: '2024-02-01' },
  { id: 'file-2', name: 'Radio Edit.wav', size: '78 MB', type: 'Audio', updatedAt: '2024-01-28' }
];

export default function FilesPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-white">Dateien</h1>
        <p className="text-sm text-slate-100/80">
          S3-kompatible Speicherung mit Presigned Uploads, Versionierung und detaillierten Metadaten.
        </p>
      </header>
      <GlassPanel className="bg-white/5">
        <table className="w-full text-sm text-slate-100/80">
          <thead className="text-left text-xs uppercase tracking-[0.2em] text-slate-100/60">
            <tr>
              <th className="pb-3">Datei</th>
              <th className="pb-3">Typ</th>
              <th className="pb-3">Größe</th>
              <th className="pb-3">Geändert</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {files.map((file) => (
              <tr key={file.id} className="py-3">
                <td className="py-3 font-medium text-white">{file.name}</td>
                <td>{file.type}</td>
                <td>{file.size}</td>
                <td>{file.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>
    </div>
  );
}
