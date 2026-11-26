'use client';

import { trackEvent, type OrigenWhatsApp } from '@/lib/analytics';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

interface WhatsAppLinkProps extends Omit<React.ComponentProps<'a'>, 'href' | 'target' | 'rel'> {
  mensaje: string;
  origen: OrigenWhatsApp;
  /** Parámetros extra para GA4 (ej. { plan: 'Profesional' }). */
  params?: Record<string, string>;
}

/** Link a WhatsApp con mensaje precargado que registra `click_whatsapp` en GA4. */
export function WhatsAppLink({ mensaje, origen, params, onClick, children, ...props }: WhatsAppLinkProps) {
  return (
    <a
      href={buildWhatsAppUrl(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        trackEvent('click_whatsapp', { origen, ...params });
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
