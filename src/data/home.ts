export const problemas = [
  { titulo: 'Te buscan y no aparecés.', texto: 'Si alguien googlea tu servicio en tu zona y aparece la competencia, ese cliente ya no es tuyo.' },
  { titulo: 'Tu web no trabaja para vos.', texto: 'No existe, está vieja, no se ve en el celular o nadie sabe cómo cambiarla.' },
  { titulo: 'Tus redes están quietas.', texto: 'Publicar cada tanto no alcanza: la constancia es lo que genera confianza.' },
];

export const pasos = [
  { numero: '01', titulo: 'Diagnóstico sin cargo', texto: 'Miramos tu web, tus redes y cómo aparecés en Google. Te decimos qué está bien, qué falta y qué haríamos primero.' },
  { numero: '02', titulo: 'Propuesta clara', texto: 'Qué incluye, cuánto sale y en cuánto tiempo. Por escrito.' },
  { numero: '03', titulo: 'Construcción', texto: 'Diseñamos, desarrollamos y armamos el contenido. Te mostramos avances.' },
  { numero: '04', titulo: 'Lanzamiento', texto: 'Publicamos, conectamos Google y te enseñamos a usar tu panel.' },
  { numero: '05', titulo: 'Medición y mejora', texto: 'Cada mes, números concretos y próximos pasos.' },
];

export type IconoBeneficio = 'equipo' | 'codigo' | 'llave' | 'numeros' | 'charla' | 'calendario';

export const beneficios: { icono: IconoBeneficio; titulo: string; texto: string }[] = [
  { icono: 'equipo', titulo: 'Un solo equipo', texto: 'La web y el marketing hablan el mismo idioma.' },
  { icono: 'codigo', titulo: 'Código propio, no plantillas', texto: 'Webs rápidas, seguras y hechas para vos.' },
  { icono: 'llave', titulo: 'La web es tuya', texto: 'Dominio y accesos a nombre de tu empresa.' },
  { icono: 'numeros', titulo: 'Números claros', texto: 'Cada mes sabés qué pasó y qué sigue.' },
  { icono: 'charla', titulo: 'Hablás con quien hace el trabajo', texto: 'Sin intermediarios ni ejecutivos de cuenta.' },
  { icono: 'calendario', titulo: 'Sin contratos eternos', texto: 'Mínimo 3 meses en marketing y después mes a mes.' },
];

export interface Integrante {
  nombre: string;
  iniciales: string;
  rol: string;
  bio: string;
  /** null → no se muestra el link. */
  linkedin: string | null;
  /** Dirección del gradiente del avatar. */
  gradiente: 'directo' | 'inverso';
}

/** PENDIENTE: [APELLIDO_PRISCILA], [LINKEDIN_PRISCILA] y fotos del equipo. */
export const equipo: Integrante[] = [
  {
    nombre: 'Gabriel Romero',
    iniciales: 'GR',
    rol: 'Desarrollo y sistemas',
    bio: 'Analista de Sistemas. Diseña y programa las webs, los paneles y los sistemas, y se ocupa de que Google los entienda.',
    linkedin: 'https://www.linkedin.com/in/gabrielromero-ia/',
    gradiente: 'directo',
  },
  {
    nombre: 'Priscila [APELLIDO_PRISCILA]',
    iniciales: 'P',
    rol: 'Marketing y contenido',
    bio: 'Planifica, diseña, edita y publica para que tu marca se vea constante y profesional.',
    linkedin: null,
    gradiente: 'inverso',
  },
];

/** Opciones de "¿Qué necesitás?" en el formulario. */
export const necesidades = ['Web', 'Marketing', 'Web + marketing', 'Sistema o automatización', 'No sé, quiero un diagnóstico'];
