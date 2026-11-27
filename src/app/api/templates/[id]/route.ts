import { NextResponse } from 'next/server';

import { rejectIfNotAdmin } from '@/lib/admin-guard';
import { apiError, dbError } from '@/lib/blog/api';
import { TABLES, adminClient } from '@/lib/blog/supabase';
import { isUuid } from '@/lib/blog/validation';

/** Borrar una plantilla. Los artículos que la usaron conservan sus bloques. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await rejectIfNotAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!isUuid(id)) return apiError('Plantilla inexistente.', 404);

  const { error } = await adminClient().from(TABLES.templates).delete().eq('id', id);
  if (error) return dbError('borrar plantilla', error);
  return NextResponse.json({ ok: true });
}
