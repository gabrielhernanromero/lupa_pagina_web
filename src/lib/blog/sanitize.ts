import 'server-only';

import sanitizeHtml from 'sanitize-html';

/**
 * Limpia el HTML de los artículos antes de guardarlo: deja solo el formato del
 * editor (títulos, listas, links, imágenes…) y saca scripts, estilos y eventos.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h2', 'h3', 'h4', 'p', 'br', 'hr',
    'strong', 'b', 'em', 'i', 'u', 's', 'code', 'pre', 'mark',
    'a', 'ul', 'ol', 'li', 'blockquote', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    th: ['colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
  },
  allowedSchemes: ['https', 'http', 'mailto', 'tel'],
  // En desarrollo local Supabase puede ser http; en producción siempre es https.
  allowedSchemesByTag: { img: process.env.SUPABASE_URL?.startsWith('http://') ? ['https', 'http'] : ['https'] },
  allowProtocolRelative: false,
  transformTags: {
    // h1 queda reservado para el título del artículo.
    h1: 'h2',
    a: (tagName, attribs) => {
      const href = attribs.href ?? '';
      const own = /^https?:\/\/(www\.)?lupaserviciosdigitales\.com/i.test(href);
      const external = /^https?:\/\//i.test(href) && !own;
      const out: sanitizeHtml.Attributes = { href };
      if (external) {
        out.target = '_blank';
        out.rel = 'noopener noreferrer';
      }
      return { tagName, attribs: out };
    },
  },
};

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS).trim();
}
