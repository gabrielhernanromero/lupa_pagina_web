import 'server-only';

import { adminClient, isBlogConfigured } from './supabase';
import { POST_SUMMARY_FIELDS, type Post, type PostSummary, type PostTemplate } from './types';

/** Lecturas del panel (incluyen borradores). Solo se llaman después de requireAdmin(). */

function ready() {
  return isBlogConfigured() && Boolean(process.env.SUPABASE_SECRET_KEY);
}

export async function listAllPosts(): Promise<{ posts: PostSummary[]; error?: string }> {
  if (!ready()) return { posts: [] };
  const { data, error } = await adminClient()
    .from('posts')
    .select(POST_SUMMARY_FIELDS)
    .order('updated_at', { ascending: false });
  if (error) {
    console.error('[blog admin] listAllPosts:', error);
    return { posts: [], error: 'No se pudieron cargar los artículos. ¿Corriste el script de la base de datos (supabase/schema.sql)?' };
  }
  return { posts: (data ?? []) as PostSummary[] };
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!ready()) return null;
  const { data, error } = await adminClient().from('posts').select('*').eq('id', id).maybeSingle();
  if (error) console.error('[blog admin] getPostById:', error);
  return (data as Post | null) ?? null;
}

export async function listTemplates(): Promise<PostTemplate[]> {
  if (!ready()) return [];
  const { data, error } = await adminClient()
    .from('post_templates')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) console.error('[blog admin] listTemplates:', error);
  return (data ?? []) as PostTemplate[];
}
