export type CategoriaPlan = 'web' | 'marketing' | 'mantenimiento' | 'combo' | 'extra';

export interface Plan {
  id: string;
  categoria: CategoriaPlan;
  nombre: string;
  paraQuien: string;
  /** null → "A cotizar" */
  precio: number | null;
  /** Antepone "Desde" al precio. */
  precioDesde?: boolean;
  modalidad: 'unico' | 'mensual';
  entrega?: string;
  incluye: string[];
  nota?: string;
  destacado?: boolean;
  /** false → "Consultar" */
  mostrarPrecio: boolean;
  ctaTexto?: string;
  /**
   * En planes: reemplaza la línea "modalidad · entrega".
   * En extras: complemento que va después del precio ("+ proveedor", "(pago único)").
   */
  detalle?: string;
}

export type CategoriaTab = Exclude<CategoriaPlan, 'extra'>;

export const tabsPlanes: { id: CategoriaTab; label: string; nota: string }[] = [
  {
    id: 'web',
    label: 'Web',
    nota: 'Pago: 50% para arrancar y 50% contra entrega, o en 3 pagos. El dominio y la web quedan a nombre de tu empresa: la web es tuya.',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    nota: 'Mínimo 3 meses, después mes a mes. Trabajamos con fotos y videos reales de tus trabajos. Si no tenés material, te guiamos para sacarlo con el celular o lo cotizamos aparte. La publicidad paga (Meta Ads / Google Ads) y su presupuesto no están incluidos.',
  },
  {
    id: 'mantenimiento',
    label: 'Mantenimiento',
    nota: 'El costo anual del dominio no está incluido y siempre queda a nombre de tu empresa.',
  },
  { id: 'combo', label: 'Combos', nota: '' },
];

