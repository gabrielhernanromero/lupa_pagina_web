import { NextResponse } from 'next/server';

import { rejectIfNotAdmin } from '@/lib/admin-guard';
import { apiError, dbError, readJson } from '@/lib/blog/api';
import { TABLES, adminClient } from '@/lib/blog/supabase';
import { parseTemplateInput } from '@/lib/blog/validation';

/** Listar plantillas. */
export async function GET() {
  const denied = await rejectIfNotAdmin();
  if (denied) return denied;
  const { data, error } = await adminClient()
    .from(TABLES.templates)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return dbError('listar plantillas', error);
  return NextResponse.json(data);
}

/** Guardar una plantilla nueva. */
export async function POST(req: Request) {
  const denied = await rejectIfNotAdmin();
  if (denied) return denied;

  const parsed = parseTemplateInput(await readJson(req));
  if (!parsed.ok) return apiError(parsed.error, 400);

  const { data, error } = await adminClient().from(TABLES.templates).insert(parsed.data).select('*').single();
  if (error) return dbError('crear plantilla', error);
  return NextResponse.json(data, { status: 201 });
}
