import type { Metadata } from 'next';

import { ConsultasList, type ConsultaView } from '@/components/admin/consultas-list';
import { normalizeWhatsAppNumber } from '@/config/site';
import { requireAdmin } from '@/lib/admin-guard';
import { contarConsultas, listConsultas } from '@/lib/blog/consultas';
import { ESTADOS_CONSULTA, type EstadoConsulta } from '@/lib/blog/validation-panel';
import { avisosConfigurados } from '@/lib/mail';

export const metadata: Metadata = { title: 'Consultas' };

const fecha = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Argentina/Buenos_Aires',
});

export default async function ConsultasPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  await requireAdmin();
  const { estado } = await searchParams;
  const filtro: EstadoConsulta | 'todas' =
    estado === 'todas' || ESTADOS_CONSULTA.includes(estado as EstadoConsulta) ? (estado as EstadoConsulta | 'todas') : 'nueva';

  const [{ consultas, error }, conteo] = await Promise.all([listConsultas(filtro), contarConsultas()]);
  const vista: ConsultaView[] = consultas.map((c) => ({
    ...c,
    whatsappLink: normalizeWhatsAppNumber(c.whatsapp),
    fecha: fecha.format(new Date(c.created_at)),
  }));

  return (
    // key: al cambiar de filtro, la lista arranca de cero con los datos del servidor.
    <ConsultasList key={filtro} inicial={vista} filtro={filtro} conteo={conteo} error={error} avisosPorMail={avisosConfigurados()} />
  );
}
