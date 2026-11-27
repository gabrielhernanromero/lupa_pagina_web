'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';

import { BlogImage } from '@/components/blog/blog-image';
import type { BeforeAfterContent, CarouselConfig, CarouselContent } from '@/lib/blog/blocks';
import { cn } from '@/lib/utils';

export function CarouselBlock({ content, config }: { content: CarouselContent; config: CarouselConfig }) {
  const images = content.images ?? [];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);
  const prev = () => setCurrent((c) => (c - 1 + count) % count);

  useEffect(() => {
    if (!config.autoplay || count <= 1 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(next, Math.max(2000, Number(config.interval) || 4000));
    return () => clearInterval(t);
  }, [config.autoplay, config.interval, count, next, paused]);

  if (!count) return null;
  const fade = config.effect === 'fade';

  return (
    <div
      className="relative aspect-video overflow-hidden rounded-[16px] border border-line bg-surface"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Imágenes"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          aria-hidden={i !== current}
          className="absolute inset-0 transition-[transform,opacity] duration-700 ease-out"
          style={
            fade
              ? { opacity: i === current ? 1 : 0 }
              : { transform: `translateX(${(i - current) * 100}%)` }
          }
        >
          <BlogImage
            src={src}
            alt={`Imagen ${i + 1} de ${count}`}
            fill
            sizes="(max-width: 1088px) 100vw, 1040px"
            className="object-cover"
          />
        </div>
      ))}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Imagen anterior"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink/60 text-title backdrop-blur transition-colors hover:border-teal/60"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Imagen siguiente"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink/60 text-title backdrop-blur transition-colors hover:border-teal/60"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Ir a la imagen ${i + 1}`}
                aria-current={i === current}
                className={cn('h-2 rounded-full transition-all', i === current ? 'w-6 bg-teal' : 'w-2 bg-white/50')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function BeforeAfterBlock({ content }: { content: BeforeAfterContent }) {
  const [pos, setPos] = useState(50);
  if (!content.before || !content.after) return null;
  const labelBefore = content.labelBefore || 'Antes';
  const labelAfter = content.labelAfter || 'Después';

  return (
    <div className="relative aspect-video select-none overflow-hidden rounded-[16px] border border-line bg-surface">
      <BlogImage src={content.after} alt={labelAfter} fill sizes="(max-width: 1088px) 100vw, 1040px" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <BlogImage src={content.before} alt={labelBefore} fill sizes="(max-width: 1088px) 100vw, 1040px" className="object-cover" />
      </div>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-float">
          <MoveHorizontal className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-title backdrop-blur">
        {labelBefore}
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-title backdrop-blur">
        {labelAfter}
      </span>

      {/* Control accesible: se arrastra con el mouse o el dedo, o con las flechas del teclado. */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Comparar ${labelBefore.toLowerCase()} y ${labelAfter.toLowerCase()}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}
