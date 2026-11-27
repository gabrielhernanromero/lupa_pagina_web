'use client';

import { useState } from 'react';
import { KeyRound, Loader2, Pencil, Trash2, UserPlus, Wand2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ui } from './styles';
import { apiErrorMessage, toast } from './ui';

export interface UsuarioView {
  id: string;
  email: string;
  nombre: string;
  cargo: string | null;
  linkedin: string | null;
  activo: boolean;
}

interface Props {
  inicial: UsuarioView[];
  yo: { id: string; emergencia: boolean };
}

const MIN = 10;

/** Contraseña aleatoria fácil de dictar: sin 0/O ni 1/l. */
function generarPassword(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

async function enviar(url: string, method: string, body?: unknown): Promise<Response> {
  return fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={ui.label}>{label}</span>
      {children}
    </label>
  );
}

function NuevoUsuario({ onCreado }: { onCreado: (u: UsuarioView) => void }) {
  const vacio = { nombre: '', email: '', cargo: '', linkedin: '', password: '' };
  const [f, setF] = useState(vacio);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof vacio) => (e: React.ChangeEvent<HTMLInputElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await enviar('/api/usuarios', 'POST', f);
    setBusy(false);
    if (!res.ok) return toast(await apiErrorMessage(res), 'error');
    onCreado((await res.json()) as UsuarioView);
    toast(`Usuario creado. Pasale a ${f.nombre} su email y la contraseña para que entre.`);
    setF(vacio);
  };

  return (
    <form onSubmit={crear} className={cn(ui.card, 'flex flex-col gap-4 p-5')}>
      <h2 className="m-0 flex items-center gap-2 font-display text-lg font-semibold text-title">
        <UserPlus className="h-5 w-5 text-teal" aria-hidden="true" /> Agregar usuario
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Nombre y apellido">
          <input required maxLength={80} value={f.nombre} onChange={set('nombre')} className={ui.input} placeholder="Priscila …" />
        </Campo>
        <Campo label="Email (para entrar)">
          <input required type="email" value={f.email} onChange={set('email')} className={ui.input} />
        </Campo>
        <Campo label="Cargo (se ve en los artículos)">
          <input maxLength={80} value={f.cargo} onChange={set('cargo')} className={ui.input} placeholder="Marketing y contenido" />
        </Campo>
        <Campo label="LinkedIn (opcional)">
          <input type="url" value={f.linkedin} onChange={set('linkedin')} className={ui.input} placeholder="https://www.linkedin.com/in/…" />
        </Campo>
        <Campo label={`Contraseña inicial (mín. ${MIN} caracteres)`}>
          <div className="flex gap-2">
            <input required minLength={MIN} value={f.password} onChange={set('password')} className={cn(ui.input, 'font-mono')} autoComplete="new-password" />
            <button type="button" onClick={() => setF((s) => ({ ...s, password: generarPassword() }))} className={cn(ui.btnOutline, 'shrink-0 px-3')}>
              <Wand2 className="h-4 w-4" aria-hidden="true" /> Generar
            </button>
          </div>
        </Campo>
      </div>
      <p className="m-0 text-[12px] text-muted">Después, cada persona puede cambiar su contraseña desde esta misma pantalla.</p>
      <button type="submit" disabled={busy} className={cn(ui.btnPrimary, 'self-start')}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Crear usuario
      </button>
    </form>
  );
}

