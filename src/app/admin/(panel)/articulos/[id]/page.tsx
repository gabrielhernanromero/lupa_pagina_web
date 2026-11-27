import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PostEditor } from '@/components/admin/post-editor';
import { requireAdmin } from '@/lib/admin-guard';
import { getPostById, listTemplates } from '@/lib/blog/admin-queries';
import { listUsuarios } from '@/lib/blog/usuarios';
import { isUuid } from '@/lib/blog/validation';

export const metadata: Metadata = { title: 'Editar artículo' };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [post, templates, usuarios] = await Promise.all([getPostById(id), listTemplates(), listUsuarios()]);
  if (!post) notFound();
  // Activos, más el autor actual aunque esté desactivado (para no perder la firma al guardar).
  const autores = usuarios
    .filter((u) => u.activo || u.id === post.author_id)
    .map((u) => ({ id: u.id, nombre: u.nombre }));
  return <PostEditor post={post} templates={templates} autores={autores} />;
}
