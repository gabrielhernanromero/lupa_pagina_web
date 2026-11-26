export interface Caso {
  id: string;
  cliente: string;
  rubro: string;
  url: string;
  desafio: string;
  queHicimos: string;
  resultado: string;
}

/** PENDIENTE: logo de Iron Tower (con permiso). */
export const casos: Caso[] = [
  {
    id: 'iron-tower',
    cliente: 'Iron Tower',
    rubro: 'Trabajos en altura certificados IRATA',
    url: 'https://irontowerarg.com/',
    desafio: 'Buen trabajo y buena cartera, pero sin presencia digital que lo respaldara.',
    queHicimos:
      'Web corporativa con panel propio y blog, 6 páginas de servicio optimizadas para Google con datos estructurados, gestión de Instagram, Facebook, LinkedIn y Google Business Profile, y artículos SEO mensuales.',
    resultado: 'A los 4 meses, una empresa los contactó para cotizar en una licitación, sin inversión en publicidad.',
  },
];

export const fraseConfianza =
  'Un cliente B2B recibió una consulta para cotizar en una licitación a los 4 meses de trabajar con nosotros, sin pagar publicidad.';
