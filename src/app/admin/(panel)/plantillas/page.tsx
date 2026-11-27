import type { Metadata } from 'next';

import { TemplatesManager } from '@/components/admin/templates-manager';
import { requireAdmin } from '@/lib/admin-guard';
import { listTemplates } from '@/lib/blog/admin-queries';

export const metadata: Metadata = { title: 'Plantillas' };

export default async function TemplatesPage() {
  await requireAdmin();
  const templates = await listTemplates();
  return <TemplatesManager initial={templates} />;
}