export const planes: Plan[] = [
  // ── Web ──────────────────────────────────────────────
  {
    id: 'presencia',
    categoria: 'web',
    nombre: 'Presencia',
    paraQuien: 'Para estar online, bien hecho, ya.',
    precio: 390000,
    modalidad: 'unico',
    entrega: '7 días hábiles',
    mostrarPrecio: true,
    incluye: [
      'Landing page de una sola página con diseño a medida (hasta 6 secciones)',
      'Adaptada a celular, tablet y computadora',
      'Botón de WhatsApp y formulario de contacto',
      'SEO base: títulos, descripciones, sitemap y velocidad',
      'Google Analytics 4 instalado',
      'Configuración de dominio y certificado de seguridad',
      '1 ronda de cambios',
    ],
  },
  {
    id: 'profesional',
    categoria: 'web',
    nombre: 'Profesional',
    paraQuien: 'Para que Google te empiece a traer consultas.',
    precio: 790000,
    modalidad: 'unico',
    entrega: '15 días hábiles',
    destacado: true,
    mostrarPrecio: true,
    incluye: [
      'Todo lo de Presencia',
      'Sitio de varias páginas: inicio, una página por servicio (hasta 6), nosotros y contacto',
      'Blog con panel propio para publicar',
      'SEO técnico completo + datos estructurados + Search Console',
      'GEO base: preparado para buscadores con IA',
      'Alta u optimización de tu ficha de Google Business Profile',
      'Medición de clics en WhatsApp y envíos de formulario',
      'Capacitación para usar el panel',
      '2 rondas de cambios',
    ],
  },
  {
    id: 'full',
    categoria: 'web',
    nombre: 'Full',
    paraQuien: 'Para manejar tu web sin depender de nadie.',
    precio: 1290000,
    modalidad: 'unico',
    entrega: '20 a 25 días hábiles',
    mostrarPrecio: true,
    incluye: [
      'Todo lo de Profesional',
      'Panel de administración completo: textos, servicios, imágenes, testimonios y casos',
      'Bandeja de consultas dentro del panel',
      'Hasta 12 páginas',
      '3 artículos de blog iniciales redactados con SEO',
      '1 integración (planilla, CRM, mailing o automatización)',
      'Soporte prioritario durante el primer mes',
    ],
  },
  {
    id: 'a-medida',
    categoria: 'web',
    nombre: 'A medida',
    paraQuien: 'Sistemas, plataformas, bots e integraciones.',
    precio: 1500000,
    precioDesde: true,
    modalidad: 'unico',
    entrega: 'Según proyecto',
    mostrarPrecio: true,
    ctaTexto: 'Contanos tu idea',
    incluye: [
      'Relevamiento y análisis funcional',
      'Sistemas de gestión, portales de clientes y apps internas',
      'Bots de WhatsApp con IA',
      'Automatizaciones e integraciones',
      'Tableros de indicadores',
    ],
  },

  // ── Marketing ────────────────────────────────────────
  {
    id: 'redes-esencial',
    categoria: 'marketing',
    nombre: 'Redes Esencial',
    paraQuien: 'Para tener tus redes activas y prolijas.',
    precio: 350000,
    modalidad: 'mensual',
    mostrarPrecio: true,
    incluye: [
      'Instagram y Facebook',
      '8 publicaciones por mes con diseño propio',
      '1 reel por mes',
      'Historias 3 veces por semana',
      'Calendario mensual, copys y programación',
      'Informe mensual de métricas',
    ],
  },
  {
    id: 'integral',
    categoria: 'marketing',
    nombre: 'Integral',
    paraQuien: 'Presencia completa: redes, Google y blog.',
    precio: 590000,
    modalidad: 'mensual',
    destacado: true,
    mostrarPrecio: true,
    incluye: [
      'Instagram, Facebook, LinkedIn y Google Business Profile',
      'Historias de lunes a viernes',
      '8 publicaciones por mes en Instagram y Facebook',
      '2 reels por mes',
      '4 publicaciones por mes en LinkedIn',
      '4 publicaciones por mes en Google Business Profile',
      '2 artículos de blog con SEO por mes*',
      'Informe mensual + reunión de resultados',
    ],
    nota: '*Si todavía no tenés web con blog, se reemplazan por 4 publicaciones extra.',
  },
  {
    id: 'b2b-autoridad',
    categoria: 'marketing',
    nombre: 'B2B Autoridad',
    paraQuien: 'Para empresas que le venden a otras empresas.',
    precio: 420000,
    modalidad: 'mensual',
    mostrarPrecio: true,
    incluye: [
      'LinkedIn de la empresa y del dueño/a: 8 publicaciones por mes',
      '4 artículos de blog con SEO por mes (requiere web con blog)',
      '4 publicaciones por mes en Google Business Profile',
      '1 caso de trabajo o testimonio armado por mes',
      'Informe mensual de posicionamiento y métricas',
    ],
  },

  // ── Mantenimiento ────────────────────────────────────
  {
    id: 'sin-mantenimiento',
    categoria: 'mantenimiento',
    nombre: 'Sin mantenimiento',
    paraQuien: 'La web es tuya y la manejás vos.',
    precio: 0,
    modalidad: 'mensual',
    mostrarPrecio: true,
    incluye: [
      'Te entregamos todos los accesos',
      'Dominio y hosting a nombre de tu empresa (pagás directo al proveedor)',
      '30 días de garantía por errores',
      'Cambios posteriores: por hora, a pedido',
    ],
  },
  {
    id: 'tecnico',
    categoria: 'mantenimiento',
    nombre: 'Técnico',
    paraQuien: 'Nos ocupamos de que funcione siempre.',
    precio: 45000,
    modalidad: 'mensual',
    mostrarPrecio: true,
    incluye: [
      'Hosting gestionado',
      'Certificado de seguridad y copias de seguridad',
      'Monitoreo: si se cae, nos enteramos antes que vos',
      'Actualizaciones de seguridad',
      'Hasta 1 hora de cambios chicos por mes',
      'Soporte por WhatsApp en horario hábil',
    ],
  },
  {
    id: 'crecimiento',
    categoria: 'mantenimiento',
    nombre: 'Crecimiento',
    paraQuien: 'Mantenimiento + una web que sigue sumando.',
    precio: 130000,
    modalidad: 'mensual',
    destacado: true,
    mostrarPrecio: true,
    incluye: [
      'Todo lo de Técnico',
      '2 artículos de blog con SEO por mes',
      'Revisión mensual de Search Console y ajustes SEO/GEO',
      'Hasta 2 horas de cambios por mes',
      'Informe mensual',
    ],
  },

  // ── Combos ───────────────────────────────────────────
  {
    id: 'presencia-total',
    categoria: 'combo',
    nombre: 'Presencia Total',
    paraQuien: 'Web, marketing y mantenimiento, todo junto.',
    precio: 590000,
    modalidad: 'unico',
    destacado: true,
    mostrarPrecio: true,
    detalle: 'Web Profesional con 25% off (en lugar de $ 790.000)',
    incluye: [
      'Web Profesional con 25% off: $ 590.000 (en lugar de $ 790.000)',
      'Marketing Integral: $ 590.000/mes',
      'Mantenimiento Técnico bonificado mientras sigas con marketing',
      'Compromiso mínimo: 6 meses',
    ],
  },
  {
    id: 'web-suscripcion',
    categoria: 'combo',
    nombre: 'Web por suscripción',
    paraQuien: 'Tu web profesional sin una inversión grande de entrada.',
    precio: 115000,
    modalidad: 'mensual',
    mostrarPrecio: true,
    detalle: 'Alta: $ 150.000 · durante 12 meses',
    incluye: [
      'Web Profesional completa',
      'Mantenimiento Técnico incluido durante los 12 meses',
      'Al mes 12 la web es 100% tuya; si querés, seguís con mantenimiento a valor normal',
    ],
    nota: 'Las cuotas se actualizan cada 3 meses.',
  },
];

