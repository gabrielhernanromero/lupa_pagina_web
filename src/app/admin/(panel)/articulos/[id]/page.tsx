import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PostEditor } from '@/components/admin/post-editor';
import { requireAdmin } from '@/lib/admin-guard';
import { getPostById, listTemplates } from '@/lib/blog/admin-queries';
import { isUuid } from '@/lib/blog/validation';

export const metadata: Metadata = { title: 'Editar artículo' };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [post, templates] = await Promise.all([getPostById(id), listTemplates()]);
  if (!post) notFound();
  return <PostEditor post={post} templates={templates} />;
}
