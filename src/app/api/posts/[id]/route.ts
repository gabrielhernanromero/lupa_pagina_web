import { NextResponse } from 'next/server';

import { rejectIfNotAdmin } from '@/lib/admin-guard';
import { apiError, dbError, readJson } from '@/lib/blog/api';
import { revalidateBlog } from '@/lib/blog/revalidate';
import { adminClient } from '@/lib/blog/supabase';
import { isUuid, parsePostInput } from '@/lib/blog/validation';

interface Params {
  params: Promise<{ id: string }>;
}

async function getExisting(id: string) {
  return adminClient().from('posts').select('slug, published, published_at').eq('id', id).maybeSingle();
}

/** Guardar cambios de un artículo. */
export async function PATCH(req: Request, { params }: Params) {
  const denied = await rejectIfNotAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!isUuid(id)) return apiError('Artículo inexistente.', 404);

  const parsed = parsePostInput(await readJson(req));
  if (!parsed.ok) return apiError(parsed.error, 400);
  const input = parsed.data;

  const { data: existing, error: readError } = await getExisting(id);
  if (readError) return dbError('leer artículo', readError);
  if (!existing) return apiError('Artículo inexistente.', 404);

  const published_at = input.published && !existing.published_at ? new Date().toISOString() : existing.published_at;
  const { data, error } = await adminClient()
    .from('posts')
    .update({ ...input, published_at })
    .eq('id', id)
    .select('id, slug, published')
    .single();
  if (error) return dbError('actualizar artículo', error);

  // Si estaba o está publicado, hay que refrescar la web (incluida la URL vieja si cambió).
  if (existing.published || data.published) revalidateBlog([existing.slug, data.slug]);
  return NextResponse.json(data);
}

/** Borrar un artículo. */
export async function DELETE(_req: Request, { params }: Params) {
  const denied = await rejectIfNotAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!isUuid(id)) return apiError('Artículo inexistente.', 404);

  const { data: existing, error: readError } = await getExisting(id);
  if (readError) return dbError('leer artículo', readError);
  if (!existing) return apiError('Artículo inexistente.', 404);

  const { error } = await adminClient().from('posts').delete().eq('id', id);
  if (error) return dbError('borrar artículo', error);

  if (existing.published) revalidateBlog([existing.slug]);
  return NextResponse.json({ ok: true });
}
