import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { BlogImage } from '@/components/blog/blog-image';
import { LogoMark } from '@/components/brand/logo';
import { formatPostDate } from '@/lib/blog/format';
import type { PostSummary } from '@/lib/blog/types';

export function PostCard({ post, headingLevel = 'h2' }: { post: PostSummary; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-surface transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-teal/40">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-surface-2">
        {post.cover_image ? (
          <BlogImage
            src={post.cover_image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1160px) 50vw, 370px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.16),transparent_60%),radial-gradient(circle_at_80%_90%,rgba(56,189,248,0.14),transparent_55%)]">
            <LogoMark size={56} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        {post.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Etiquetas">
            {post.tags.slice(0, 2).map((tag) => (
              <li key={tag} className="rounded-full bg-teal/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-teal">
                {tag}
              </li>
            ))}
          </ul>
        )}
        <Heading className="m-0 font-display text-[19px] font-semibold leading-[1.3] text-title">
          {/* El link cubre toda la card. */}
          <Link href={`/blog/${post.slug}`} className="text-title after:absolute after:inset-0 after:content-[''] hover:text-title">
            {post.title}
          </Link>
        </Heading>
        {post.excerpt && <p className="m-0 line-clamp-3 text-[15px] leading-[1.6]">{post.excerpt}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-[13px]">
          <time dateTime={post.published_at ?? post.created_at} className="text-muted">
            {formatPostDate(post.published_at ?? post.created_at)}
          </time>
          <span className="inline-flex items-center gap-1 font-semibold text-teal" aria-hidden="true">
            Leer <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
