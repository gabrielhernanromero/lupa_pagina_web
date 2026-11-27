'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Trash2 } from 'lucide-react';

import { BLOCK_META, type TemplateStructure } from '@/lib/blog/blocks';
import { PRESETS } from '@/lib/blog/presets';
import type { PostTemplate } from '@/lib/blog/types';
import { cn } from '@/lib/utils';
import { apiErrorMessage, toast, ui } from './ui';

/** Esquema visual de una plantilla: una barra por fila, una caja por columna. */
function StructurePreview({ structure }: { structure: TemplateStructure }) {
  return (
    <div className="flex flex-col gap-1" aria-hidden="true">
      {structure.rows.map((row) => (
        <div key={row.id} className="flex gap-1">
          {row.columns.map((col) => {
            const Icon = BLOCK_META[col.block.type].icon;
            return (
              <div
                key={col.id}
                title={BLOCK_META[col.block.type].label}
                className="flex h-7 items-center justify-center rounded-[5px] border border-teal/20 bg-teal/[0.07]"
                style={{ flex: col.span }}
              >
                <Icon className="h-3.5 w-3.5 text-teal" />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function TemplatesManager({ initial }: { initial: PostTemplate[] }) {
  const [templates, setTemplates] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);

  const remove = async (tpl: PostTemplate) => {
    if (!window.confirm(`¿Eliminar la plantilla "${tpl.name}"? Los artículos que la usaron no cambian.`)) return;
    setDeleting(tpl.id);
    const res = await fetch(`/api/templates/${tpl.id}`, { method: 'DELETE' });
    setDeleting(null);
    if (!res.ok) return toast(await apiErrorMessage(res), 'error');
    setTemplates((list) => list.filter((t) => t.id !== tpl.id));
    toast('Plantilla eliminada.');
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="m-0 font-display text-2xl font-bold text-title">Plantillas</h1>
        <p className="m-0 mt-1 max-w-[640px] text-sm text-muted">
          Estructuras de bloques para arrancar un artículo rápido. Las prediseñadas están siempre disponibles; las tuyas se
          guardan desde el editor con &quot;Guardar como plantilla&quot;.
        </p>
      </div>

      <section aria-labelledby="mis-plantillas" className="flex flex-col gap-4">
        <h2 id="mis-plantillas" className="m-0 font-display text-lg font-semibold text-title">
          Mis plantillas ({templates.length})
        </h2>
        {templates.length === 0 ? (
          <p className={cn(ui.card, 'm-0 px-5 py-8 text-center text-sm text-muted')}>
            Todavía no guardaste ninguna. Armá un artículo con bloques y tocá &quot;Guardar como plantilla&quot;.
          </p>
        ) : (
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 p-0">
            {templates.map((tpl) => (
              <li key={tpl.id} className={cn(ui.card, 'flex flex-col gap-4 p-4')}>
                <div>
                  <p className="m-0 font-semibold text-title">{tpl.name}</p>
                  <p className="m-0 text-[12px] text-muted">{tpl.structure.rows.length} filas</p>
                </div>
                <StructurePreview structure={tpl.structure} />
                <div className="mt-auto flex gap-2">
                  <Link href={`/admin/articulos/nuevo?plantilla=${tpl.id}`} className={cn(ui.btnOutline, 'flex-1 py-2 text-[13px]')}>
                    Usar
                  </Link>
                  <button type="button" onClick={() => remove(tpl)} disabled={deleting === tpl.id} aria-label={`Eliminar ${tpl.name}`} className={cn(ui.btnDanger, 'px-3 py-2')}>
                    {deleting === tpl.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="prediseñadas" className="flex flex-col gap-4">
        <h2 id="prediseñadas" className="m-0 font-display text-lg font-semibold text-title">
          Prediseñadas
        </h2>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 p-0">
          {PRESETS.map((p) => (
            <li key={p.id} className={cn(ui.card, 'flex flex-col gap-4 p-4')}>
              <div>
                <p className="m-0 font-semibold text-title">{p.name}</p>
                <p className="m-0 mt-0.5 text-[12px] leading-[1.5] text-muted">{p.description}</p>
              </div>
              <StructurePreview structure={p.structure} />
              <Link href={`/admin/articulos/nuevo?plantilla=${p.id}`} className={cn(ui.btnOutline, 'mt-auto py-2 text-[13px]')}>
                Usar en un artículo nuevo
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
