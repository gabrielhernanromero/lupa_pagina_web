export type IconoServicio = 'web' | 'seo' | 'marketing' | 'sistemas';

export interface Servicio {
  id: string;
  icono: IconoServicio;
  titulo: string;
  bajada: string;
  items: string[];
  nota?: string;
}

export const servicios: Servicio[] = [
  {
    id: 'sitios-web',
    icono: 'web',
    titulo: 'Sitios web a medida',
    bajada: 'Diseño propio, no plantillas. Rápidos, seguros y hechos para traer consultas.',
    items: [
      'Landing pages y sitios institucionales',
      'Una página por servicio, pensada para Google',
      'Blog con panel propio para publicar sin depender de nadie',
      'Panel de administración para editar textos, imágenes, servicios y testimonios',
      'Bandeja de consultas: los contactos del formulario quedan ordenados en el panel',
      'Botones y formularios conectados a WhatsApp',
      'Dominio, mail profesional, certificado de seguridad y copias de seguridad',
    ],
  },
  {
    id: 'seo-geo',
    icono: 'seo',
    titulo: 'Posicionamiento: SEO + GEO',
    bajada: 'Que te encuentren en Google y en los buscadores con inteligencia artificial.',
    items: [
      'SEO técnico: velocidad, estructura, metadatos, sitemap y Search Console',
      'Datos estructurados (schema.org) para que Google entienda qué hacés y dónde',
      'GEO: preparamos tu web para que ChatGPT, Gemini, Perplexity y las respuestas con IA de Google te entiendan y puedan citarte',
      'Ficha de Google Business Profile optimizada (Google Maps)',
      'Artículos de blog con enfoque SEO',
      'Medición con Google Analytics 4',
    ],
    nota: 'Nadie puede garantizar un puesto en Google ni en una IA. Lo que hacemos es dejarte en las mejores condiciones para aparecer, y mostrarte los números.',
  },
  {
    id: 'marketing-contenido',
    icono: 'marketing',
    titulo: 'Marketing y contenido',
    bajada: 'Constancia profesional en tus redes, sin que tengas que pensar qué publicar.',
    items: [
      'Estrategia y calendario mensual de contenidos',
      'Diseño de publicaciones e historias',
      'Creación y edición de imágenes',
      'Edición de video y reels',
      'Redacción de copys y textos institucionales',
      'Instagram, Facebook, LinkedIn y Google Business Profile',
      'Programación y publicación',
      'Informe mensual: qué funcionó y qué ajustamos',
    ],
  },
  {
    id: 'sistemas-automatizaciones-ia',
    icono: 'sistemas',
    titulo: 'Sistemas, automatizaciones e IA',
    bajada: 'Si tu empresa se maneja con planillas, papeles y WhatsApp, lo ordenamos.',
    items: [
      'Relevamiento y análisis de procesos: primero entendemos cómo trabajás, después programamos',
      'Sistemas de gestión a medida (órdenes de trabajo, clientes, turnos, stock)',
      'Bots de WhatsApp con IA que responden consultas frecuentes las 24 h',
      'Automatizaciones entre tus herramientas (formularios, planillas, mail, CRM)',
      'Tableros con los números de tu negocio',
    ],
  },
];
