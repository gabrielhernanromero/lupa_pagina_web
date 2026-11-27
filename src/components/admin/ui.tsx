'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ui } from './styles';

export { ui };

// ---- Avisos (toasts) ----

type ToastKind = 'ok' | 'error';
interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

const EVENT = 'lupa-admin-toast';

/** Muestra un aviso abajo a la derecha. Se puede llamar desde cualquier componente del panel. */
export function toast(message: string, kind: ToastKind = 'ok') {
  window.dispatchEvent(new CustomEvent<Omit<ToastItem, 'id'>>(EVENT, { detail: { message, kind } }));
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    let next = 0;
    const onToast = (e: Event) => {
      const { message, kind } = (e as CustomEvent<Omit<ToastItem, 'id'>>).detail;
      const id = ++next;
      setItems((list) => [...list, { id, message, kind }]);
      setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), kind === 'error' ? 7000 : 3500);
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(380px,calc(100vw-40px))] flex-col gap-2" aria-live="polite">
      {items.map((t) => (
        <div
          key={t.id}
          role={t.kind === 'error' ? 'alert' : 'status'}
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-[12px] border bg-surface-2 px-4 py-3 text-sm shadow-float',
            t.kind === 'error' ? 'border-danger/40 text-danger' : 'border-teal/40 text-title',
          )}
        >
          {t.kind === 'error' ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
          )}
          <span className="flex-1 leading-[1.5]">{t.message}</span>
          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={() => setItems((list) => list.filter((x) => x.id !== t.id))}
            className="text-muted hover:text-title"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}

/** Lee el mensaje de error de una respuesta de la API del panel. */
export async function apiErrorMessage(res: Response, fallback = 'Algo salió mal. Probá de nuevo.'): Promise<string> {
  if (res.status === 401) return 'Tu sesión venció. Volvé a ingresar (abrí /admin/login en otra pestaña para no perder los cambios).';
  try {
    const body = (await res.json()) as { error?: string };
    return body.error || fallback;
  } catch {
    return fallback;
  }
}
