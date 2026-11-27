'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { buttonVariants } from '@/components/ui/button';
import { necesidades } from '@/data/home';
import { trackEvent } from '@/lib/analytics';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

interface FormState {
  nombre: string;
  empresa: string;
  rubro: string;
  whatsapp: string;
  necesidad: string;
  mensaje: string;
}

type Campo = 'nombre' | 'necesidad' | 'whatsapp';

const vacio: FormState = { nombre: '', empresa: '', rubro: '', whatsapp: '', necesidad: '', mensaje: '' };

function validar(f: FormState): { campo: Campo; mensaje: string } | null {
  if (!f.nombre.trim()) return { campo: 'nombre', mensaje: 'Completá tu nombre.' };
  if (!f.necesidad) return { campo: 'necesidad', mensaje: 'Elegí qué necesitás.' };
  if (f.whatsapp.replace(/\D/g, '').length < 8) return { campo: 'whatsapp', mensaje: 'Dejanos un WhatsApp válido.' };
  return null;
}

function armarMensaje(f: FormState): string {
  return [
    'Hola Lupa, les escribo desde la web.',
    `Nombre: ${f.nombre.trim()}`,
    f.empresa.trim() && `Empresa: ${f.empresa.trim()}`,
    f.rubro.trim() && `Rubro: ${f.rubro.trim()}`,
    `Necesito: ${f.necesidad}`,
    `WhatsApp: ${f.whatsapp.trim()}`,
    f.mensaje.trim() && `Mensaje: ${f.mensaje.trim()}`,
  ]
    .filter(Boolean)
    .join('\n');
}

const labelClasses = 'flex flex-col gap-[7px] text-[13px] font-medium text-list';

/**
 * Guarda la consulta en la bandeja del panel (sin esperar la respuesta) y abre WhatsApp con el mensaje armado.
 * Si la persona no termina de mandar el WhatsApp, la consulta igual nos queda.
 */
function guardarConsulta(f: FormState, trampa: string, desde: number) {
  try {
    fetch('/api/consultas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // keepalive: el envío sigue aunque el navegador cambie de pestaña al abrir WhatsApp.
      keepalive: true,
      body: JSON.stringify({
        nombre: f.nombre.trim(),
        empresa: f.empresa.trim(),
        rubro: f.rubro.trim(),
        whatsapp: f.whatsapp.trim(),
        necesidad: f.necesidad,
        mensaje: f.mensaje.trim(),
        pagina: window.location.pathname,
        website: trampa,
        t: desde ? Date.now() - desde : undefined,
      }),
    }).catch(() => {});
  } catch {
    // Si falla, la consulta sigue por WhatsApp.
  }
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(vacio);
  const [error, setError] = useState<{ campo: Campo; mensaje: string } | null>(null);
  const [trampa, setTrampa] = useState('');
  const abierto = useRef(0);

  useEffect(() => {
    abierto.current = Date.now();
  }, []);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    setForm((s) => ({ ...s, [k]: v }));
    setError(null);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = validar(form);
    if (err) {
      setError(err);
      const el = e.currentTarget.querySelector<HTMLElement>(`[data-campo="${err.campo}"]`);
      el?.focus();
      return;
    }
    trackEvent('submit_form', { necesidad: form.necesidad });
    trackEvent('click_whatsapp', { origen: 'formulario' });
    guardarConsulta(form, trampa, abierto.current);
    window.open(buildWhatsAppUrl(armarMensaje(form)), '_blank', 'noopener');
  };

  const invalid = (c: Campo) => (error?.campo === c ? true : undefined);

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Formulario de contacto"
      className="relative flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-[clamp(22px,3vw,32px)]"
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3.5">
        <label className={labelClasses}>
          Nombre *
          <Input
            name="nombre"
            data-campo="nombre"
            value={form.nombre}
            onChange={set('nombre')}
            autoComplete="name"
            required
            aria-invalid={invalid('nombre')}
            aria-describedby={invalid('nombre') && 'form-error'}
          />
        </label>
        <label className={labelClasses}>
          Empresa
          <Input name="empresa" value={form.empresa} onChange={set('empresa')} autoComplete="organization" />
        </label>
        <label className={labelClasses}>
          Rubro
          <Input name="rubro" value={form.rubro} onChange={set('rubro')} />
        </label>
        <label className={labelClasses}>
          WhatsApp *
          <Input
            type="tel"
            name="whatsapp"
            data-campo="whatsapp"
            inputMode="tel"
            value={form.whatsapp}
            onChange={set('whatsapp')}
            autoComplete="tel"
            required
            aria-invalid={invalid('whatsapp')}
            aria-describedby={invalid('whatsapp') && 'form-error'}
          />
        </label>
      </div>

      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
        <legend className="mb-2.5 p-0 text-[13px] font-medium text-list">¿Qué necesitás? *</legend>
        <div className="flex flex-wrap gap-2">
          {necesidades.map((label, i) => {
            const selected = form.necesidad === label;
            return (
              <button
                key={label}
                type="button"
                data-campo={i === 0 ? 'necesidad' : undefined}
                aria-pressed={selected}
                onClick={() => {
                  setForm((s) => ({ ...s, necesidad: label }));
                  setError(null);
                }}
                className={cn(
                  'cursor-pointer rounded-full border px-3.5 py-[9px] text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal',
                  selected
                    ? 'border-teal bg-teal/[0.14] text-title'
                    : 'border-line-strong bg-transparent text-body hover:border-teal/60 hover:text-title',
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Campo trampa para robots: oculto para las personas y para los lectores de pantalla. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Sitio web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trampa} onChange={(e) => setTrampa(e.target.value)} />
        </label>
      </div>

      <label className={labelClasses}>
        Mensaje (opcional)
        <Textarea name="mensaje" rows={3} value={form.mensaje} onChange={set('mensaje')} />
      </label>

      {error && (
        <p id="form-error" role="alert" className="m-0 text-sm text-danger">
          {error.mensaje}
        </p>
      )}

      <button type="submit" className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'w-full p-[15px]')}>
        Enviar por WhatsApp
      </button>
      <p className="m-0 text-[12.5px] text-muted">
        Guardamos tus datos solo para responderte. <Link href="/privacidad">Política de privacidad</Link>
      </p>
    </form>
  );
}
