import { Quote } from 'lucide-react';

import { BlogImage } from '@/components/blog/blog-image';
import type {
  GalleryConfig,
  GalleryContent,
  ProjectSheetContent,
  StatsContent,
  TestimonialContent,
  TextContent,
  TextImageConfig,
  TextImageContent,
  VideoConfig,
  VideoContent,
} from '@/lib/blog/blocks';
import { cn } from '@/lib/utils';

/** Bloques sin interacción. El HTML ya viene limpio desde la API (ver lib/blog/sanitize.ts). */

export const PROSE = 'prose prose-lupa max-w-none md:prose-lg';
/** Igual que PROSE pero sin agrandar la letra (para textos al lado de una imagen). */
const PROSE_BASE = 'prose prose-lupa max-w-none';

export function TextBlock({ content }: { content: TextContent }) {
  if (!content.html) return null;
  return <div className={PROSE} dangerouslySetInnerHTML={{ __html: content.html }} />;
}

export function TextImageBlock({ content, config }: { content: TextImageContent; config: TextImageConfig }) {
  const imageLeft = config.imagePosition === 'left';
  if (!content.html && !content.image) return null;
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      {content.html && (
        <div
          className={cn(PROSE_BASE, imageLeft && 'md:order-2')}
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      )}
      {content.image && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] border border-line bg-surface">
          <BlogImage
            src={content.image}
            alt={content.imageAlt ?? ''}
            fill
            sizes="(max-width: 768px) 100vw, 520px"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}

export function GalleryBlock({ content, config }: { content: GalleryContent; config: GalleryConfig }) {
  const images = content.images ?? [];
  if (!images.length) return null;
  return (
    <div className={cn('grid grid-cols-2 gap-3', config.columns !== 2 && 'md:grid-cols-3')}>
      {images.map((src, i) => (
        <div key={`${src}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-line bg-surface">
          <BlogImage
            src={src}
            alt={`Imagen ${i + 1} de la galería`}
            fill
            sizes="(max-width: 768px) 50vw, 340px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export function StatsBlock({ content }: { content: StatsContent }) {
  const stats = (content.stats ?? []).filter((s) => s.value || s.label);
  if (!stats.length) return null;
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:gap-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-1.5 rounded-[16px] border border-line bg-surface px-4 py-6 text-center"
        >
          {s.icon && (
            <span className="text-2xl" aria-hidden="true">
              {s.icon}
            </span>
          )}
          <span className="text-gradient font-display text-[clamp(28px,4vw,40px)] font-bold leading-none">{s.value}</span>
          <span className="text-sm leading-[1.4] text-body">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/** YouTube (sin cookies) o Vimeo. Cualquier otro link se ignora. */
export function toEmbedUrl(url: string, autoplay: boolean): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, '');
    let ytId: string | null = null;
    if (host === 'youtu.be') ytId = u.pathname.slice(1);
    else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      ytId = u.searchParams.get('v') ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ?? null;
    }
    if (ytId && /^[\w-]{6,20}$/.test(ytId)) {
      const params = new URLSearchParams({ rel: '0', modestbranding: '1' });
      if (autoplay) {
        params.set('autoplay', '1');
        params.set('mute', '1');
      }
      return `https://www.youtube-nocookie.com/embed/${ytId}?${params}`;
    }
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const vimeoId = u.pathname.split('/').filter(Boolean).pop();
      if (vimeoId && /^\d+$/.test(vimeoId)) {
        const params = new URLSearchParams({ title: '0', byline: '0', portrait: '0', dnt: '1' });
        if (autoplay) {
          params.set('autoplay', '1');
          params.set('muted', '1');
        }
        return `https://player.vimeo.com/video/${vimeoId}?${params}`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function VideoBlock({ content, config }: { content: VideoContent; config: VideoConfig }) {
  const embed = content.url ? toEmbedUrl(content.url, Boolean(config.autoplay)) : null;
  if (!embed) return null;
  return (
    <div className="relative aspect-video overflow-hidden rounded-[16px] border border-line bg-surface">
      <iframe
        src={embed}
        title="Video"
        loading="lazy"
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function TestimonialBlock({ content }: { content: TestimonialContent }) {
  if (!content.quote) return null;
  const detail = [content.role, content.company].filter(Boolean).join(' · ');
  return (
    <figure className="relative m-0 overflow-hidden rounded-[20px] border border-line bg-surface px-7 py-8 md:px-10 md:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.14),transparent_70%)]"
      />
      <Quote className="mb-4 h-8 w-8 text-teal" aria-hidden="true" />
      <blockquote className="m-0 font-display text-[clamp(19px,2.4vw,24px)] font-medium leading-[1.5] text-title">
        {content.quote}
      </blockquote>
      {(content.author || detail) && (
        <figcaption className="mt-6 flex flex-col gap-0.5 text-sm">
          {content.author && <span className="font-semibold text-title">{content.author}</span>}
          {detail && <span className="text-body">{detail}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export function ProjectSheetBlock({ content }: { content: ProjectSheetContent }) {
  const sheet = (content.sheet ?? []).filter((item) => item.key || item.value);
  if (!sheet.length) return null;
  return (
    <div className="overflow-hidden rounded-[16px] border border-line bg-surface">
      <p className="m-0 border-b border-line bg-surface-2 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-teal">
        Ficha del proyecto
      </p>
      <dl className="m-0 divide-y divide-line-soft">
        {sheet.map((item, i) => (
          <div key={i} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:gap-6">
            <dt className="shrink-0 text-sm font-semibold text-title sm:w-40">{item.key}</dt>
            <dd className="m-0 text-sm leading-[1.6] text-body">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
