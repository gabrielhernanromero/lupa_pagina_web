import { NextResponse } from 'next/server';

import { getAdminUser } from '@/lib/admin-guard';
import { apiError, readJson } from '@/lib/blog/api';
import { revalidateBlog } from '@/lib/blog/revalidate';
import { TABLES, adminClient } from '@/lib/blog/supabase';
import { getUsuario } from '@/lib/blog/usuarios';
import { isUuid } from '@/lib/blog/validation';
import { parseCambiosUsuario } from '@/lib/blog/validation-panel';
import { hashPassword } from '@/lib/passwords';

interface Params {
  params: Promise<{ id: string }>;
}

const SIN_SESION = () => apiError('Tu sesión venció. Volvé a ingresar.', 401);

/** Actualiza la firma de los artículos del autor (nombre, cargo y LinkedIn) y refresca el blog. */
async function actualizarFirma(id: string) {
  const usuario = await getUsuario(id);
  if (!usuario) return;
  const { data } = await adminClient()
    .from(TABLES.posts)
    .update({ author_name: usuario.nombre, author_role: usuario.cargo, author_url: usuario.linkedin })
    .eq('author_id', id)
    .select('slug, published');
  const publicados = (data ?? []).filter((p) => p.published).map((p) => p.slug as string);
  if (publicados.length) revalidateBlog(publicados);
}

/** Editar un usuario: datos, activo/inactivo o nueva contraseña. */
export async function PATCH(req: Request, { params }: Params) {
  const yo = await getAdminUser();
  if (!yo) return SIN_SESION();
  const { id } = await params;
  if (!isUuid(id) || !(await getUsuario(id))) return apiError('Usuario inexistente.', 404);

  const parsed = parseCambiosUsuario(await readJson(req));
  if (!parsed.ok) return apiError(parsed.error, 400);
  const { password, ...cambios } = parsed.data;
  if (id === yo.id && cambios.activo === false) return apiError('No podés desactivar tu propio usuario.', 400);

  const update: Record<string, unknown> = { ...cambios };
  if (password) update.password_hash = await hashPassword(password);
  if (Object.keys(update).length === 0) return apiError('No hay cambios para guardar.', 400);

  const { data, error } = await adminClient()
    .from(TABLES.usuarios)
    .update(update)
    .eq('id', id)
    .select('id, email, nombre, cargo, linkedin, activo, created_at')
    .single();
  if (error) {
    console.error('[usuarios api] editar:', error);
    return apiError('No se pudo guardar el usuario.', 500);
  }
  if ('nombre' in cambios || 'cargo' in cambios || 'linkedin' in cambios) await actualizarFirma(id);
  return NextResponse.json(data);
}

/** Borrar un usuario. Sus artículos quedan, con su nombre como firma. */
export async function DELETE(_req: Request, { params }: Params) {
  const yo = await getAdminUser();
  if (!yo) return SIN_SESION();
  const { id } = await params;
  if (!isUuid(id)) return apiError('Usuario inexistente.', 404);
  if (id === yo.id) return apiError('No podés borrar tu propio usuario.', 400);

  const { error } = await adminClient().from(TABLES.usuarios).delete().eq('id', id);
  if (error) {
    console.error('[usuarios api] borrar:', error);
    return apiError('No se pudo borrar el usuario.', 500);
  }
  return NextResponse.json({ ok: true });
}
