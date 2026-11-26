import { siteConfig } from '@/config/site';

/** Arma el link de wa.me con el mensaje precargado. */
export function buildWhatsAppUrl(mensaje?: string): string {
  const base = `https://wa.me/${siteConfig.whatsapp.number}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
