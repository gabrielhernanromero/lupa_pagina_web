import 'server-only';

import { NextResponse } from 'next/server';

/** Respuestas de error de la API del panel: mensaje claro para el usuario, detalle técnico solo en el log. */

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function dbError(where: string, error: { code?: string; message?: string }) {
  if (error.code === '23505') return apiError('Ya existe otro artículo con esa URL. Cambiala y volvé a guardar.', 409);
  console.error(`[blog api] ${where}:`, error);
  return apiError('No se pudo guardar. Probá de nuevo en un rato.', 500);
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
