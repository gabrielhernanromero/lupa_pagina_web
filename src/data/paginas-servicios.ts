import type { PreguntaFrecuente } from './faq';
import { faq } from './faq';
import { planes } from './planes';

/**
 * Contenido de las páginas de cada servicio (/servicios/[slug]).
 * El slug es el id del servicio en data/servicios.ts. Los planes y extras
 * se toman de data/planes.ts por id, así los precios siempre coinciden con la home.
 */
export interface PaginaServicio {
  /** = id en data/servicios.ts y slug de la URL */
  id: string;
  /** Título para Google (se le agrega "| Lupa Servicios Digitales"). */
  metaTitulo: string;
  metaDescripcion: string;
  /** Título visible (h1). */
  h1: string;
  intro: string[];
  paraQuien: string[];
  /** ids de data/planes.ts */
  planes: string[];
  extras: string[];
  preguntas: PreguntaFrecuente[];
  /** Mensaje precargado de WhatsApp. */
  mensaje: string;
  /** Muestra el caso de Iron Tower. */
  mostrarCaso?: boolean;
}

/** Reutiliza una pregunta de la home (misma respuesta en todo el sitio). */
function deLaHome(pregunta: string): PreguntaFrecuente {
  const encontrada = faq.find((f) => f.q === pregunta);
  if (!encontrada) throw new Error(`Falta la pregunta "${pregunta}" en data/faq.ts`);
  return encontrada;
}

function entrega(id: string): string {
  return planes.find((p) => p.id === id)?.entrega ?? '';
}

