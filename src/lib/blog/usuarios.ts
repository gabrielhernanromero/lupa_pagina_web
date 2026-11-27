import 'server-only';

import { TABLES, adminClient, isBlogConfigured } from './supabase';

/** Usuarios del panel (tabla lupa_usuarios). El hash de la contraseña nunca sale de este archivo. */

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  cargo: string | null;
  linkedin: string | null;
  activo: boolean;
  created_at: string;
}

const CAMPOS = 'id, email, nombre, cargo, linkedin, activo, created_at';

function ready() {
  return isBlogConfigured() && Boolean(process.env.SUPABASE_SECRET_KEY);
}

export async function listUsuarios(): Promise<Usuario[]> {
  if (!ready()) return [];
  const { data, error } = await adminClient().from(TABLES.usuarios).select(CAMPOS).order('created_at');
  if (error) console.error('[usuarios] listar:', error);
  return (data ?? []) as Usuario[];
}

export async function getUsuario(id: string): Promise<Usuario | null> {
  if (!ready()) return null;
  const { data, error } = await adminClient().from(TABLES.usuarios).select(CAMPOS).eq('id', id).maybeSingle();
  if (error) console.error('[usuarios] leer:', error);
  return (data as Usuario | null) ?? null;
}

/** Para el login: incluye el hash. */
export async function getUsuarioParaLogin(email: string): Promise<(Usuario & { password_hash: string }) | null> {
  if (!ready()) return null;
  const { data, error } = await adminClient()
    .from(TABLES.usuarios)
    .select(`${CAMPOS}, password_hash`)
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();
  if (error) console.error('[usuarios] login:', error);
  return (data as (Usuario & { password_hash: string }) | null) ?? null;
}

export async function getPasswordHash(id: string): Promise<string | null> {
  if (!ready()) return null;
  const { data } = await adminClient().from(TABLES.usuarios).select('password_hash').eq('id', id).maybeSingle();
  return (data as { password_hash: string } | null)?.password_hash ?? null;
}

/** Firma que se guarda en el artículo (nombre, cargo y LinkedIn del autor). */
export async function firmaDeAutor(authorId: string | null) {
  const usuario = authorId ? await getUsuario(authorId) : null;
  return {
    author_id: usuario?.id ?? null,
    author_name: usuario?.nombre ?? null,
    author_role: usuario?.cargo ?? null,
    author_url: usuario?.linkedin ?? null,
  };
}
