'use client';

import { useMemo, useState } from 'react';

import { PostCard } from '@/components/blog/post-card';
import type { PostSummary } from '@/lib/blog/types';
import { cn } from '@/lib/utils';

/** Listado del blog con filtro por etiqueta. */
export function BlogPostsGrid({ posts }: { posts: PostSummary[] }) {
  const [active, setActive] = useState<string | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  }, [posts]);

  const visible = active ? posts.filter((p) => p.tags.includes(active)) : posts;

  const chip = (selected: boolean) =>
    cn(
      'cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition-colors',
      selected ? 'border-transparent bg-brand text-ink' : 'border-line-strong text-body hover:border-teal/50 hover:text-title',
    );

  return (
    <div className="flex flex-col gap-10">
      {tags.length > 1 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tema">
          <button type="button" onClick={() => setActive(null)} aria-pressed={active === null} className={chip(active === null)}>
            Todos
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(active === tag ? null : tag)}
              aria-pressed={active === tag}
              className={chip(active === tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-6" aria-live="polite">
        {visible.map((post) => (
          <li key={post.id} className="list-none">
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