export const paginasServicios: PaginaServicio[] = [
  {
    id: 'sitios-web',
    metaTitulo: 'Diseño de páginas web para pymes',
    metaDescripcion:
      'Webs con diseño propio, rápidas y pensadas para que te escriban por WhatsApp: landing, sitio institucional o web con blog y panel. Zona Oeste y todo el país.',
    h1: 'Páginas web a medida para pymes de servicios',
    intro: [
      'Tu web es lo primero que mira un cliente antes de escribirte. Si no existe, está vieja o no se ve bien en el celular, esa consulta se va a otro.',
      'Diseñamos y programamos cada web desde cero, sin plantillas: rápida, segura, preparada para Google y con el WhatsApp siempre a mano. El dominio y la web quedan a nombre de tu empresa.',
    ],
    paraQuien: [
      'Empresas de servicios que todavía no tienen web.',
      'Quienes tienen una web vieja, lenta o que no se ve bien en el celular.',
      'Pymes que quieren publicar y actualizar su web sin depender de un programador.',
    ],
    planes: ['presencia', 'profesional', 'full'],
    extras: ['logo-identidad', 'mail-profesional', 'articulo-blog'],
    preguntas: [
      {
        q: '¿Cuánto tarda en estar lista la web?',
        a: `Depende del plan: Presencia, ${entrega('presencia')}; Profesional, ${entrega('profesional')}; Full, ${entrega('full')}. El plazo corre desde que tenemos los textos y las fotos.`,
      },
      {
        q: '¿Voy a poder cambiar textos y fotos yo mismo?',
        a: 'Sí. Con el plan Profesional tenés un panel propio para publicar en el blog, y con el Full también editás textos, servicios, imágenes, testimonios y casos.',
      },
      deLaHome('¿A nombre de quién quedan el dominio y la web?'),
      deLaHome('¿Ya tengo web, la pueden mejorar?'),
      deLaHome('¿Tengo que pagar mantenimiento sí o sí?'),
    ],
    mensaje: 'Hola Lupa, quiero una web para mi empresa. ¿Me cuentan cómo trabajan?',
    mostrarCaso: true,
  },
  {
    id: 'seo-geo',
    metaTitulo: 'SEO y GEO para pymes: aparecé en Google y en la IA',
    metaDescripcion:
      'Que te encuentren en Google, en Google Maps y en ChatGPT, Gemini o Perplexity. SEO técnico, ficha de Google Business Profile, contenido y medición mensual.',
    h1: 'Posicionamiento en Google y en buscadores con IA',
    intro: [
      'Cuando alguien busca tu servicio en tu zona, elige entre los que aparecen. Si no estás ahí, para ese cliente no existís.',
      'Trabajamos el SEO técnico de tu web, tu ficha de Google Business Profile y el contenido, y preparamos todo para los buscadores con inteligencia artificial (GEO). Cada mes te mostramos los números.',
    ],
    paraQuien: [
      'Negocios de servicios que dependen de clientes de su zona.',
      'Empresas que tienen web pero no aparecen en Google.',
      'Quienes quieren aparecer cuando alguien le pregunta a ChatGPT o a Gemini por un proveedor.',
    ],
    planes: ['profesional', 'crecimiento'],
    extras: ['google-business', 'articulo-blog'],
    preguntas: [
      deLaHome('¿Me garantizan el primer puesto en Google?'),
      deLaHome('¿Qué es GEO?'),
      {
        q: '¿Qué es Google Business Profile?',
        a: 'Es la ficha de tu negocio en Google y en Google Maps: zona, horarios, teléfono, fotos y reseñas. Para una empresa de servicios suele ser lo primero que ve un cliente cuando busca en su zona.',
      },
      deLaHome('¿Cuándo se ven los resultados?'),
    ],
    mensaje: 'Hola Lupa, quiero aparecer en Google. ¿Me ayudan con el posicionamiento?',
    mostrarCaso: true,
  },
  {
    id: 'marketing-contenido',
    metaTitulo: 'Manejo de redes sociales y contenido para pymes',
    metaDescripcion:
      'Estrategia, diseño, reels y publicación en Instagram, Facebook, LinkedIn y Google Business Profile. Constancia profesional e informe mensual de resultados.',
    h1: 'Marketing y contenido para las redes de tu empresa',
    intro: [
      'Publicar cada tanto no alcanza: la constancia es lo que genera confianza.',
      'Nos ocupamos de todo: calendario, diseño, edición de videos, textos y publicación. Vos nos pasás el material real de tus trabajos y cada mes te contamos qué funcionó y qué ajustamos.',
    ],
    paraQuien: [
      'Empresas que saben que tienen que publicar, pero no tienen tiempo.',
      'Marcas con las redes quietas o sin una línea visual clara.',
      'Empresas que venden a otras empresas y quieren generar confianza en LinkedIn.',
    ],
    planes: ['redes-esencial', 'integral', 'b2b-autoridad'],
    extras: ['reel-adicional', 'pieza-grafica'],
    preguntas: [
      deLaHome('¿Puedo contratar solo el marketing, sin web?'),
      deLaHome('¿Tengo que mandarles fotos y videos?'),
      {
        q: '¿Está incluida la publicidad paga?',
        a: 'No. La publicidad paga (Meta Ads o Google Ads) y su presupuesto no están incluidos en los planes.',
      },
      {
        q: '¿Hay que firmar por mucho tiempo?',
        a: 'No. El mínimo es de 3 meses, porque las redes necesitan constancia para mostrar resultados, y después seguís mes a mes.',
      },
    ],
    mensaje: 'Hola Lupa, quiero que se ocupen de las redes de mi empresa. ¿Me cuentan los planes?',
  },
  {
    id: 'sistemas-automatizaciones-ia',
    metaTitulo: 'Sistemas a medida, automatizaciones y bots con IA para pymes',
    metaDescripcion:
      'Si tu empresa se maneja con planillas, papeles y WhatsApp, lo ordenamos: sistemas de gestión a medida, bots de WhatsApp con IA, automatizaciones y tableros.',
    h1: 'Sistemas a medida, automatizaciones e IA para pymes',
    intro: [
      'Si tu empresa se maneja con planillas, papeles y grupos de WhatsApp, se pierde tiempo y se pierden datos.',
      'Primero entendemos cómo trabajás y después programamos: órdenes de trabajo, clientes, turnos o stock en un sistema hecho para tu empresa, conectado con las herramientas que ya usás.',
    ],
    paraQuien: [
      'Empresas que se organizan con planillas, papeles y grupos de WhatsApp.',
      'Equipos que pierden tiempo copiando datos de un lado a otro.',
      'Negocios que reciben muchas consultas repetidas por WhatsApp.',
    ],
    planes: ['a-medida'],
    extras: ['bot-whatsapp'],
    preguntas: [
      {
        q: '¿Cuánto cuesta un sistema a medida?',
        a: 'Depende de lo que necesites. Primero hacemos un relevamiento y después te pasamos una propuesta por escrito, con alcance, precio y plazos.',
      },
      {
        q: '¿Qué puede hacer un bot de WhatsApp con IA?',
        a: 'Responder las consultas frecuentes las 24 horas con la información de tu negocio, para que tu equipo se ocupe de lo que necesita una persona.',
      },
      {
        q: '¿Se puede conectar con lo que ya uso?',
        a: 'Sí. Automatizamos entre formularios, planillas, mail y CRM para que los datos no se copien a mano.',
      },
    ],
    mensaje: 'Hola Lupa, quiero ordenar los procesos de mi empresa con un sistema. ¿Lo charlamos?',
  },
];

export function getPaginaServicio(id: string): PaginaServicio | undefined {
  return paginasServicios.find((p) => p.id === id);
}
