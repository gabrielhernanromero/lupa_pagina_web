import { randomUUID } from 'node:crypto';

import { NextResponse } from 'next/server';

import { rejectIfNotAdmin } from '@/lib/admin-guard';
import { apiError } from '@/lib/blog/api';
import { BUCKET, adminClient } from '@/lib/blog/supabase';

/** Vercel acepta hasta 4,5 MB por pedido; el panel comprime las fotos antes de subirlas. */
const MAX_BYTES = 4 * 1024 * 1024;

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

/** Detecta el formato real por los primeros bytes (no confía en el nombre ni en el tipo que manda el navegador). */
function detectImageType(b: Uint8Array): string | null {
  const ascii = (start: number, end: number) => String.fromCharCode(...b.subarray(start, end));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x89 && ascii(1, 4) === 'PNG') return 'image/png';
  if (ascii(0, 4) === 'GIF8') return 'image/gif';
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  if (ascii(4, 8) === 'ftyp' && ['avif', 'avis'].includes(ascii(8, 12))) return 'image/avif';
  return null;
}

export async function POST(req: Request) {
  const denied = await rejectIfNotAdmin();
  if (denied) return denied;

  let file: FormDataEntryValue | null = null;
  try {
    file = (await req.formData()).get('file');
  } catch {
    return apiError('No llegó ninguna imagen.', 400);
  }
  if (!(file instanceof File) || file.size === 0) return apiError('No llegó ninguna imagen.', 400);
  if (file.size > MAX_BYTES) return apiError('La imagen pesa más de 4 MB. Probá con una más liviana.', 413);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectImageType(bytes);
  if (!type) return apiError('Formato no permitido. Usá JPG, PNG, WebP, GIF o AVIF.', 415);

  const now = new Date();
  const path = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${randomUUID()}.${EXT[type]}`;
  const storage = adminClient().storage.from(BUCKET);
  const { error } = await storage.upload(path, bytes, {
    contentType: type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) {
    console.error('[blog api] subir imagen:', error);
    return apiError('No se pudo subir la imagen. Probá de nuevo.', 500);
  }

  return NextResponse.json({ url: storage.getPublicUrl(path).data.publicUrl }, { status: 201 });
}
