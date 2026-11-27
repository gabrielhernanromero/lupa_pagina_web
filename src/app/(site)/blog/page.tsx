import type { Metadata } from 'next';

import { BlogCta } from '@/components/blog/blog-cta';
import { BlogPostsGrid } from '@/components/blog/blog-posts-grid';
import { GradientText } from '@/components/section';
import { siteConfig } from '@/config/site';
import { getPublishedPosts } from '@/lib/blog/queries';
import { serializeJsonLd } from '@/lib/jsonld';

/** Se regenera al publicar desde el panel; esto es solo un respaldo. */
export const revalidate = 3600;

const description =
  'Guías prácticas sobre sitios web, Google, redes e inteligencia artificial para pymes de servicios. Escritas por el equipo de Lupa.';

export const metadata: Metadata = {
  title: 'Blog',
  description,
  alternates: { canonical: '/blog' },
  openGraph: { title: `Blog | ${siteConfig.name}`, description, url: `${siteConfig.url}/blog` },
  twitter: { title: `Blog | ${siteConfig.name}`, description },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${siteConfig.url}/blog#blog`,
    name: `Blog de ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}/blog`,
    inLanguage: siteConfig.locale,
    publisher: { '@id': `${siteConfig.url}/#organizacion` },
    blogPost: posts.slice(0, 20).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${siteConfig.url}/blog/${p.slug}`,
      datePublished: p.published_at ?? p.created_at,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

      <section className="relative px-6 pb-[clamp(40px,6vw,64px)] pt-[clamp(56px,8vw,96px)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(720px,100%)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.1),transparent_65%)]"
        />
        <div className="relative mx-auto flex max-w-site flex-col gap-4">
          <p className="m-0 text-[13px] font-semibold uppercase tracking-[0.14em] text-teal">Blog</p>
          <h1 className="m-0 max-w-[760px] text-balance font-display text-[clamp(34px,5vw,56px)] font-bold leading-[1.08] tracking-[-0.02em] text-title">
            Ideas para que a tu pyme <GradientText>la encuentren, la elijan y le escriban.</GradientText>
          </h1>
          <p className="m-0 max-w-[620px] text-[17px] leading-[1.6]">{description}</p>
        </div>
      </section>

      <section aria-label="Artículos" className="px-6 pb-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-site">
          {posts.length > 0 ? (
            <BlogPostsGrid posts={posts} />
          ) : (
            <div className="rounded-[20px] border border-dashed border-line-strong px-6 py-16 text-center">
              <p className="m-0 font-display text-xl font-semibold text-title">Estamos preparando los primeros artículos.</p>
              <p className="mx-auto mt-2 max-w-[440px] text-[15px] leading-[1.6]">
                Mientras tanto, si tenés una duda sobre tu web, Google o tus redes, escribinos y te la respondemos.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 pb-[clamp(72px,9vw,112px)]">
        <BlogCta className="mx-auto max-w-[880px]" />
      </section>
    </>
  );
}
