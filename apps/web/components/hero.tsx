'use client';

import { motion } from 'framer-motion';
import { TimeAwareBackground } from './time-aware-background';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24" id="top">
      <TimeAwareBackground />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="glass-panel relative z-10 flex flex-col items-center gap-6 border-white/10 bg-white/15 p-10"
        >
          <span className="rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.4em] text-white/80">
            Service Hub for Music Teams
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white drop-shadow-lg md:text-6xl">
            Alle Projekte, Releases & Kampagnen in einem Liquid-Glass Workspace
          </h1>
          <p className="max-w-2xl text-base text-slate-100/80">
            Plane Releases, verfolge KPIs, teile Moodboards und manage Verträge – DSGVO-konform, mandantenfähig und
            bereit für deine nächsten Chart-Erfolge.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a
              href="#pricing"
              className="rounded-full bg-gradient-to-r from-accent via-accent-mint to-accent-peach px-6 py-3 font-semibold text-slate-900 shadow-xl"
            >
              Preise entdecken
            </a>
            <a
              href="/auth/register"
              className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white/90 backdrop-blur-xl transition hover:border-white/60"
            >
              Kostenlos testen
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="relative grid w-full gap-6 md:grid-cols-2"
        >
          <div className="glass-tile border-white/10 bg-white/10 p-6 text-left">
            <h3 className="text-lg font-semibold text-white">Release Control Center</h3>
            <p className="mt-2 text-sm text-slate-100/80">
              Multi-Board Kanban, Vorlagen für Album- und Single-Launches, Aufgaben-Pipelines mit Echtzeit-Status.
            </p>
          </div>
          <div className="glass-tile border-white/10 bg-white/10 p-6 text-left">
            <h3 className="text-lg font-semibold text-white">360° Analytics</h3>
            <p className="mt-2 text-sm text-slate-100/80">
              Spotify bis TikTok – visualisierte KPIs, Drag & Drop Bento-Grids, automatische Alerts & Exporte.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
