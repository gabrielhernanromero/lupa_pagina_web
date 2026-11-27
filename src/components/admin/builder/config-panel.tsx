'use client';

import type { BlockType } from '@/lib/blog/blocks';

/** Opciones de diseño de cada bloque (las que se guardan en la plantilla). */

const select =
  'rounded-[6px] border border-white/[0.12] bg-surface-2 px-1.5 py-0.5 text-[12px] text-title focus:border-teal focus:outline-none';

function Check({ checked, label, onChange }: { checked: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] text-body">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-teal" />
      {label}
    </label>
  );
}

export function ConfigPanel({
  type,
  config,
  onChange,
}: {
  type: BlockType;
  config: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) => onChange({ ...config, [key]: value });

  switch (type) {
    case 'hero':
      return <Check checked={config.overlay !== false} label="Oscurecer la parte de abajo de la foto" onChange={(v) => set('overlay', v)} />;
    case 'text_image':
      return (
        <label className="flex items-center gap-2 text-[12px] text-body">
          Imagen a la
          <select className={select} value={String(config.imagePosition ?? 'right')} onChange={(e) => set('imagePosition', e.target.value)}>
            <option value="right">derecha</option>
            <option value="left">izquierda</option>
          </select>
        </label>
      );
    case 'gallery':
      return (
        <label className="flex items-center gap-2 text-[12px] text-body">
          Columnas
          <select className={select} value={Number(config.columns ?? 3)} onChange={(e) => set('columns', Number(e.target.value))}>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </label>
      );
    case 'carousel':
      return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Check checked={config.autoplay !== false} label="Pasar solo" onChange={(v) => set('autoplay', v)} />
          <label className="flex items-center gap-1.5 text-[12px] text-body">
            cada
            <input
              type="number"
              min={2}
              max={10}
              value={Math.round(Number(config.interval ?? 4000) / 1000)}
              onChange={(e) => set('interval', Math.min(10, Math.max(2, Number(e.target.value) || 4)) * 1000)}
              className={`${select} w-12 text-center`}
            />
            s
          </label>
          <label className="flex items-center gap-1.5 text-[12px] text-body">
            Efecto
            <select className={select} value={String(config.effect ?? 'slide')} onChange={(e) => set('effect', e.target.value)}>
              <option value="slide">Deslizar</option>
              <option value="fade">Fundido</option>
            </select>
          </label>
        </div>
      );
    case 'video':
      return <Check checked={config.autoplay === true} label="Reproducir solo (sin sonido)" onChange={(v) => set('autoplay', v)} />;
    default:
      return null;
  }
}
