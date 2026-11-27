import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Clientes de Supabase. Solo se usan en el servidor: el navegador nunca habla
 * directo con Supabase (las imágenes se suben a través de /api/upload).
 *
 * - publicClient: clave "publishable" (o la "anon" de los proyectos viejos).
 *   Por las reglas de la base, solo puede leer artículos publicados.
 * - adminClient: clave "secret" (o "service_role"). Lee y escribe todo; solo
 *   se usa detrás del login del panel.
 */

const url = process.env.SUPABASE_URL;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;

const options = { auth: { persistSession: false, autoRefreshToken: false } } as const;

/**
 * Nombres en Supabase. Llevan el prefijo "lupa" para poder compartir el proyecto
 * con otros sitios (por ejemplo, el blog de Iron Tower) sin pisar sus tablas ni sus imágenes.
 */
export const TABLES = {
  posts: 'lupa_posts',
  templates: 'lupa_post_templates',
  usuarios: 'lupa_usuarios',
  consultas: 'lupa_consultas',
} as const;
export const BUCKET = 'lupa-blog-images';

/** true si el blog está conectado a Supabase. Sin esto, el blog se muestra vacío en vez de romper el build. */
export function isBlogConfigured(): boolean {
  return Boolean(url && publishableKey);
}

/** Etiqueta de caché de todas las lecturas públicas: al guardar desde el panel se invalida (ver revalidate.ts). */
export const BLOG_CACHE_TAG = 'blog';

/** Las lecturas públicas quedan en la caché de Next con la etiqueta del blog, como respaldo por 1 hora. */
const taggedFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, next: { tags: [BLOG_CACHE_TAG], revalidate: 3600 } });

export function publicClient(): SupabaseClient | null {
  if (!url || !publishableKey) return null;
  return createClient(url, publishableKey, { ...options, global: { fetch: taggedFetch } });
}

export function adminClient(): SupabaseClient {
  if (!url || !secretKey) {
    throw new Error('Faltan SUPABASE_URL o SUPABASE_SECRET_KEY en las variables de entorno.');
  }
  // El panel siempre lee datos frescos (sin caché).
  return createClient(url, secretKey, {
    ...options,
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
  });
}
