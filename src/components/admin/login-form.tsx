'use client';

import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';

import { login } from '@/app/admin/actions';
import { Logo } from '@/components/brand/logo';
import { cn } from '@/lib/utils';
import { ui } from './ui';

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: null, email: '' });
  const { error } = state;

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[min(640px,100%)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.12),transparent_65%)]"
      />
      <form action={action} className={cn(ui.card, 'relative flex w-full max-w-[400px] flex-col gap-5 p-8 shadow-mock')}>
        <div className="flex flex-col items-center gap-2 text-center">
          <Logo />
          <h1 className="m-0 mt-2 font-display text-xl font-semibold text-title">Panel del blog</h1>
          <p className="m-0 text-sm text-muted">Ingresá para escribir y publicar artículos.</p>
        </div>
        <div>
          <label htmlFor="email" className={ui.label}>
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state.email} className={ui.input} />
        </div>
        <div>
          <label htmlFor="password" className={ui.label}>
            Contraseña
          </label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className={ui.input} />
        </div>
        {error && (
          <p role="alert" className="m-0 rounded-[10px] border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {error}
          </p>
        )}
        <button type="submit" disabled={pending} className={cn(ui.btnPrimary, 'py-3 text-[15px]')}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {pending ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
