import { NextResponse } from 'next/server';

import { rejectIfNotAdmin } from '@/lib/admin-guard';
import { apiError, readJson } from '@/lib/blog/api';
import { TABLES, adminClient } from '@/lib/blog/supabase';
import { isUuid } from '@/lib/blog/validation';
import { parseCambiosConsulta } from '@/lib/blog/validation-panel';

interface Params {
  params: Promise<{ id: string }>;
}

/** Cambiar el estado de una consulta o su nota interna. */
export async function PATCH(req: Request, { params }: Params) {
  const denied = await rejectIfNotAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!isUuid(id)) return apiError('Consulta inexistente.', 404);

  const parsed = parseCambiosConsulta(await readJson(req));
  if (!parsed.ok) return apiError(parsed.error, 400);
  if (Object.keys(parsed.data).length === 0) return apiError('No hay cambios para guardar.', 400);

  const { data, error } = await adminClient()
    .from(TABLES.consultas)
    .update(parsed.data)
    .eq('id', id)
    .select('id, estado, notas')
    .maybeSingle();
  if (error) {
    console.error('[consultas api] editar:', error);
    return apiError('No se pudo guardar.', 500);
  }
  if (!data) return apiError('Consulta inexistente.', 404);
  return NextResponse.json(data);
}

/** Borrar una consulta (por ejemplo, si la persona pide que borremos sus datos). */
export async function DELETE(_req: Request, { params }: Params) {
  const denied = await rejectIfNotAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!isUuid(id)) return apiError('Consulta inexistente.', 404);

  const { error } = await adminClient().from(TABLES.consultas).delete().eq('id', id);
  if (error) {
    console.error('[consultas api] borrar:', error);
    return apiError('No se pudo borrar.', 500);
  }
  return NextResponse.json({ ok: true });
}
