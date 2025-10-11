import { GlassPanel } from '@/components/glass-panel';

const moodItems = [
  { id: '1', title: 'Cover Draft', type: 'image', position: { x: 120, y: 80 } },
  { id: '2', title: 'Chord Progression', type: 'audio', position: { x: 320, y: 220 } }
];

export default function MoodboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-white">Moodboard</h1>
        <p className="text-sm text-slate-100/80">
          Visuelles Collaboration-Canvas mit Live-Cursor, Kommentaren und Snapping-Grid.
        </p>
      </header>
      <GlassPanel className="bg-white/5">
        <div className="relative h-[480px] w-full rounded-3xl border border-dashed border-white/20 bg-slate-900/70 p-8">
          {moodItems.map((item) => (
            <div
              key={item.id}
              className="absolute flex w-48 flex-col gap-2 rounded-2xl border border-white/20 bg-white/10 p-3 text-xs"
              style={{ left: item.position.x, top: item.position.y }}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">{item.type}</span>
              <span className="text-sm text-white">{item.title}</span>
              <span className="text-[10px] text-white/60">Drag & Drop mit React DnD</span>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
