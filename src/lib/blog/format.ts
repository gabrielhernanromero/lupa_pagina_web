import type { BlockContent, SavedBlocksPayload } from './blocks';
import { splitSavedBlocks } from './blocks';

/** "Cómo elegir tu dominio" → "como-elegir-tu-dominio" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
    .replace(/-$/, '');
}

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'America/Argentina/Buenos_Aires',
});

export function formatPostDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return dateFormatter.format(new Date(iso));
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Texto plano del artículo (para tiempo de lectura y resúmenes). */
export function postPlainText(post: { content: string | null; blocks: SavedBlocksPayload | null }): string {
  if (post.content) return stripHtml(post.content);
  const { structure, blocks } = splitSavedBlocks(post.blocks);
  if (!structure) return '';
  const parts: string[] = [];
  for (const row of structure.rows) {
    for (const col of row.columns) {
      const c = (blocks[row.id]?.[col.id] ?? {}) as BlockContent & Record<string, unknown>;
      for (const key of ['html', 'title', 'subtitle', 'quote']) {
        const v = c[key];
        if (typeof v === 'string') parts.push(key === 'html' ? stripHtml(v) : v);
      }
    }
  }
  return parts.join(' ');
}

/** Minutos de lectura a 200 palabras por minuto (mínimo 1). */
export function readingMinutes(text: string): number {
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.round(words / 200));
}
