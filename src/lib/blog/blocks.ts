import {
  ChartColumn,
  ClipboardList,
  Columns2,
  GalleryHorizontalEnd,
  Image as ImageIcon,
  LayoutGrid,
  MessageSquareQuote,
  Newspaper,
  PenLine,
  Video,
  type LucideIcon,
} from 'lucide-react';

/**
 * Artículos con bloques: la estructura (filas y columnas) se guarda junto al
 * contenido de cada bloque en `posts.blocks`, con este formato:
 *   { "_s": { rows: [...] }, "<rowId>": { "<colId>": { ...contenido } } }
 */

export type BlockType =
  | 'hero'
  | 'text'
  | 'text_image'
  | 'gallery'
  | 'carousel'
  | 'stats'
  | 'video'
  | 'before_after'
  | 'testimonial'
  | 'project_sheet';

// ---- Configuración de cada bloque (vive en la estructura / plantilla) ----

export interface HeroConfig {
  overlay: boolean;
}
export interface CarouselConfig {
  autoplay: boolean;
  interval: number;
  effect: 'slide' | 'fade';
}
export interface TextImageConfig {
  imagePosition: 'left' | 'right';
}
export interface GalleryConfig {
  columns: 2 | 3;
}
export interface VideoConfig {
  autoplay: boolean;
}

export type BlockConfig = Record<string, unknown>;

export interface Block {
  type: BlockType;
  config: BlockConfig;
}

export type ColumnSpan = 4 | 6 | 8 | 12;

export interface Column {
  id: string;
  span: ColumnSpan;
  block: Block;
}

export interface Row {
  id: string;
  columns: Column[];
}

export interface TemplateStructure {
  rows: Row[];
}

// ---- Contenido de cada bloque (lo que se carga en cada artículo) ----

export interface StatItem {
  icon: string;
  value: string;
  label: string;
}
export interface SheetItem {
  key: string;
  value: string;
}

export interface HeroContent {
  image?: string;
  title?: string;
  subtitle?: string;
  focalX?: number;
  focalY?: number;
}
export interface TextContent {
  html?: string;
}
export interface TextImageContent {
  html?: string;
  image?: string;
  imageAlt?: string;
}
export interface GalleryContent {
  images?: string[];
}
export interface CarouselContent {
  images?: string[];
}
export interface StatsContent {
  stats?: StatItem[];
}
export interface VideoContent {
  url?: string;
}
export interface BeforeAfterContent {
  before?: string;
  after?: string;
  labelBefore?: string;
  labelAfter?: string;
}
export interface TestimonialContent {
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
}
export interface ProjectSheetContent {
  sheet?: SheetItem[];
}

export type BlockContent =
  | HeroContent
  | TextContent
  | TextImageContent
  | GalleryContent
  | CarouselContent
  | StatsContent
  | VideoContent
  | BeforeAfterContent
  | TestimonialContent
  | ProjectSheetContent;

/** Contenido por fila y columna: blocks[rowId][colId]. */
export type PostBlocks = Record<string, Record<string, BlockContent>>;

/** Formato guardado en la base: estructura en "_s" + contenido. */
export type SavedBlocksPayload = { _s: TemplateStructure } & Record<string, unknown>;

export function splitSavedBlocks(saved: SavedBlocksPayload | null | undefined): {
  structure: TemplateStructure | null;
  blocks: PostBlocks;
} {
  if (!saved || typeof saved !== 'object' || !saved._s) return { structure: null, blocks: {} };
  const { _s, ...rest } = saved;
  return { structure: _s, blocks: rest as PostBlocks };
}

export function joinSavedBlocks(structure: TemplateStructure, blocks: PostBlocks): SavedBlocksPayload {
  // Solo se guarda el contenido de filas y columnas que siguen existiendo.
  const clean: PostBlocks = {};
  for (const row of structure.rows) {
    for (const col of row.columns) {
      const content = blocks[row.id]?.[col.id];
      if (content) (clean[row.id] ??= {})[col.id] = content;
    }
  }
  return { _s: structure, ...clean };
}

/** ¿El bloque tiene algo para mostrar? Los bloques vacíos no se muestran en el blog. */
export function hasBlockContent(type: BlockType, content: BlockContent | undefined): boolean {
  if (!content) return false;
  const c = content as Record<string, unknown>;
  const text = (v: unknown) => typeof v === 'string' && v.replace(/<[^>]*>/g, '').trim() !== '';
  switch (type) {
    case 'hero':
      return true; // la portada siempre muestra el título
    case 'text':
      return text(c.html) || (typeof c.html === 'string' && c.html.includes('<img'));
    case 'text_image':
      return text(c.html) || text(c.image);
    case 'gallery':
    case 'carousel':
      return Array.isArray(c.images) && c.images.length > 0;
    case 'video':
      return text(c.url);
    case 'before_after':
      return text(c.before) && text(c.after);
    case 'testimonial':
      return text(c.quote);
    case 'stats':
      return Array.isArray(c.stats) && (c.stats as StatItem[]).some((s) => s.value || s.label);
    case 'project_sheet':
      return Array.isArray(c.sheet) && (c.sheet as SheetItem[]).some((s) => s.key && s.value);
    default:
      return false;
  }
}

// ---- Paleta de bloques ----

export interface BlockMeta {
  label: string;
  description: string;
  icon: LucideIcon;
  defaultConfig: BlockConfig;
}

export const BLOCK_META: Record<BlockType, BlockMeta> = {
  hero: {
    label: 'Portada',
    description: 'Imagen grande con título y bajada',
    icon: ImageIcon,
    defaultConfig: { overlay: true },
  },
  text: {
    label: 'Texto',
    description: 'Editor de texto con formato',
    icon: PenLine,
    defaultConfig: {},
  },
  text_image: {
    label: 'Texto + imagen',
    description: 'Texto al lado de una imagen',
    icon: Newspaper,
    defaultConfig: { imagePosition: 'right' },
  },
  gallery: {
    label: 'Galería',
    description: 'Grilla de imágenes de 2 o 3 columnas',
    icon: LayoutGrid,
    defaultConfig: { columns: 3 },
  },
  carousel: {
    label: 'Carrusel',
    description: 'Varias imágenes que pasan solas',
    icon: GalleryHorizontalEnd,
    defaultConfig: { autoplay: true, interval: 4000, effect: 'slide' },
  },
  stats: {
    label: 'Resultados',
    description: 'Cifras grandes: visitas, consultas, puestos',
    icon: ChartColumn,
    defaultConfig: {},
  },
  video: {
    label: 'Video',
    description: 'Video de YouTube o Vimeo',
    icon: Video,
    defaultConfig: { autoplay: false },
  },
  before_after: {
    label: 'Antes / después',
    description: 'Comparador deslizable de dos imágenes',
    icon: Columns2,
    defaultConfig: {},
  },
  testimonial: {
    label: 'Testimonio',
    description: 'Cita destacada de un cliente',
    icon: MessageSquareQuote,
    defaultConfig: {},
  },
  project_sheet: {
    label: 'Ficha del proyecto',
    description: 'Cliente, rubro, servicios, plazo…',
    icon: ClipboardList,
    defaultConfig: {},
  },
};

export const BLOCK_TYPES = Object.keys(BLOCK_META) as BlockType[];

export function newId(prefix: string): string {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}
