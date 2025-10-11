'use client';

import { useState } from 'react';
import { GlassPanel } from '@/components/glass-panel';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', organizationName: '' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Register', form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <GlassPanel className="w-full max-w-md bg-white/5 p-8">
        <h1 className="text-3xl font-semibold text-white">Account erstellen</h1>
        <p className="mt-2 text-sm text-slate-100/80">Starte kostenlos mit 1 Projekt und 2 Gästen.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="text-slate-100/70">Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-100/70">Organisation</span>
            <input
              type="text"
              name="organizationName"
              value={form.organizationName}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-100/70">E-Mail</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-100/70">Passwort</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-accent via-accent-mint to-accent-peach px-6 py-3 font-semibold text-slate-900"
          >
            Kostenlos starten
          </button>
        </form>
      </GlassPanel>
    </div>
  );
}
