import Image, { type ImageProps } from 'next/image';

/** Las imágenes de Supabase pasan por el optimizador de Next; cualquier otra se muestra tal cual. */
export function isOptimizableImage(src: string): boolean {
  try {
    const { protocol, hostname, pathname } = new URL(src);
    return protocol === 'https:' && hostname.endsWith('.supabase.co') && pathname.startsWith('/storage/v1/object/public/');
  } catch {
    return false;
  }
}

export function BlogImage({ src, alt, ...props }: Omit<ImageProps, 'src'> & { src: string }) {
  return <Image src={src} alt={alt} unoptimized={!isOptimizableImage(src)} {...props} />;
}
