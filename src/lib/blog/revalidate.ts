import 'server-only';

import { revalidatePath, revalidateTag } from 'next/cache';

import { BLOG_CACHE_TAG } from './supabase';

/** Después de guardar, regenera las páginas públicas afectadas en la próxima visita. */
export function revalidateBlog(slugs: (string | null | undefined)[] = []) {
  // Datos: la próxima lectura va directo a Supabase (sin mostrar la versión vieja).
  revalidateTag(BLOG_CACHE_TAG, { expire: 0 });
  // Páginas: se regeneran en la próxima visita.
  revalidatePath('/blog');
  for (const slug of new Set(slugs.filter(Boolean))) revalidatePath(`/blog/${slug}`);
  revalidatePath('/llms.txt');
}
