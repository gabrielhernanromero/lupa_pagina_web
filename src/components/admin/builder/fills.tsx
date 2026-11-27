'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react';

import { BlogImage } from '@/components/blog/blog-image';
import type {
  BeforeAfterContent,
  BlockContent,
  BlockType,
  CarouselContent,
  GalleryContent,
  HeroContent,
  ProjectSheetContent,
  SheetItem,
  StatItem,
  StatsContent,
  TestimonialContent,
  TextContent,
  TextImageContent,
  VideoContent,
} from '@/lib/blog/blocks';
import { toEmbedUrl } from '@/components/blog/renderer/static-blocks';
import { cn } from '@/lib/utils';
import { ImageField } from '../image-field';
import { toast, ui } from '../ui';
import { uploadImage } from '../upload-image';

const RichTextEditor = dynamic(() => import('../rich-text-editor'), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded-[12px] bg-surface-2" />,
});

/** Formularios para cargar el contenido de cada tipo de bloque. */

interface FillProps<T> {
  content: T;
  onChange: (c: T) => void;
}

// ---- Portada con selector de encuadre ----

function FocalPicker({ src, x, y, onChange }: { src: string; x: number; y: number; onChange: (x: number, y: number) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (e: React.PointerEvent) => {
    const rect = box.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
    const ny = Math.round(Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)));
    onChange(nx, ny);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div
        ref={box}
        className="relative aspect-[16/9] cursor-crosshair touch-none select-none overflow-hidden rounded-[10px] border border-line"
        style={{ backgroundImage: `url("${src}")`, backgroundSize: 'cover', backgroundPosition: `${x}% ${y}%` }}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          update(e);
        }}
        onPointerMove={(e) => dragging.current && update(e)}
        onPointerUp={() => (dragging.current = false)}
      >
        <div className="pointer-events-none absolute inset-y-0 w-px bg-white/50" style={{ left: `${x}%` }} />
        <div className="pointer-events-none absolute inset-x-0 h-px bg-white/50" style={{ top: `${y}%` }} />
        <div
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-teal shadow-float"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      </div>
      <p className="m-0 text-[12px] text-muted">Tocá o arrastrá el punto para elegir qué parte de la foto queda siempre visible.</p>
    </div>
  );
}

function HeroFill({ content, onChange }: FillProps<HeroContent>) {
  return (
    <div className="flex flex-col gap-3">
      <ImageField
        value={content.image}
        onChange={(image) => onChange({ ...content, image })}
        hint="Ideal: 1600 × 900 px o más."
        renderPreview={(src) => (
          <FocalPicker
            src={src}
            x={content.focalX ?? 50}
            y={content.focalY ?? 50}
            onChange={(focalX, focalY) => onChange({ ...content, focalX, focalY })}
          />
        )}
      />
      <input
        className={ui.inputSm}
        placeholder="Bajada (opcional; si no, se usa el resumen)"
        value={content.subtitle ?? ''}
        maxLength={300}
        onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
      />
      <p className="m-0 text-[12px] text-muted">El título de la portada es el título del artículo.</p>
    </div>
  );
}

function TextFill({ content, onChange }: FillProps<TextContent>) {
  return <RichTextEditor content={content.html ?? ''} onChange={(html) => onChange({ html })} minHeight={200} />;
}

function TextImageFill({ content, onChange }: FillProps<TextImageContent>) {
  return (
    <div className="flex flex-col gap-3">
      <RichTextEditor content={content.html ?? ''} onChange={(html) => onChange({ ...content, html })} minHeight={160} compact />
      <ImageField value={content.image} onChange={(image) => onChange({ ...content, image })} className="aspect-[4/3]" />
      <input
        className={ui.inputSm}
        placeholder="Descripción de la imagen (para Google y lectores de pantalla)"
        value={content.imageAlt ?? ''}
        maxLength={200}
        onChange={(e) => onChange({ ...content, imageAlt: e.target.value })}
      />
    </div>
  );
}

