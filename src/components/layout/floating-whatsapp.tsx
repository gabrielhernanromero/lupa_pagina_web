import { MessageCircle } from 'lucide-react';

import { WhatsAppLink } from '@/components/whatsapp-link';
import { siteConfig } from '@/config/site';

export function FloatingWhatsApp() {
  return (
    <WhatsAppLink
      mensaje={siteConfig.mensajes.diagnostico}
      origen="flotante"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-[18px] right-[18px] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-diag shadow-float transition-transform duration-200 hover:scale-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
    >
      <MessageCircle className="h-[26px] w-[26px]" color="#060A13" strokeWidth={2} aria-hidden="true" />
    </WhatsAppLink>
  );
}