function FilaUsuario({
  u,
  esYo,
  onCambio,
  onBorrado,
}: {
  u: UsuarioView;
  esYo: boolean;
  onCambio: (u: UsuarioView) => void;
  onBorrado: (id: string) => void;
}) {
  const [editando, setEditando] = useState(false);
  const [f, setF] = useState({ nombre: u.nombre, cargo: u.cargo ?? '', linkedin: u.linkedin ?? '' });
  const [busy, setBusy] = useState(false);

  const patch = async (body: Record<string, unknown>, ok: string) => {
    setBusy(true);
    const res = await enviar(`/api/usuarios/${u.id}`, 'PATCH', body);
    setBusy(false);
    if (!res.ok) return toast(await apiErrorMessage(res), 'error');
    onCambio((await res.json()) as UsuarioView);
    toast(ok);
    return true;
  };

  const resetPassword = async () => {
    const nueva = window.prompt(`Nueva contraseña para ${u.nombre} (mín. ${MIN} caracteres):`, generarPassword());
    if (!nueva) return;
    if (await patch({ password: nueva }, 'Contraseña cambiada. Pasásela a la persona.')) {
      window.prompt('Copiá la contraseña nueva:', nueva);
    }
  };

  const borrar = async () => {
    if (!window.confirm(`¿Borrar a ${u.nombre}? Sus artículos quedan publicados con su firma.`)) return;
    setBusy(true);
    const res = await enviar(`/api/usuarios/${u.id}`, 'DELETE');
    setBusy(false);
    if (!res.ok) return toast(await apiErrorMessage(res), 'error');
    onBorrado(u.id);
    toast('Usuario borrado.');
  };

  return (
    <li className="flex flex-col gap-3 px-5 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-diag font-display text-sm font-bold text-ink"
        >
          {u.nombre.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="m-0 font-medium text-title">
            {u.nombre} {esYo && <span className="text-[12px] font-normal text-teal">(vos)</span>}
          </p>
          <p className="m-0 truncate text-[13px] text-muted">
            {u.email}
            {u.cargo && ` · ${u.cargo}`}
          </p>
        </div>
        <span className={cn('rounded-full px-2.5 py-1 text-[12px] font-semibold', u.activo ? 'bg-teal/15 text-teal' : 'bg-white/[0.06] text-body')}>
          {u.activo ? 'Activo' : 'Desactivado'}
        </span>
        <div className="flex flex-wrap gap-1">
          <button type="button" onClick={() => setEditando((v) => !v)} className={ui.btnGhost}>
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Editar
          </button>
          <button type="button" onClick={resetPassword} disabled={busy} className={ui.btnGhost}>
            <KeyRound className="h-3.5 w-3.5" aria-hidden="true" /> Nueva contraseña
          </button>
          {!esYo && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => patch({ activo: !u.activo }, u.activo ? 'Usuario desactivado: ya no puede entrar.' : 'Usuario activado.')}
                className={ui.btnGhost}
              >
                {u.activo ? 'Desactivar' : 'Activar'}
              </button>
              <button type="button" onClick={borrar} disabled={busy} aria-label={`Borrar a ${u.nombre}`} className={cn(ui.btnGhost, 'hover:bg-danger/10 hover:text-danger')}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
      {editando && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (await patch(f, 'Datos guardados. Si firmó artículos, ya se actualizaron.')) setEditando(false);
          }}
          className="grid gap-3 rounded-[12px] border border-line bg-surface-2/50 p-4 sm:grid-cols-3"
        >
          <Campo label="Nombre y apellido">
            <input required maxLength={80} value={f.nombre} onChange={(e) => setF((s) => ({ ...s, nombre: e.target.value }))} className={ui.inputSm} />
          </Campo>
          <Campo label="Cargo">
            <input maxLength={80} value={f.cargo} onChange={(e) => setF((s) => ({ ...s, cargo: e.target.value }))} className={ui.inputSm} />
          </Campo>
          <Campo label="LinkedIn">
            <input type="url" value={f.linkedin} onChange={(e) => setF((s) => ({ ...s, linkedin: e.target.value }))} className={ui.inputSm} />
          </Campo>
          <div className="flex gap-2 sm:col-span-3">
            <button type="submit" disabled={busy} className={cn(ui.btnPrimary, 'px-3 py-1.5 text-[13px]')}>
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Guardar
            </button>
            <button type="button" onClick={() => setEditando(false)} className={cn(ui.btnOutline, 'px-3 py-1.5 text-[13px]')}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </li>
  );
}