function ImagesFill({ content, onChange }: FillProps<GalleryContent | CarouselContent>) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const images = content.images ?? [];

  const add = async (files: FileList) => {
    const list = Array.from(files);
    setBusy(list.length);
    const urls: string[] = [];
    for (const file of list) {
      try {
        urls.push(await uploadImage(file));
      } catch (e) {
        toast(e instanceof Error ? e.message : 'No se pudo subir una imagen.', 'error');
      }
      setBusy((n) => n - 1);
    }
    onChange({ images: [...images, ...urls] });
  };

  const move = (i: number, d: -1 | 1) => {
    const next = [...images];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange({ images: next });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="group relative aspect-[4/3] overflow-hidden rounded-[8px] border border-line">
            <BlogImage src={src} alt="" fill sizes="120px" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/75 p-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
              <div className="flex">
                <button type="button" aria-label="Mover antes" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 text-title disabled:opacity-30">
                  <ArrowUp className="h-3.5 w-3.5 -rotate-90" />
                </button>
                <button type="button" aria-label="Mover después" disabled={i === images.length - 1} onClick={() => move(i, 1)} className="rounded p-1 text-title disabled:opacity-30">
                  <ArrowDown className="h-3.5 w-3.5 -rotate-90" />
                </button>
              </div>
              <button type="button" aria-label="Quitar imagen" onClick={() => onChange({ images: images.filter((_, j) => j !== i) })} className="rounded p-1 text-danger">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy > 0}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-[8px] border-2 border-dashed border-white/[0.14] text-[12px] text-muted hover:border-teal/50 hover:text-title"
        >
          {busy > 0 ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {busy > 0 ? `Subiendo ${busy}…` : 'Agregar'}
        </button>
      </div>
      <p className="m-0 text-[12px] text-muted">Podés elegir varias imágenes a la vez.</p>
      <input
        ref={input}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) add(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}

function VideoFill({ content, onChange }: FillProps<VideoContent>) {
  const valid = !content.url || toEmbedUrl(content.url, false) !== null;
  return (
    <div className="flex flex-col gap-1.5">
      <input
        type="url"
        className={cn(ui.inputSm, !valid && 'border-danger/60')}
        placeholder="https://www.youtube.com/watch?v=…  o  https://vimeo.com/…"
        value={content.url ?? ''}
        onChange={(e) => onChange({ url: e.target.value.trim() })}
      />
      <p className={cn('m-0 text-[12px]', valid ? 'text-muted' : 'text-danger')}>
        {valid ? 'Link de YouTube (incluye Shorts) o Vimeo.' : 'Ese link no es de YouTube ni de Vimeo.'}
      </p>
    </div>
  );
}

function ListEditor<T extends object>({
  items,
  empty,
  fields,
  onChange,
  addLabel,
  max,
}: {
  items: T[];
  empty: T;
  fields: { key: keyof T; placeholder: string; className: string; maxLength: number }[];
  onChange: (items: T[]) => void;
  addLabel: string;
  max: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {fields.map((f) => (
            <input
              key={String(f.key)}
              className={cn(ui.inputSm, f.className)}
              placeholder={f.placeholder}
              maxLength={f.maxLength}
              value={String(item[f.key] ?? '')}
              onChange={(e) => onChange(items.map((it, j) => (j === i ? { ...it, [f.key]: e.target.value } : it)))}
            />
          ))}
          <button type="button" aria-label="Quitar fila" onClick={() => onChange(items.filter((_, j) => j !== i))} className="shrink-0 rounded p-1.5 text-muted hover:text-danger">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, { ...empty }])} className={cn(ui.btnGhost, 'w-fit text-teal')}>
          <Plus className="h-3.5 w-3.5" /> {addLabel}
        </button>
      )}
    </div>
  );
}

const EMPTY_STAT: StatItem = { icon: '', value: '', label: '' };

