import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

/** Buscadores clásicos y con IA: todos bienvenidos (es parte del trabajo de GEO). */
const bots = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];

export default function robots(): MetadataRoute.Robots {
  // Un bot con grupo propio ignora el grupo "*", por eso cada uno repite el disallow.
  const disallow = ['/admin', '/api'];
  return {
    rules: [{ userAgent: '*', allow: '/', disallow }, ...bots.map((userAgent) => ({ userAgent, allow: '/', disallow }))],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
