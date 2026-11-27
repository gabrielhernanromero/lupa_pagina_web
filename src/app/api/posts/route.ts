import { NextResponse } from 'next/server';

import { rejectIfNotAdmin } from '@/lib/admin-guard';
import { apiError, dbError, readJson } from '@/lib/blog/api';
import { revalidateBlog } from '@/lib/blog/revalidate';
import { TABLES, adminClient } from '@/lib/blog/supabase';
import { firmaDeAutor } from '@/lib/blog/usuarios';
import { parsePostInput } from '@/lib/blog/validation';

/** Crear un artículo. */
export async function POST(req: Request) {
  const denied = await rejectIfNotAdmin();
  if (denied) return denied;

  const parsed = parsePostInput(await readJson(req));
  if (!parsed.ok) return apiError(parsed.error, 400);
  const input = parsed.data;

  const { data, error } = await adminClient()
    .from(TABLES.posts)
    .insert({
      ...input,
      ...(await firmaDeAutor(input.author_id)),
      published_at: input.published ? new Date().toISOString() : null,
    })
    .select('id, slug, published')
    .single();
  if (error) return dbError('crear artículo', error);

  if (data.published) revalidateBlog([data.slug]);
  return NextResponse.json(data, { status: 201 });
}
