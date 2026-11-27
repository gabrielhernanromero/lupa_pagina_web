import type { SavedBlocksPayload, TemplateStructure } from './blocks';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  blocks: SavedBlocksPayload | null;
  cover_image: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
  template_id: string | null;
  created_at: string;
  updated_at: string;
}

/** Campos que necesitan el listado y las cards (sin el contenido completo). */
export type PostSummary = Pick<
  Post,
  'id' | 'title' | 'slug' | 'excerpt' | 'cover_image' | 'tags' | 'published' | 'published_at' | 'created_at' | 'updated_at'
>;

export const POST_SUMMARY_FIELDS =
  'id, title, slug, excerpt, cover_image, tags, published, published_at, created_at, updated_at';

export interface PostTemplate {
  id: string;
  name: string;
  structure: TemplateStructure;
  created_at: string;
}
