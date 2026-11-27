import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { BlogImage } from '@/components/blog/blog-image';
import { cn } from '@/lib/utils';

export interface ArticleAuthor {
  name: string;
  role?: string | null;
  url?: string | null;
}

export interface ArticleMeta {
  title?: string;
  tags?: string[];
  date?: string;
  readMinutes?: number;
  author?: ArticleAuthor | null;
}

interface ArticleHeaderProps extends ArticleMeta {
  lead?: string | null;
  image?: string | null;
  focalX?: number;
  focalY?: number;
  overlay?: boolean;
  /** En la vista previa del panel, el link "Blog" no navega. */
  preview?: boolean;
}

/** Encabezado de un artículo: volver, fecha, etiquetas, título, bajada e imagen de portada. */
export function ArticleHeader({
  title,
  tags = [],
  date,
  readMinutes,
  author,
  lead,
  image,
  focalX = 50,
  focalY = 50,
  overlay = false,
  preview = false,
}: ArticleHeaderProps) {
  const back = (
    <>
      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
      Blog
    </>
  );
  return (
    <header className="px-6 pt-[clamp(40px,6vw,72px)]">
      <div className="mx-auto flex max-w-[760px] flex-col gap-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
          {preview ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-teal">{back}</span>
          ) : (
            <Link href="/blog" className="inline-flex items-center gap-1.5 font-semibold text-teal hover:text-sky">
              {back}
            </Link>
          )}
          {date && (
            <>
              <span aria-hidden="true">·</span>
              <span>{date}</span>
            </>
          )}
          {readMinutes ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{readMinutes} min de lectura</span>
            </>
          ) : null}
        </div>

        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Etiquetas">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-teal/25 bg-teal/[0.06] px-3 py-1 text-xs font-medium text-teal"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <h1 className="m-0 text-balance font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.1] tracking-[-0.02em] text-title">
          {title || 'Título del artículo'}
        </h1>

        {lead && <p className="m-0 text-[clamp(17px,2vw,20px)] leading-[1.6] text-body">{lead}</p>}

        {author && (
          <p className="m-0 flex flex-wrap items-center gap-x-2 text-[14px] text-muted">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-diag font-display text-[13px] font-bold text-ink"
            >
              {author.name.charAt(0)}
            </span>
            <span>
              Por{' '}
              {author.url && !preview ? (
                <a href={author.url} target="_blank" rel="author noopener noreferrer" className="font-semibold text-title hover:text-teal">
                  {author.name}
                </a>
              ) : (
                <span className="font-semibold text-title">{author.name}</span>
              )}
              {author.role && <span> · {author.role}</span>}
            </span>
          </p>
        )}
      </div>

      {image && (
        <div className="mx-auto mt-[clamp(32px,5vw,48px)] max-w-[1040px]">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] border border-line bg-surface shadow-mock">
            <BlogImage
              src={image}
              alt={title ?? ''}
              fill
              priority={!preview}
              sizes="(max-width: 1088px) 100vw, 1040px"
              className="object-cover"
              style={{ objectPosition: `${focalX}% ${focalY}%` }}
            />
            <div
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute inset-0',
                overlay && 'bg-[linear-gradient(180deg,rgba(6,10,19,0)_55%,rgba(6,10,19,0.55)_100%)]',
              )}
            />
          </div>
        </div>
      )}
    </header>
  );
}
