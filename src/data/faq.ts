export interface PreguntaFrecuente {
  q: string;
  a: string;
}

/** Alimenta el acordeón de #preguntas y el JSON-LD FAQPage. */
export const faq: PreguntaFrecuente[] = [
  { q: '¿Puedo contratar solo el marketing, sin web?', a: 'Sí. Redes Esencial e Integral funcionan sin web. Si más adelante querés una, la sumás.' },
  { q: '¿Y solo la web?', a: 'Sí. Elegís el plan, te la entregamos y el mantenimiento es opcional.' },
  { q: '¿Tengo que pagar mantenimiento sí o sí?', a: 'No. Si no lo contratás, te entregamos todos los accesos y la web queda a tu cargo. Si después necesitás cambios, los cotizamos por hora.' },
  { q: '¿A nombre de quién quedan el dominio y la web?', a: 'De tu empresa. Siempre.' },
  { q: '¿Me garantizan el primer puesto en Google?', a: 'No, y desconfiá de quien lo garantice. Hacemos todo lo que depende de nosotros para que aparezcas y te mostramos los números cada mes.' },
  { q: '¿Qué es GEO?', a: 'Es preparar tu web para los buscadores con inteligencia artificial (ChatGPT, Gemini, Perplexity, las respuestas con IA de Google), para que entiendan qué hacés y puedan recomendarte.' },
  { q: '¿Cuándo se ven los resultados?', a: 'La web, en días. Google y las redes, en meses: lo que suma es la constancia. Por eso los planes mensuales tienen un mínimo de 3 meses.' },
  // PENDIENTE: completar [FACTURACIÓN]
  { q: '¿Cómo se paga?', a: 'Web: 50% al empezar y 50% al entregar, o en 3 pagos. Planes mensuales: por adelantado, del 1 al 10 de cada mes. Transferencia o Mercado Pago. [FACTURACIÓN: completar]' },
  { q: '¿Tengo que mandarles fotos y videos?', a: 'Sí: el material real de tus trabajos es lo que más confianza genera. Te decimos qué sacar y cómo, con el celular alcanza.' },
  { q: '¿Ya tengo web, la pueden mejorar?', a: 'Sí. La diagnosticamos sin cargo y te decimos si conviene mejorarla o rehacerla.' },
  { q: '¿Trabajan solo en Zona Oeste?', a: 'Estamos en Zona Oeste del Gran Buenos Aires y trabajamos con empresas de todo el país de forma remota.' },
];
