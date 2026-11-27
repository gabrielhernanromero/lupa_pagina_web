import type { BlockConfig, BlockType, ColumnSpan, Row, TemplateStructure } from './blocks';
import { BLOCK_META } from './blocks';

/** Plantillas prediseñadas: siempre disponibles en el editor, sin tener que guardarlas. */

export interface Preset {
  id: string;
  name: string;
  description: string;
  structure: TemplateStructure;
}

type Cell = BlockType | [BlockType, BlockConfig] | [BlockType, BlockConfig, ColumnSpan];

function build(...rows: (Cell | Cell[])[]): TemplateStructure {
  return {
    rows: rows.map((r, i): Row => {
      const cells = Array.isArray(r) && Array.isArray(r[0]) ? (r as Cell[]) : [r as Cell];
      const even = (12 / cells.length) as ColumnSpan;
      return {
        id: `r${i + 1}`,
        columns: cells.map((cell, j) => {
          const [type, config, span] = typeof cell === 'string' ? [cell, undefined, undefined] : cell;
          return {
            id: `c${j + 1}`,
            span: span ?? even,
            block: { type, config: { ...BLOCK_META[type].defaultConfig, ...config } },
          };
        }),
      };
    }),
  };
}

const left = { imagePosition: 'left' };
const right = { imagePosition: 'right' };

export const PRESETS: Preset[] = [
  {
    id: 'preset-caso-cliente',
    name: 'Caso de cliente',
    description: 'Portada · Resultados · Contexto · Antes/después · Proceso · Ficha + testimonio · Galería',
    structure: build(
      'hero',
      'stats',
      'text',
      'before_after',
      ['text_image', right],
      [
        ['project_sheet', {}],
        ['testimonial', {}],
      ],
      ['gallery', { columns: 3 }],
    ),
  },
  {
    id: 'preset-guia-pasos',
    name: 'Guía paso a paso',
    description: 'Portada · Introducción · Paso 1 · Paso 2 · Paso 3 · Cierre',
    structure: build('hero', 'text', ['text_image', right], ['text_image', left], ['text_image', right], 'text'),
  },
  {
    id: 'preset-rediseno-web',
    name: 'Rediseño de una web',
    description: 'Portada · Situación inicial · Antes/después · Resultados + texto · Carrusel · Testimonio',
    structure: build(
      'hero',
      'text',
      'before_after',
      [
        ['stats', {}],
        ['text', {}],
      ],
      ['carousel', { effect: 'slide' }],
      'testimonial',
    ),
  },
  {
    id: 'preset-seo-extenso',
    name: 'Artículo SEO extenso',
    description: 'Portada · Introducción · Datos · Punto 1 · Punto 2 · Galería · Punto 3 · Conclusión',
    structure: build(
      'hero',
      'text',
      'stats',
      ['text_image', right],
      ['text_image', left],
      ['gallery', { columns: 2 }],
      ['text_image', right],
      'text',
    ),
  },
  {
    id: 'preset-consejos',
    name: 'Lista de consejos',
    description: 'Portada · Introducción · Consejos · Ejemplo con imagen · Conclusión',
    structure: build('hero', 'text', 'text', ['text_image', left], 'text'),
  },
  {
    id: 'preset-video',
    name: 'Video explicado',
    description: 'Portada · Contexto · Video · Puntos clave · Testimonio',
    structure: build('hero', 'text', 'video', 'text', 'testimonial'),
  },
  {
    id: 'preset-comparativa',
    name: 'Comparativa',
    description: 'Portada · Introducción · Opción A | Opción B · Datos · Conclusión',
    structure: build(
      'hero',
      'text',
      [
        ['text', {}],
        ['text', {}],
      ],
      'stats',
      'text',
    ),
  },
  {
    id: 'preset-portfolio',
    name: 'Portfolio visual',
    description: 'Portada · Texto · Carrusel · Resultados · Galería · Ficha + testimonio',
    structure: build(
      'hero',
      'text',
      'carousel',
      'stats',
      ['gallery', { columns: 3 }],
      [
        ['project_sheet', {}],
        ['testimonial', {}],
      ],
    ),
  },
  {
    id: 'preset-entrevista',
    name: 'Entrevista a un cliente',
    description: 'Portada · Presentación · Cita destacada · Conversación · Texto + imagen · Ficha',
    structure: build('hero', 'text', 'testimonial', 'text', ['text_image', right], 'project_sheet'),
  },
  {
    id: 'preset-novedad',
    name: 'Novedad o anuncio',
    description: 'Portada · Cuerpo · Contexto con imagen · Cierre',
    structure: build('hero', 'text', ['text_image', left], 'text'),
  },
];

/** Copia independiente, para editar la estructura sin modificar la plantilla original. */
export function cloneStructure(structure: TemplateStructure): TemplateStructure {
  return JSON.parse(JSON.stringify(structure)) as TemplateStructure;
}
