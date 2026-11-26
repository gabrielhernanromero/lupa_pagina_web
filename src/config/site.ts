/**
 * Configuración global del sitio.
 * Los datos de contacto acá son PÚBLICOS. No agregar mails internos
 * (gabriel@, priscila@, facturacion@, soporte@, cuentas@).
 */

/** WhatsApp Business de Lupa: 11 7263-4803 (formato wa.me: 54 + 9 + área + número). */
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491172634803';

/** "5491172634803" → "+54 9 11 7263-4803". Otros formatos se muestran como "+<número>". */
function formatWhatsAppDisplay(n: string): string {
  const amba = n.match(/^549(11)(\d{4})(\d{4})$/);
  return amba ? `+54 9 ${amba[1]} ${amba[2]}-${amba[3]}` : `+${n}`;
}

export const siteConfig = {
  name: 'Lupa Servicios Digitales',
  shortName: 'Lupa',
  url: 'https://lupaserviciosdigitales.com',
  domain: 'lupaserviciosdigitales.com',
  title: 'Lupa Servicios Digitales | Web, SEO y marketing para pymes',
  description:
    'Web, Google y redes para pymes de servicios. Un solo equipo de desarrollo y marketing para que te encuentren, te vean serio y te escriban.',
  lema: 'Tu trabajo ya es bueno. Que se note.',
  locale: 'es-AR',

  email: 'contacto@lupaserviciosdigitales.com',
  emailSubject: 'Consulta desde la web',

  whatsapp: {
    /** Formato wa.me: internacional, sin "+" ni espacios. */
    number: whatsappNumber,
    /** Texto visible, derivado del número. */
    display: formatWhatsAppDisplay(whatsappNumber),
    e164: `+${whatsappNumber}`,
  },

  ubicacion: 'Zona Oeste, Buenos Aires · Atención en todo el país',

  /**
   * Redes de Lupa. PENDIENTE: [LINKEDIN_LUPA] y [INSTAGRAM_LUPA].
   * Mientras estén en null, los links no se muestran ni se publican en el JSON-LD.
   */
  redes: {
    linkedin: null as string | null,
    instagram: null as string | null,
  },

  mensajes: {
    diagnostico: 'Hola Lupa, quiero un diagnóstico para mi empresa.',
    plan: (nombre: string) => `Hola Lupa, me interesa el plan ${nombre}. ¿Me cuentan más?`,
  },

  nav: [
    { label: 'Servicios', href: '/#servicios' },
    { label: 'Planes', href: '/#planes' },
    { label: 'Casos', href: '/#casos' },
    { label: 'Nosotros', href: '/#nosotros' },
    { label: 'Preguntas', href: '/#preguntas' },
  ],

  copyrightYear: 2026,
} as const;

export const mailtoHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(siteConfig.emailSubject)}`;

export type SiteConfig = typeof siteConfig;
