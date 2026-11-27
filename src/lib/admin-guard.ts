import 'server-only';

import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';

/**
 * Chequeos de sesión del panel. Se llaman en cada página y en cada ruta de la API
 * (no alcanza con el layout: al navegar dentro del panel, el layout no se vuelve a ejecutar).
 */

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
  return session;
}

/** Para las rutas /api: devuelve una respuesta 401 si no hay sesión, o null si está todo bien. */
export async function rejectIfNotAdmin(): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Tu sesión venció. Volvé a ingresar.' }, { status: 401 });
  return null;
}
