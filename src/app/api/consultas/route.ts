import { createHash } from 'node:crypto';

import { after, NextResponse } from 'next/server';

import { apiError, readJson } from '@/lib/blog/api';
import { TABLES, adminClient, isBlogConfigured } from '@/lib/blog/supabase';
import { parseConsulta } from '@/lib/blog/validation-panel';
import { avisarConsulta } from '@/lib/mail';

/**
 * Recibe las consultas del formulario de contacto (público).
 * El formulario igual abre WhatsApp: esto es para que ninguna consulta se pierda.
 */

const VENTANA_MIN = 10;
const MAX_POR_VENTANA = 5;
const MIN_MS_LLENADO = 2500;

function ipHash(req: Request): string | null {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip');
  if (!ip) return null;
  // Se guarda un hash con sal: sirve para frenar spam sin guardar la IP de nadie.
  return createHash('sha256').update(`${process.env.AUTH_SECRET ?? 'lupa'}:${ip}`).digest('hex').slice(0, 32);
}

export async function POST(req: Request) {
  if (!isBlogConfigured() || !process.env.SUPABASE_SECRET_KEY) return apiError('Servicio no disponible.', 503);

  const parsed = parseConsulta(await readJson(req));
  if (!parsed.ok) return apiError(parsed.error, 400);
  const { website, t, ...datos } = parsed.data;

  // Robots: completan el campo oculto o mandan el formulario en menos de 2,5 s. Se les responde "ok" igual.
  if (website || (t !== undefined && t < MIN_MS_LLENADO)) return NextResponse.json({ ok: true });

  const db = adminClient();
  const hash = ipHash(req);
  if (hash) {
    const desde = new Date(Date.now() - VENTANA_MIN * 60_000).toISOString();
    const { count } = await db
      .from(TABLES.consultas)
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', hash)
      .gte('created_at', desde);
    if ((count ?? 0) >= MAX_POR_VENTANA) return apiError('Demasiados envíos seguidos. Probá en unos minutos.', 429);
  }

  const { error } = await db.from(TABLES.consultas).insert({ ...datos, ip_hash: hash });
  if (error) {
    console.error('[consultas] guardar:', error);
    return apiError('No se pudo guardar la consulta.', 500);
  }

  // El mail se manda después de responder, para no demorar al visitante.
  after(async () => {
    try {
      await avisarConsulta(datos);
    } catch (e) {
      console.error('[consultas] aviso por mail:', e);
    }
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
