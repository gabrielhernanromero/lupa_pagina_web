import { getPublishedPost } from '@/lib/blog/queries';
import { ogSize, renderOgImage, renderPostOgImage } from '@/lib/og';

export const alt = 'Artículo del blog de Lupa Servicios Digitales';
export const size = ogSize;
export const contentType = 'image/png';
export const revalidate = 3600;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPublishedPost((await params).slug);
  return post ? renderPostOgImage(post.title, post.tags[0]) : renderOgImage();
}
