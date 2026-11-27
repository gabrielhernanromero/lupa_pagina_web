'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';

import { BlogImage } from '@/components/blog/blog-image';
import { cn } from '@/lib/utils';
import { toast } from './ui';
import { uploadImage } from './upload-image';

interface ImageFieldProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  className?: string;
  /** Reemplaza la vista previa (por ejemplo, el selector de encuadre de la portada). */
  renderPreview?: (url: string) => React.ReactNode;
}

/** Un lugar para una imagen: subir, ver, cambiar o quitar. */
export function ImageField({ value, onChange, label, hint, className = 'aspect-[16/9]', renderPreview }: ImageFieldProps) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImage(file));
    } catch (e) {
      toast(e instanceof Error ? e.message : 'No se pudo subir la imagen.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-[13px] font-medium text-body">{label}</span>}
      {value ? (
        renderPreview ? (
          renderPreview(value)
        ) : (
          <div className={cn('relative overflow-hidden rounded-[10px] border border-line bg-surface-2', className)}>
            <BlogImage src={value} alt="" fill sizes="400px" className="object-cover" />
          </div>
        )
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            pick(e.dataTransfer.files[0]);
          }}
          disabled={busy}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-white/[0.14] bg-surface-2/60 text-[13px] text-muted transition-colors hover:border-teal/50 hover:text-title',
            className,
          )}
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-5 w-5" aria-hidden="true" />}
          {busy ? 'Subiendo…' : 'Subir imagen (o arrastrala acá)'}
        </button>
      )}
      {value && (
        <div className="flex gap-1">
          <button type="button" onClick={() => input.current?.click()} disabled={busy} className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-[12px] font-medium text-body hover:bg-white/[0.05] hover:text-title">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />}
            {busy ? 'Subiendo…' : 'Cambiar'}
          </button>
          <button type="button" onClick={() => onChange('')} disabled={busy} className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-[12px] font-medium text-body hover:bg-danger/10 hover:text-danger">
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Quitar
          </button>
        </div>
      )}
      {hint && <p className="m-0 text-[12px] text-muted">{hint}</p>}
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}
