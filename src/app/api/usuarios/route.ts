import { NextResponse } from 'next/server';

import { rejectIfNotAdmin } from '@/lib/admin-guard';
import { apiError, readJson } from '@/lib/blog/api';
import { TABLES, adminClient } from '@/lib/blog/supabase';
import { listUsuarios } from '@/lib/blog/usuarios';
import { parseNuevoUsuario } from '@/lib/blog/validation-panel';
import { hashPassword } from '@/lib/passwords';

/** Listar usuarios del panel. */
export async function GET() {
  const denied = await rejectIfNotAdmin();
  if (denied) return denied;
  return NextResponse.json(await listUsuarios());
}

/** Crear un usuario del panel. */
export async function POST(req: Request) {
  const denied = await rejectIfNotAdmin();
  if (denied) return denied;

  const parsed = parseNuevoUsuario(await readJson(req));
  if (!parsed.ok) return apiError(parsed.error, 400);
  const { password, ...datos } = parsed.data;

  const { data, error } = await adminClient()
    .from(TABLES.usuarios)
    .insert({ ...datos, password_hash: await hashPassword(password) })
    .select('id, email, nombre, cargo, linkedin, activo, created_at')
    .single();
  if (error) {
    if (error.code === '23505') return apiError('Ya existe un usuario con ese email.', 409);
    console.error('[usuarios api] crear:', error);
    return apiError('No se pudo crear el usuario.', 500);
  }
  return NextResponse.json(data, { status: 201 });
}
