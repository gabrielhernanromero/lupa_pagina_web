export type OrigenWhatsApp =
  | 'header'
  | 'hero'
  | 'plan'
  | 'casos'
  | 'footer'
  | 'flotante'
  | 'formulario'
  | '404'
  | 'blog';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Envía un evento a GA4 si está cargado. Sin GA, no hace nada. */
export function trackEvent(name: string, params: Record<string, string> = {}): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}
