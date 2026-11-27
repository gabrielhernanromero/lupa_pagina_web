import 'server-only';

import { TABLES, adminClient, isBlogConfigured } from './supabase';
import type { EstadoConsulta } from './validation-panel';

/** Lecturas de la bandeja de consultas (solo panel). */

export interface Consulta {
  id: string;
  nombre: string;
  empresa: string | null;
  rubro: string | null;
  whatsapp: string;
  necesidad: string;
  mensaje: string | null;
  pagina: string | null;
  estado: EstadoConsulta;
  notas: string | null;
  created_at: string;
}

const CAMPOS = 'id, nombre, empresa, rubro, whatsapp, necesidad, mensaje, pagina, estado, notas, created_at';

function ready() {
  return isBlogConfigured() && Boolean(process.env.SUPABASE_SECRET_KEY);
}

export async function listConsultas(estado: EstadoConsulta | 'todas'): Promise<{ consultas: Consulta[]; error?: string }> {
  if (!ready()) return { consultas: [] };
  let q = adminClient().from(TABLES.consultas).select(CAMPOS).order('created_at', { ascending: false }).limit(300);
  if (estado !== 'todas') q = q.eq('estado', estado);
  const { data, error } = await q;
  if (error) {
    console.error('[consultas] listar:', error);
    return { consultas: [], error: 'No se pudieron cargar las consultas.' };
  }
  return { consultas: (data ?? []) as Consulta[] };
}

export async function contarConsultas(): Promise<Record<EstadoConsulta, number>> {
  const vacio = { nueva: 0, respondida: 0, archivada: 0 };
  if (!ready()) return vacio;
  const db = adminClient();
  const contar = async (estado: EstadoConsulta) => {
    const { count } = await db.from(TABLES.consultas).select('id', { count: 'exact', head: true }).eq('estado', estado);
    return count ?? 0;
  };
  const [nueva, respondida, archivada] = await Promise.all([contar('nueva'), contar('respondida'), contar('archivada')]);
  return { nueva, respondida, archivada };
}

export async function contarNuevas(): Promise<number> {
  if (!ready()) return 0;
  const { count } = await adminClient()
    .from(TABLES.consultas)
    .select('id', { count: 'exact', head: true })
    .eq('estado', 'nueva');
  return count ?? 0;
}
