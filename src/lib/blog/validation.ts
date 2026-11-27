import 'server-only';

import { z } from 'zod';

import { BLOCK_TYPES, type BlockType, type SavedBlocksPayload, type TemplateStructure } from './blocks';
import { sanitizeArticleHtml } from './sanitize';

/** Valida y normaliza lo que manda el panel antes de tocar la base. */

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const text = (max: number) => z.string().max(max);
/** Imágenes: links https (en desarrollo local también las del Supabase configurado, aunque sea http). */
const storageBase = process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL}/storage/v1/object/public/` : null;
const imageUrl = z
  .string()
  .trim()
  .max(1000)
  .refine(
    (v) => v === '' || (/^[^\s"'<>]+$/.test(v) && (v.startsWith('https://') || (!!storageBase && v.startsWith(storageBase)))),
    'Las imágenes tienen que ser links https.',
  );

const id = z.string().regex(/^[A-Za-z0-9_-]{1,40}$/);

export const structureSchema = z.object({
  rows: z
    .array(
      z.object({
        id,
        columns: z
          .array(
            z.object({
              id,
              span: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(12)]),
              block: z.object({
                type: z.enum(BLOCK_TYPES as [BlockType, ...BlockType[]]),
                config: z.record(z.string(), z.union([z.boolean(), z.number(), z.string().max(40)])),
              }),
            }),
          )
          .min(1)
          .max(3),
      }),
    )
    .max(60),
});

const contentSchema = z.object({
  html: text(100_000).optional(),
  image: imageUrl.optional(),
  imageAlt: text(200).optional(),
  images: z.array(imageUrl).max(40).optional(),
  title: text(200).optional(),
  subtitle: text(300).optional(),
  focalX: z.number().min(0).max(100).optional(),
  focalY: z.number().min(0).max(100).optional(),
  url: text(500).optional(),
  before: imageUrl.optional(),
  after: imageUrl.optional(),
  labelBefore: text(60).optional(),
  labelAfter: text(60).optional(),
  quote: text(1500).optional(),
  author: text(120).optional(),
  role: text(120).optional(),
  company: text(120).optional(),
  stats: z.array(z.object({ icon: text(16), value: text(40), label: text(120) })).max(12).optional(),
  sheet: z.array(z.object({ key: text(80), value: text(400) })).max(20).optional(),
});

const blocksSchema = z
  .object({ _s: structureSchema })
  .catchall(z.record(z.string(), contentSchema));

const postSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio.').max(200, 'El título es demasiado largo.'),
  slug: z
    .string()
    .trim()
    .min(1, 'La URL del artículo es obligatoria.')
    .max(100, 'La URL es demasiado larga.')
    .regex(SLUG_RE, 'La URL solo puede tener minúsculas, números y guiones.'),
  excerpt: z.string().trim().max(300, 'El resumen es demasiado largo.').nullish(),
  content: z.string().max(200_000).nullish(),
  blocks: blocksSchema.nullish(),
  cover_image: imageUrl.nullish(),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  published: z.boolean(),
  template_id: z.uuid().nullish(),
});

export interface PostInput {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  blocks: SavedBlocksPayload | null;
  cover_image: string | null;
  tags: string[];
  published: boolean;
  template_id: string | null;
}

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

function firstIssue(error: z.ZodError): string {
  const issue = error.issues[0];
  return issue?.message && !issue.message.startsWith('Invalid') ? issue.message : 'Hay datos inválidos en el artículo.';
}

function sanitizeBlocks(blocks: z.infer<typeof blocksSchema>): SavedBlocksPayload {
  const { _s, ...rows } = blocks;
  const out: Record<string, unknown> = { _s };
  for (const [rowId, cols] of Object.entries(rows)) {
    const cleanCols: Record<string, unknown> = {};
    for (const [colId, content] of Object.entries(cols as Record<string, z.infer<typeof contentSchema>>)) {
      cleanCols[colId] = {
        ...content,
        ...(content.html !== undefined ? { html: sanitizeArticleHtml(content.html) } : {}),
        ...(content.images ? { images: content.images.filter(Boolean) } : {}),
      };
    }
    out[rowId] = cleanCols;
  }
  return out as SavedBlocksPayload;
}

export function parsePostInput(body: unknown): Result<PostInput> {
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
  const p = parsed.data;
  const blocks = p.blocks ? sanitizeBlocks(p.blocks) : null;
  return {
    ok: true,
    data: {
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || null,
      // Un artículo es de texto o de bloques, nunca las dos cosas.
      content: blocks ? null : p.content ? sanitizeArticleHtml(p.content) : null,
      blocks,
      cover_image: p.cover_image || null,
      tags: Array.from(new Set(p.tags)),
      published: p.published,
      template_id: blocks ? (p.template_id ?? null) : null,
    },
  };
}

const templateSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio.').max(120),
  structure: structureSchema,
});

export function parseTemplateInput(body: unknown): Result<{ name: string; structure: TemplateStructure }> {
  const parsed = templateSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
  return { ok: true, data: parsed.data as { name: string; structure: TemplateStructure } };
}

export function isUuid(value: string): boolean {
  return z.uuid().safeParse(value).success;
}
