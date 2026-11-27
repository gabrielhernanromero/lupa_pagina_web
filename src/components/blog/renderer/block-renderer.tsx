import { ArticleHeader, type ArticleMeta } from '@/components/blog/article-header';
import {
  hasBlockContent,
  type BlockContent,
  type BlockType,
  type HeroConfig,
  type HeroContent,
  type PostBlocks,
  type Row,
  type TemplateStructure,
} from '@/lib/blog/blocks';
import { cn } from '@/lib/utils';
import { BeforeAfterBlock, CarouselBlock } from './interactive-blocks';
import {
  GalleryBlock,
  ProjectSheetBlock,
  StatsBlock,
  TestimonialBlock,
  TextBlock,
  TextImageBlock,
  VideoBlock,
} from './static-blocks';

interface BlockRendererProps {
  structure: TemplateStructure;
  blocks: PostBlocks;
  meta: ArticleMeta & { lead?: string | null };
  preview?: boolean;
}

const SPAN: Record<number, string> = {
  4: 'md:col-span-4',
  6: 'md:col-span-6',
  8: 'md:col-span-8',
  12: 'md:col-span-12',
};

/** Bloques de lectura: en una fila sola quedan angostos, como el texto. */
const NARROW = new Set<BlockType>(['text', 'testimonial', 'project_sheet']);

function renderBlock(type: BlockType, config: Record<string, unknown>, content: BlockContent) {
  const c = content as never;
  const cfg = config as never;
  switch (type) {
    case 'text':
      return <TextBlock content={c} />;
    case 'text_image':
      return <TextImageBlock content={c} config={cfg} />;
    case 'gallery':
      return <GalleryBlock content={c} config={cfg} />;
    case 'carousel':
      return <CarouselBlock content={c} config={cfg} />;
    case 'stats':
      return <StatsBlock content={c} />;
    case 'video':
      return <VideoBlock content={c} config={cfg} />;
    case 'before_after':
      return <BeforeAfterBlock content={c} />;
    case 'testimonial':
      return <TestimonialBlock content={c} />;
    case 'project_sheet':
      return <ProjectSheetBlock content={c} />;
    default:
      return null;
  }
}

function isHeroRow(row: Row) {
  return row.columns.length === 1 && row.columns[0].block.type === 'hero';
}

/** Arma un artículo con bloques. Si no empieza con una Portada, igual muestra el título arriba. */
export function BlockRenderer({ structure, blocks, meta, preview = false }: BlockRendererProps) {
  const hasHero = structure.rows.some(isHeroRow);
  return (
    <div className="flex flex-col pb-4">
      {!hasHero && <ArticleHeader {...meta} preview={preview} />}
      {structure.rows.map((row, index) => {
        if (isHeroRow(row)) {
          const col = row.columns[0];
          const content = (blocks[row.id]?.[col.id] ?? {}) as HeroContent;
          const config = col.block.config as unknown as HeroConfig;
          // Solo la primera Portada lleva el título del artículo (un único h1).
          const first = structure.rows.findIndex(isHeroRow) === index;
          return first ? (
            <ArticleHeader
              key={row.id}
              {...meta}
              title={meta.title || content.title}
              lead={content.subtitle || meta.lead}
              image={content.image}
              focalX={content.focalX}
              focalY={content.focalY}
              overlay={config.overlay}
              preview={preview}
            />
          ) : null;
        }

        // Las columnas vacías no se muestran; si queda una sola, ocupa todo el ancho.
        const columns = row.columns.filter((col) =>
          hasBlockContent(col.block.type, blocks[row.id]?.[col.id] as BlockContent | undefined),
        );
        if (columns.length === 0) return null;
        const single = columns.length === 1;
        const narrow = single && NARROW.has(columns[0].block.type);
        return (
          <div key={row.id} className="px-6 pt-[clamp(28px,4vw,40px)]">
            <div
              className={cn(
                'mx-auto grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8',
                narrow ? 'max-w-[760px]' : 'max-w-[1040px]',
              )}
            >
              {columns.map((col) => (
                <div key={col.id} className={cn('min-w-0', single ? 'md:col-span-12' : (SPAN[col.span] ?? 'md:col-span-12'))}>
                  {renderBlock(col.block.type, col.block.config, (blocks[row.id]?.[col.id] ?? {}) as BlockContent)}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
