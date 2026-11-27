import type { Metadata } from 'next';

import { PostEditor } from '@/components/admin/post-editor';
import { requireAdmin } from '@/lib/admin-guard';
import { listTemplates } from '@/lib/blog/admin-queries';

export const metadata: Metadata = { title: 'Nuevo artículo' };

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ plantilla?: string }> }) {
  await requireAdmin();
  const [{ plantilla }, templates] = await Promise.all([searchParams, listTemplates()]);
  return <PostEditor templates={templates} initialTemplate={plantilla} />;
}
