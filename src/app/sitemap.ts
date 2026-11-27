import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { servicios } from '@/data/servicios';
import { getPublishedSlugs } from '@/lib/blog/queries';

/**
 * Se arma en cada pedido (Google lo pide pocas veces por día), así un artículo nuevo
 * aparece al instante. Guardado como página estática, Vercel no lo refrescaba al publicar.
 */
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getPublishedSlugs();
  const lastPost = posts.reduce<Date | undefined>((latest, p) => {
    const d = new Date(p.updated_at);
    return !latest || d > latest ? d : latest;
  }, undefined);

  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...servicios.map((s) => ({
      url: `${siteConfig.url}/servicios/${s.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    { url: `${siteConfig.url}/blog`, lastModified: lastPost ?? now, changeFrequency: 'weekly', priority: 0.7 },
    ...posts.map((p) => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    { url: `${siteConfig.url}/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
