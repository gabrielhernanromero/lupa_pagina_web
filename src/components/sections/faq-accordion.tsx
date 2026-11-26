'use client';

import { useId, useState } from 'react';

import type { PreguntaFrecuente } from '@/data/faq';
import { cn } from '@/lib/utils';

/**
 * Acordeón con una sola pregunta abierta a la vez.
 * Las respuestas están siempre en el HTML (se ocultan con CSS), así las leen
 * Google y los buscadores con IA que no ejecutan JavaScript.
 */
export function FaqAccordion({ items }: { items: PreguntaFrecuente[] }) {
  const [open, setOpen] = useState<number>(-1);
  const baseId = useId();

  return (
    <div className="flex flex-col">
      {items.map((f, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <div key={f.q} className="border-b border-line">
            <h3 className="m-0">
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="group flex w-full cursor-pointer items-center justify-between gap-5 bg-transparent py-[22px] text-left focus-visible:outline-none"
              >
                <span className="font-display text-[17px] font-semibold leading-[1.4] text-title group-focus-visible:underline group-focus-visible:decoration-teal group-focus-visible:underline-offset-4">
                  {f.q}
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-strong text-lg leading-none text-teal transition-colors group-hover:border-teal/60"
                >
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              inert={!isOpen}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <p className="m-0 pb-[22px] pr-12 text-[15px] leading-[1.65]">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
