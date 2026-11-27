import 'server-only';

import nodemailer from 'nodemailer';

import { siteConfig } from '@/config/site';

/**
 * Aviso por mail de cada consulta nueva, por SMTP (por defecto, el mail de Hostinger).
 * Solo hace falta SMTP_PASS (la contraseña de contacto@); el resto tiene valores por defecto.
 * Sin SMTP_PASS no se manda nada: la consulta igual queda en el panel.
 */

const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
const port = Number(process.env.SMTP_PORT || 465);
const user = process.env.SMTP_USER || siteConfig.email;
const pass = process.env.SMTP_PASS;
const destino = process.env.CONSULTAS_AVISO_A || siteConfig.email;

export function avisosConfigurados(): boolean {
  return Boolean(pass);
}

function escapar(texto: string): string {
  return texto.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export interface DatosAviso {
  nombre: string;
  empresa: string | null;
  rubro: string | null;
  whatsapp: string;
  necesidad: string;
  mensaje: string | null;
  pagina: string | null;
}

export async function avisarConsulta(c: DatosAviso): Promise<void> {
  if (!pass) return;
  const filas: [string, string | null][] = [
    ['Nombre', c.nombre],
    ['Empresa', c.empresa],
    ['Rubro', c.rubro],
    ['WhatsApp', c.whatsapp],
    ['Necesita', c.necesidad],
    ['Mensaje', c.mensaje],
    ['Desde', c.pagina ? `${siteConfig.url}${c.pagina}` : null],
  ];
  const visibles = filas.filter((f): f is [string, string] => Boolean(f[1]));
  const panel = `${siteConfig.url}/admin/consultas`;

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  await transport.sendMail({
    from: `"Web de Lupa" <${user}>`,
    to: destino,
    subject: `Nueva consulta: ${c.nombre.replace(/\s+/g, " ").slice(0, 60)} (${c.necesidad.replace(/\s+/g, " ")})`,
    text: [...visibles.map(([k, v]) => `${k}: ${v}`), '', `Ver en el panel: ${panel}`].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;font-size:15px;color:#0f172a">
        <p style="margin:0 0 12px"><strong>Llegó una consulta nueva desde la web.</strong></p>
        <table cellpadding="6" style="border-collapse:collapse">
          ${visibles
            .map(
              ([k, v]) =>
                `<tr><td style="color:#64748b;vertical-align:top">${k}</td><td style="white-space:pre-wrap">${escapar(v)}</td></tr>`,
            )
            .join('')}
        </table>
        <p style="margin:16px 0 0"><a href="${panel}">Ver en el panel</a></p>
      </div>`,
  });
}