function MiPassword() {
  const [f, setF] = useState({ actual: '', nueva: '', repetir: '' });
  const [busy, setBusy] = useState(false);

  const cambiar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.nueva !== f.repetir) return toast('Las dos contraseñas nuevas no coinciden.', 'error');
    setBusy(true);
    const res = await enviar('/api/cuenta', 'PATCH', { actual: f.actual, nueva: f.nueva });
    setBusy(false);
    if (!res.ok) return toast(await apiErrorMessage(res), 'error');
    toast('Listo: tu contraseña cambió.');
    setF({ actual: '', nueva: '', repetir: '' });
  };

  return (
    <form onSubmit={cambiar} className={cn(ui.card, 'flex flex-col gap-4 p-5')}>
      <h2 className="m-0 flex items-center gap-2 font-display text-lg font-semibold text-title">
        <KeyRound className="h-5 w-5 text-teal" aria-hidden="true" /> Mi contraseña
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Campo label="Actual">
          <input required type="password" autoComplete="current-password" value={f.actual} onChange={(e) => setF((s) => ({ ...s, actual: e.target.value }))} className={ui.input} />
        </Campo>
        <Campo label={`Nueva (mín. ${MIN})`}>
          <input required minLength={MIN} type="password" autoComplete="new-password" value={f.nueva} onChange={(e) => setF((s) => ({ ...s, nueva: e.target.value }))} className={ui.input} />
        </Campo>
        <Campo label="Repetir la nueva">
          <input required minLength={MIN} type="password" autoComplete="new-password" value={f.repetir} onChange={(e) => setF((s) => ({ ...s, repetir: e.target.value }))} className={ui.input} />
        </Campo>
      </div>
      <button type="submit" disabled={busy} className={cn(ui.btnPrimary, 'self-start')}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Cambiar contraseña
      </button>
    </form>
  );
}

export function UsersManager({ inicial, yo }: Props) {
  const [usuarios, setUsuarios] = useState(inicial);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="m-0 font-display text-2xl font-bold text-title">Usuarios</h1>
        <p className="m-0 mt-1 max-w-[680px] text-sm text-muted">
          Cada persona del equipo entra con su propio usuario, y los artículos que escribe salen firmados con su nombre, su cargo
          y su LinkedIn.
        </p>
      </div>

      {yo.emergencia && (
        <p role="status" className="m-0 rounded-[12px] border border-sky/30 bg-sky/10 px-4 py-3 text-sm text-title">
          Entraste con el <strong>acceso de emergencia</strong>. Creá tu usuario y el de Priscila, y a partir de ahí entrá cada uno con
          el suyo. El acceso de emergencia sigue funcionando por si alguna vez lo necesitás.
        </p>
      )}

      <section aria-labelledby="equipo-titulo" className="flex flex-col gap-3">
        <h2 id="equipo-titulo" className="m-0 font-display text-lg font-semibold text-title">
          Equipo ({usuarios.length})
        </h2>
        {usuarios.length === 0 ? (
          <p className={cn(ui.card, 'm-0 px-5 py-8 text-center text-sm text-muted')}>Todavía no hay usuarios. Agregalos acá abajo.</p>
        ) : (
          <ul className={cn(ui.card, 'm-0 list-none divide-y divide-line p-0')}>
            {usuarios.map((u) => (
              <FilaUsuario
                key={u.id}
                u={u}
                esYo={u.id === yo.id}
                onCambio={(nuevo) => setUsuarios((l) => l.map((x) => (x.id === nuevo.id ? nuevo : x)))}
                onBorrado={(id) => setUsuarios((l) => l.filter((x) => x.id !== id))}
              />
            ))}
          </ul>
        )}
      </section>

      <NuevoUsuario onCreado={(u) => setUsuarios((l) => [...l, u])} />
      {!yo.emergencia && <MiPassword />}
    </div>
  );
}
