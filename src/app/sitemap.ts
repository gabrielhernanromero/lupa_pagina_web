import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { getPublishedSlugs } from '@/lib/blog/queries';

/** Se regenera al publicar desde el panel; esto es solo un respaldo. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getPublishedSlugs();
  const lastPost = posts.reduce<Date | undefined>((latest, p) => {
    const d = new Date(p.updated_at);
    return !latest || d > latest ? d : latest;
  }, undefined);

  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: 'monthly', priority: 1 },
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
