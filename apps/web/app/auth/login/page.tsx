'use client';

import { useState } from 'react';
import { GlassPanel } from '@/components/glass-panel';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Login', { email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <GlassPanel className="w-full max-w-md bg-white/5 p-8">
        <h1 className="text-3xl font-semibold text-white">Login</h1>
        <p className="mt-2 text-sm text-slate-100/80">Melde dich mit deinem WMIW-Account an.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="text-slate-100/70">E-Mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-100/70">Passwort</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-accent via-accent-mint to-accent-peach px-6 py-3 font-semibold text-slate-900"
          >
            Einloggen
          </button>
        </form>
      </GlassPanel>
    </div>
  );
}
