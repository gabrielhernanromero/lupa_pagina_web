import 'server-only';

import { cache } from 'react';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

import { EMERGENCY_ID, auth } from '@/lib/auth';
import { getUsuario } from '@/lib/blog/usuarios';

/**
 * Chequeos de sesión del panel. Se llaman en cada página y en cada ruta de la API
 * (no alcanza con el layout: al navegar dentro del panel, el layout no se vuelve a ejecutar).
 * Si a un usuario lo desactivan o lo borran, pierde el acceso en el próximo pedido.
 */

export interface AdminUser {
  id: string;
  nombre: string;
  email: string;
  /** true si entró con el acceso de emergencia (variables de entorno). */
  emergencia: boolean;
}

export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!session?.user || !id) return null;
  if (id === EMERGENCY_ID) {
    return { id, nombre: 'Acceso de emergencia', email: session.user.email ?? '', emergencia: true };
  }
  const usuario = await getUsuario(id);
  if (!usuario?.activo) return null;
  return { id: usuario.id, nombre: usuario.nombre, email: usuario.email, emergencia: false };
});

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  return user;
}

/** Para las rutas /api: devuelve una respuesta 401 si no hay sesión válida, o null si está todo bien. */
export async function rejectIfNotAdmin(): Promise<NextResponse | null> {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'Tu sesión venció. Volvé a ingresar.' }, { status: 401 });
  return null;
}
