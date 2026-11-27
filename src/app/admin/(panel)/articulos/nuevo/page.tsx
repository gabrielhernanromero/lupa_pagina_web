import type { Metadata } from 'next';

import { PostEditor } from '@/components/admin/post-editor';
import { requireAdmin } from '@/lib/admin-guard';
import { listTemplates } from '@/lib/blog/admin-queries';
import { listUsuarios } from '@/lib/blog/usuarios';

export const metadata: Metadata = { title: 'Nuevo artículo' };

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ plantilla?: string }> }) {
  const yo = await requireAdmin();
  const [{ plantilla }, templates, usuarios] = await Promise.all([searchParams, listTemplates(), listUsuarios()]);
  const autores = usuarios.filter((u) => u.activo).map((u) => ({ id: u.id, nombre: u.nombre }));
  return <PostEditor templates={templates} initialTemplate={plantilla} autores={autores} usuarioActual={yo.id} />;
}