function StatsFill({ content, onChange }: FillProps<StatsContent>) {
  const stats = content.stats?.length ? content.stats : [EMPTY_STAT, EMPTY_STAT, EMPTY_STAT];
  return (
    <ListEditor
      items={stats}
      empty={EMPTY_STAT}
      max={12}
      addLabel="Agregar dato"
      onChange={(next) => onChange({ stats: next })}
      fields={[
        { key: 'icon', placeholder: '📈', className: 'w-12 shrink-0 text-center', maxLength: 16 },
        { key: 'value', placeholder: '+120 %', className: 'w-24 shrink-0', maxLength: 40 },
        { key: 'label', placeholder: 'Consultas por mes', className: 'flex-1', maxLength: 120 },
      ]}
    />
  );
}

const SHEET_DEFAULTS: SheetItem[] = [
  { key: 'Cliente', value: '' },
  { key: 'Rubro', value: '' },
  { key: 'Servicios', value: '' },
  { key: 'Plazo', value: '' },
];

function ProjectSheetFill({ content, onChange }: FillProps<ProjectSheetContent>) {
  const sheet = content.sheet?.length ? content.sheet : SHEET_DEFAULTS;
  return (
    <ListEditor
      items={sheet}
      empty={{ key: '', value: '' }}
      max={20}
      addLabel="Agregar fila"
      onChange={(next) => onChange({ sheet: next })}
      fields={[
        { key: 'key', placeholder: 'Dato', className: 'w-28 shrink-0', maxLength: 80 },
        { key: 'value', placeholder: 'Valor', className: 'flex-1', maxLength: 400 },
      ]}
    />
  );
}

function BeforeAfterFill({ content, onChange }: FillProps<BeforeAfterContent>) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <ImageField label="Antes" value={content.before} onChange={(before) => onChange({ ...content, before })} />
        <ImageField label="Después" value={content.after} onChange={(after) => onChange({ ...content, after })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input className={ui.inputSm} placeholder="Etiqueta (Antes)" maxLength={60} value={content.labelBefore ?? ''} onChange={(e) => onChange({ ...content, labelBefore: e.target.value })} />
        <input className={ui.inputSm} placeholder="Etiqueta (Después)" maxLength={60} value={content.labelAfter ?? ''} onChange={(e) => onChange({ ...content, labelAfter: e.target.value })} />
      </div>
      <p className="m-0 text-[12px] text-muted">Usá dos imágenes del mismo tamaño (por ejemplo, dos capturas de la web).</p>
    </div>
  );
}

function TestimonialFill({ content, onChange }: FillProps<TestimonialContent>) {
  return (
    <div className="flex flex-col gap-2">
      <textarea className={cn(ui.inputSm, 'resize-y')} rows={3} maxLength={1500} placeholder="Lo que dijo el cliente…" value={content.quote ?? ''} onChange={(e) => onChange({ ...content, quote: e.target.value })} />
      <div className="grid grid-cols-2 gap-2">
        <input className={ui.inputSm} placeholder="Nombre" maxLength={120} value={content.author ?? ''} onChange={(e) => onChange({ ...content, author: e.target.value })} />
        <input className={ui.inputSm} placeholder="Cargo" maxLength={120} value={content.role ?? ''} onChange={(e) => onChange({ ...content, role: e.target.value })} />
      </div>
      <input className={ui.inputSm} placeholder="Empresa" maxLength={120} value={content.company ?? ''} onChange={(e) => onChange({ ...content, company: e.target.value })} />
    </div>
  );
}

export function BlockFill({ type, content, onChange }: { type: BlockType; content: BlockContent; onChange: (c: BlockContent) => void }) {
  const props = { content: content as never, onChange: onChange as never };
  switch (type) {
    case 'hero':
      return <HeroFill {...props} />;
    case 'text':
      return <TextFill {...props} />;
    case 'text_image':
      return <TextImageFill {...props} />;
    case 'gallery':
    case 'carousel':
      return <ImagesFill {...props} />;
    case 'video':
      return <VideoFill {...props} />;
    case 'stats':
      return <StatsFill {...props} />;
    case 'before_after':
      return <BeforeAfterFill {...props} />;
    case 'testimonial':
      return <TestimonialFill {...props} />;
    case 'project_sheet':
      return <ProjectSheetFill {...props} />;
    default:
      return null;
  }
}
