import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleHeader } from '@/components/blog/article-header';
import { BlogCta } from '@/components/blog/blog-cta';
import { PostCard } from '@/components/blog/post-card';
import { ReadingProgress } from '@/components/blog/reading-progress';
import { BlockRenderer } from '@/components/blog/renderer/block-renderer';
import { PROSE } from '@/components/blog/renderer/static-blocks';
import { ShareLinks } from '@/components/blog/share-links';
import { siteConfig } from '@/config/site';
import { splitSavedBlocks } from '@/lib/blog/blocks';
import { formatPostDate, postPlainText, readingMinutes } from '@/lib/blog/format';
import { getPublishedPost, getPublishedSlugs, getRelatedPosts } from '@/lib/blog/queries';
import { serializeJsonLd } from '@/lib/jsonld';

/** Se regenera al guardar desde el panel; esto es solo un respaldo. */
export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

// Una sola consulta por pedido, aunque la usen la metadata y la página.
const getPost = cache(getPublishedPost);

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: 'Artículo no encontrado', robots: { index: false } };
  const description = post.excerpt || postPlainText(post).slice(0, 155);
  const url = `${siteConfig.url}/blog/${post.slug}`;
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description,
      siteName: siteConfig.name,
      locale: 'es_AR',
      publishedTime: post.published_at ?? post.created_at,
      modifiedTime: post.updated_at,
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: post.title, description },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const publishedIso = post.published_at ?? post.created_at;
  const meta = {
    title: post.title,
    tags: post.tags,
    date: formatPostDate(publishedIso),
    readMinutes: readingMinutes(postPlainText(post)),
    lead: post.excerpt,
  };
  const { structure, blocks } = splitSavedBlocks(post.blocks);

  const orgId = `${siteConfig.url}/#organizacion`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#articulo`,
        headline: post.title,
        description: post.excerpt ?? undefined,
        url,
        mainEntityOfPage: url,
        image: post.cover_image ?? `${url}/opengraph-image`,
        datePublished: publishedIso,
        dateModified: post.updated_at,
        inLanguage: siteConfig.locale,
        keywords: post.tags.join(', ') || undefined,
        author: { '@id': orgId },
        publisher: { '@id': orgId },
        isPartOf: { '@id': `${siteConfig.url}/blog#blog` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteConfig.url },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <ReadingProgress slug={post.slug} />

      <article>
        {structure ? (
          <BlockRenderer structure={structure} blocks={blocks} meta={meta} />
        ) : (
          <>
            <ArticleHeader {...meta} image={post.cover_image} />
            {post.content && (
              <div className="px-6 pt-[clamp(32px,5vw,48px)]">
                <div className="mx-auto max-w-[760px]">
                  <div className={PROSE} dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              </div>
            )}
          </>
        )}

        <footer className="px-6 pt-12">
          <div className="mx-auto flex max-w-[760px] flex-col gap-10 border-t border-line pt-8">
            <ShareLinks url={url} title={post.title} slug={post.slug} />
            <BlogCta title={post.title} />
          </div>
        </footer>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="px-6 pb-[clamp(72px,9vw,112px)] pt-[clamp(56px,8vw,88px)]">
          <div className="mx-auto flex max-w-site flex-col gap-8">
            <h2 id="relacionados" className="m-0 font-display text-[clamp(24px,3vw,32px)] font-bold text-title">
              Seguí leyendo
            </h2>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-6">
              {related.map((p) => (
                <li key={p.id} className="list-none">
                  <PostCard post={p} headingLevel="h3" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      {related.length === 0 && <div className="pb-[clamp(72px,9vw,112px)]" />}
    </>
  );
}