export const extras: Plan[] = [
  { id: 'reel-adicional', categoria: 'extra', nombre: 'Reel o video adicional', paraQuien: '', precio: 45000, modalidad: 'unico', mostrarPrecio: true, incluye: [] },
  { id: 'pieza-grafica', categoria: 'extra', nombre: 'Pieza gráfica adicional (placa, flyer, portada)', paraQuien: '', precio: 20000, modalidad: 'unico', mostrarPrecio: true, incluye: [] },
  { id: 'articulo-blog', categoria: 'extra', nombre: 'Artículo de blog con SEO adicional', paraQuien: '', precio: 40000, modalidad: 'unico', mostrarPrecio: true, incluye: [] },
  { id: 'google-business', categoria: 'extra', nombre: 'Alta y optimización de Google Business Profile', paraQuien: '', precio: 90000, modalidad: 'unico', mostrarPrecio: true, detalle: '(pago único)', incluye: [] },
  { id: 'mail-profesional', categoria: 'extra', nombre: 'Mail profesional con tu dominio (configuración)', paraQuien: '', precio: 40000, modalidad: 'unico', mostrarPrecio: true, detalle: '+ proveedor', incluye: [] },
  { id: 'logo-identidad', categoria: 'extra', nombre: 'Logo e identidad visual básica', paraQuien: '', precio: 180000, precioDesde: true, modalidad: 'unico', mostrarPrecio: true, incluye: [] },
  { id: 'bot-whatsapp', categoria: 'extra', nombre: 'Bot de WhatsApp con IA', paraQuien: '', precio: 600000, precioDesde: true, modalidad: 'unico', mostrarPrecio: true, incluye: [] },
  { id: 'automatizacion', categoria: 'extra', nombre: 'Automatización a medida', paraQuien: '', precio: 250000, precioDesde: true, modalidad: 'unico', mostrarPrecio: true, incluye: [] },
  { id: 'hora-desarrollo', categoria: 'extra', nombre: 'Hora de desarrollo o cambios', paraQuien: '', precio: 25000, modalidad: 'unico', mostrarPrecio: true, incluye: [] },
  { id: 'ads-email', categoria: 'extra', nombre: 'Meta Ads / Google Ads / Email marketing', paraQuien: '', precio: null, modalidad: 'unico', mostrarPrecio: true, incluye: [] },
];

/** PENDIENTE: completar [MES AÑO] y [Precios finales / + IVA]. */
export const vigenciaPrecios = 'Precios en pesos argentinos, vigentes a [MES AÑO]. [Precios finales / + IVA].';
