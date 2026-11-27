'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Archive, Check, Inbox, Loader2, MessageCircle, RotateCcw, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ui } from './styles';
import { apiErrorMessage, toast } from './ui';

export interface ConsultaView {
  id: string;
  nombre: string;
  empresa: string | null;
  rubro: string | null;
  whatsapp: string;
  /** Número listo para wa.me (calculado en el servidor). */
  whatsappLink: string;
  necesidad: string;
  mensaje: string | null;
  pagina: string | null;
  estado: 'nueva' | 'respondida' | 'archivada';
  notas: string | null;
  fecha: string;
}

const ETIQUETA: Record<ConsultaView['estado'], string> = {
  nueva: 'Nueva',
  respondida: 'Respondida',
  archivada: 'Archivada',
};

function Tarjeta({
  c,
  onCambio,
  onBorrada,
}: {
  c: ConsultaView;
  onCambio: (c: ConsultaView) => void;
  onBorrada: (id: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [notas, setNotas] = useState(c.notas ?? '');
  const notasCambiaron = notas !== (c.notas ?? '');

  const patch = async (body: Record<string, unknown>, ok: string) => {
    setBusy(true);
    const res = await fetch(`/api/consultas/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (!res.ok) return toast(await apiErrorMessage(res), 'error');
    const data = (await res.json()) as Pick<ConsultaView, 'estado' | 'notas'>;
    onCambio({ ...c, ...data });
    toast(ok);
  };

  const borrar = async () => {
    if (!window.confirm(`¿Borrar la consulta de ${c.nombre}? Se borran todos sus datos.`)) return;
    setBusy(true);
    const res = await fetch(`/api/consultas/${c.id}`, { method: 'DELETE' });
    setBusy(false);
    if (!res.ok) return toast(await apiErrorMessage(res), 'error');
    onBorrada(c.id);
    toast('Consulta borrada.');
  };

  const saludo = encodeURIComponent(`Hola ${c.nombre.split(' ')[0]}, te escribimos de Lupa por la consulta que nos dejaste en la web.`);

  return (
    <li className={cn(ui.card, 'flex flex-col gap-4 p-5', c.estado === 'nueva' && 'border-teal/40')}>
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="m-0 font-display text-[17px] font-semibold text-title">{c.nombre}</p>
          <p className="m-0 text-[13px] text-muted">
            {[c.empresa, c.rubro].filter(Boolean).join(' · ') || 'Sin empresa'} · {c.fecha}
          </p>
        </div>
        <span className="rounded-full bg-sky/10 px-2.5 py-1 text-[12px] font-semibold text-sky">{c.necesidad}</span>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-[12px] font-semibold',
            c.estado === 'nueva' ? 'bg-teal/15 text-teal' : 'bg-white/[0.06] text-body',
          )}
        >
          {ETIQUETA[c.estado]}
        </span>
      </div>

      {c.mensaje && <p className="m-0 whitespace-pre-wrap rounded-[10px] bg-surface-2/60 px-4 py-3 text-[15px] leading-[1.6] text-list">{c.mensaje}</p>}

      <p className="m-0 text-[13px] text-muted">
        WhatsApp: <span className="text-title">{c.whatsapp}</span>
        {c.pagina && (
          <>
            {' · '}Escribió desde{' '}
            <a href={c.pagina} target="_blank" rel="noopener" className="text-teal">
              {c.pagina}
            </a>
          </>
        )}
      </p>

      <label className="flex flex-col gap-1.5">
        <span className={ui.label}>Nota interna</span>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={2}
          maxLength={4000}
          placeholder="Ej.: le mandamos propuesta el martes, volver a escribir el 10."
          className={cn(ui.inputSm, 'resize-y')}
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <a
          href={`https://wa.me/${c.whatsappLink}?text=${saludo}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(ui.btnPrimary, 'px-3 py-2 text-[13px]')}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> Responder por WhatsApp
        </a>
        {notasCambiaron && (
          <button type="button" disabled={busy} onClick={() => patch({ notas }, 'Nota guardada.')} className={cn(ui.btnOutline, 'px-3 py-2 text-[13px]')}>
            Guardar nota
          </button>
        )}
        {c.estado !== 'respondida' && (
          <button type="button" disabled={busy} onClick={() => patch({ estado: 'respondida' }, 'Marcada como respondida.')} className={cn(ui.btnOutline, 'px-3 py-2 text-[13px]')}>
            <Check className="h-4 w-4" aria-hidden="true" /> Marcar respondida
          </button>
        )}
        {c.estado !== 'archivada' && (
          <button type="button" disabled={busy} onClick={() => patch({ estado: 'archivada' }, 'Consulta archivada.')} className={cn(ui.btnOutline, 'px-3 py-2 text-[13px]')}>
            <Archive className="h-4 w-4" aria-hidden="true" /> Archivar
          </button>
        )}
        {c.estado !== 'nueva' && (
          <button type="button" disabled={busy} onClick={() => patch({ estado: 'nueva' }, 'Volvió a nuevas.')} className={cn(ui.btnGhost, 'text-[13px]')}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Volver a nueva
          </button>
        )}
        <span className="flex-1" />
        {busy && <Loader2 className="h-4 w-4 animate-spin self-center text-muted" aria-hidden="true" />}
        <button type="button" disabled={busy} onClick={borrar} aria-label={`Borrar la consulta de ${c.nombre}`} className={cn(ui.btnGhost, 'hover:bg-danger/10 hover:text-danger')}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

interface Props {
  inicial: ConsultaView[];
  filtro: 'nueva' | 'respondida' | 'archivada' | 'todas';
  conteo: Record<'nueva' | 'respondida' | 'archivada', number>;
  error?: string;
  avisosPorMail: boolean;
}

export function ConsultasList({ inicial, filtro, conteo, error, avisosPorMail }: Props) {
  const router = useRouter();
  const [consultas, setConsultas] = useState(inicial);
  // Al cambiar de estado, la consulta sale de la lista filtrada; los contadores se actualizan con refresh().
  const visibles = filtro === 'todas' ? consultas : consultas.filter((c) => c.estado === filtro);

  const tabs: { id: Props['filtro']; label: string; n?: number }[] = [
    { id: 'nueva', label: 'Nuevas', n: conteo.nueva },
    { id: 'respondida', label: 'Respondidas', n: conteo.respondida },
    { id: 'archivada', label: 'Archivadas', n: conteo.archivada },
    { id: 'todas', label: 'Todas' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="m-0 font-display text-2xl font-bold text-title">Consultas</h1>
        <p className="m-0 mt-1 max-w-[680px] text-sm text-muted">
          Todo lo que la gente manda desde el formulario de la web, aunque no termine de enviar el WhatsApp.
          {avisosPorMail ? ' Cada consulta nueva también te llega por mail.' : ''}
        </p>
      </div>

      {!avisosPorMail && (
        <p role="status" className="m-0 rounded-[12px] border border-sky/30 bg-sky/10 px-4 py-3 text-sm text-title">
          Los avisos por mail están apagados. Para activarlos, cargá la contraseña de contacto@ en la variable SMTP_PASS de Vercel.
        </p>
      )}

      <nav aria-label="Filtrar consultas" className="flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/admin/consultas?estado=${t.id}`}
            aria-current={filtro === t.id ? 'page' : undefined}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors',
              filtro === t.id ? 'border-transparent bg-brand text-ink' : 'border-line-strong text-body hover:border-teal/50 hover:text-title',
            )}
          >
            {t.label}
            {t.n !== undefined && <span className="ml-1.5 opacity-70">{t.n}</span>}
          </Link>
        ))}
      </nav>

      {error && (
        <p role="alert" className="m-0 rounded-[12px] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {visibles.length === 0 ? (
        <div className={cn(ui.card, 'flex flex-col items-center gap-2 px-6 py-14 text-center')}>
          <Inbox className="h-8 w-8 text-teal" aria-hidden="true" />
          <p className="m-0 font-display text-lg font-semibold text-title">
            {filtro === 'nueva' ? 'No hay consultas nuevas' : 'No hay consultas acá'}
          </p>
          <p className="m-0 max-w-[420px] text-sm">Cuando alguien complete el formulario de la web, va a aparecer en esta lista.</p>
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {visibles.map((c) => (
            <Tarjeta
              key={c.id}
              c={c}
              onCambio={(nueva) => {
                setConsultas((l) => l.map((x) => (x.id === nueva.id ? nueva : x)));
                router.refresh();
              }}
              onBorrada={(id) => {
                setConsultas((l) => l.filter((x) => x.id !== id));
                router.refresh();
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
