/**
 * Sube una imagen al blog. Antes de subirla la achica (máx. 2000 px) y la pasa a WebP
 * en el navegador: las fotos del celular pesan varios MB y Vercel acepta hasta 4,5 MB.
 */

const MAX_SIDE = 2000;

async function prepareImage(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file; // GIF (animado) y AVIF van tal cual
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 800 * 1024) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Ese archivo no es una imagen.');
  const blob = await prepareImage(file);
  const form = new FormData();
  form.append('file', blob, file.name);
  const res = await fetch('/api/upload', { method: 'POST', body: form });
  const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !body.url) {
    throw new Error(res.status === 401 ? 'Tu sesión venció. Volvé a ingresar.' : body.error || 'No se pudo subir la imagen.');
  }
  return body.url;
}
