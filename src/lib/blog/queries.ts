import 'server-only';

import { TABLES, publicClient } from './supabase';
import { POST_SUMMARY_FIELDS, type Post, type PostSummary } from './types';

/**
 * Lecturas públicas del blog (solo artículos publicados).
 * Si Supabase no está configurado o falla, devuelven vacío: la web sigue andando.
 */

function logError(where: string, error: unknown) {
  console.error(`[blog] ${where}:`, error);
}

export async function getPublishedPosts(limit?: number): Promise<PostSummary[]> {
  const db = publicClient();
  if (!db) return [];
  let query = db
    .from(TABLES.posts)
    .select(POST_SUMMARY_FIELDS)
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) {
    logError('getPublishedPosts', error);
    return [];
  }
  return (data ?? []) as PostSummary[];
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const db = publicClient();
  if (!db) return null;
  const { data, error } = await db.from(TABLES.posts).select('*').eq('slug', slug).eq('published', true).maybeSingle();
  if (error) {
    logError('getPublishedPost', error);
    return null;
  }
  return data as Post | null;
}

/** Hasta 3 artículos que comparten alguna etiqueta; si no alcanza, completa con los más nuevos. */
export async function getRelatedPosts(post: Post, limit = 3): Promise<PostSummary[]> {
  const db = publicClient();
  if (!db) return [];
  const related: PostSummary[] = [];
  if (post.tags.length > 0) {
    const { data, error } = await db
      .from(TABLES.posts)
      .select(POST_SUMMARY_FIELDS)
      .eq('published', true)
      .neq('id', post.id)
      .overlaps('tags', post.tags)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(limit);
    if (error) logError('getRelatedPosts', error);
    else related.push(...((data ?? []) as PostSummary[]));
  }
  if (related.length < limit) {
    const exclude = [post.id, ...related.map((p) => p.id)];
    const { data, error } = await db
      .from(TABLES.posts)
      .select(POST_SUMMARY_FIELDS)
      .eq('published', true)
      .not('id', 'in', `(${exclude.join(',')})`)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(limit - related.length);
    if (error) logError('getRelatedPosts (recientes)', error);
    else related.push(...((data ?? []) as PostSummary[]));
  }
  return related;
}

export async function getPublishedSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  const db = publicClient();
  if (!db) return [];
  const { data, error } = await db.from(TABLES.posts).select('slug, updated_at').eq('published', true);
  if (error) {
    logError('getPublishedSlugs', error);
    return [];
  }
  return data ?? [];
}
