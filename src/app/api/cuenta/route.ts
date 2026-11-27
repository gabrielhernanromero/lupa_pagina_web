import { NextResponse } from 'next/server';

import { getAdminUser } from '@/lib/admin-guard';
import { apiError, readJson } from '@/lib/blog/api';
import { TABLES, adminClient } from '@/lib/blog/supabase';
import { getPasswordHash } from '@/lib/blog/usuarios';
import { parseCambioPassword } from '@/lib/blog/validation-panel';
import { hashPassword, verifyPassword } from '@/lib/passwords';

/** Cambiar la contraseña propia. */
export async function PATCH(req: Request) {
  const yo = await getAdminUser();
  if (!yo) return apiError('Tu sesión venció. Volvé a ingresar.', 401);
  if (yo.emergencia) return apiError('El acceso de emergencia se cambia en las variables de entorno de Vercel.', 400);

  const parsed = parseCambioPassword(await readJson(req));
  if (!parsed.ok) return apiError(parsed.error, 400);

  const hash = await getPasswordHash(yo.id);
  if (!hash || !(await verifyPassword(parsed.data.actual, hash))) {
    return apiError('La contraseña actual no es correcta.', 400);
  }
  const { error } = await adminClient()
    .from(TABLES.usuarios)
    .update({ password_hash: await hashPassword(parsed.data.nueva) })
    .eq('id', yo.id);
  if (error) {
    console.error('[cuenta api] contraseña:', error);
    return apiError('No se pudo cambiar la contraseña.', 500);
  }
  return NextResponse.json({ ok: true });
}
