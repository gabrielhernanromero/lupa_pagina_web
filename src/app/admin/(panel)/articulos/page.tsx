import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, FileText, Plus } from 'lucide-react';

import { ui } from '@/components/admin/styles';
import { BlogImage } from '@/components/blog/blog-image';
import { requireAdmin } from '@/lib/admin-guard';
import { listAllPosts } from '@/lib/blog/admin-queries';
import { formatPostDate } from '@/lib/blog/format';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Artículos' };

export default async function PostsPage() {
  await requireAdmin();
  const { posts, error } = await listAllPosts();
  const publishedCount = posts.filter((p) => p.published).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="m-0 font-display text-2xl font-bold text-title">Artículos</h1>
          <p className="m-0 mt-1 text-sm text-muted">
            {posts.length} en total · {publishedCount} publicados · {posts.length - publishedCount} borradores
          </p>
        </div>
        <Link href="/admin/articulos/nuevo" className={ui.btnPrimary}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo artículo
        </Link>
      </div>

      {error && (
        <p role="alert" className="m-0 rounded-[12px] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {posts.length === 0 ? (
        <div className={cn(ui.card, 'flex flex-col items-center gap-3 px-6 py-16 text-center')}>
          <FileText className="h-8 w-8 text-teal" aria-hidden="true" />
          <p className="m-0 font-display text-lg font-semibold text-title">Todavía no hay artículos</p>
          <p className="m-0 max-w-[420px] text-sm">
            Escribí el primero a mano o con ayuda de la IA. Podés guardarlo como borrador y publicarlo cuando quieras.
          </p>
          <Link href="/admin/articulos/nuevo" className={cn(ui.btnPrimary, 'mt-2')}>
            Escribir el primer artículo
          </Link>
        </div>
      ) : (
        <ul className={cn(ui.card, 'm-0 list-none divide-y divide-line overflow-hidden p-0')}>
          {posts.map((post) => (
            <li key={post.id} className="relative flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/[0.02]">
              <div className="relative hidden h-14 w-24 shrink-0 overflow-hidden rounded-[8px] border border-line bg-surface-2 sm:block">
                {post.cover_image && <BlogImage src={post.cover_image} alt="" fill sizes="96px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/articulos/${post.id}`}
                  className="block truncate font-medium text-title after:absolute after:inset-0 after:content-[''] hover:text-teal"
                >
                  {post.title}
                </Link>
                <p className="m-0 mt-0.5 truncate text-[13px] text-muted">
                  /blog/{post.slug}
                  {post.tags.length > 0 && ` · ${post.tags.join(', ')}`}
                </p>
              </div>
              <div className="hidden shrink-0 text-right text-[12px] text-muted md:block">
                <p className="m-0">Editado el {formatPostDate(post.updated_at)}</p>
                {post.published_at && <p className="m-0">Publicado el {formatPostDate(post.published_at)}</p>}
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold',
                  post.published ? 'bg-teal/15 text-teal' : 'bg-white/[0.06] text-body',
                )}
              >
                {post.published ? 'Publicado' : 'Borrador'}
              </span>
              {post.published && (
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Ver "${post.title}" en el blog`}
                  className="relative z-10 shrink-0 rounded-[8px] p-2 text-muted hover:bg-white/[0.05] hover:text-title"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
