import { MessageCircle } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { WhatsAppLink } from '@/components/whatsapp-link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

/** Llamado a la acción al final de cada artículo. */
export function BlogCta({ title, className }: { title?: string; className?: string }) {
  return (
    <aside
      className={cn(
        'relative overflow-hidden rounded-[22px] border border-teal/25 bg-surface px-7 py-10 text-center md:px-12',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[min(560px,100%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.18),transparent_70%)]"
      />
      <p className="relative m-0 text-[13px] font-semibold uppercase tracking-[0.14em] text-teal">¿Lo aplicamos en tu negocio?</p>
      <p className="relative mx-auto mt-3 max-w-[520px] text-balance font-display text-[clamp(22px,3vw,30px)] font-bold leading-[1.2] text-title">
        {siteConfig.lema}
      </p>
      <p className="relative mx-auto mt-3 max-w-[480px] text-[16px] leading-[1.6]">
        Contanos qué hacés y te decimos por dónde empezar. El diagnóstico inicial es sin cargo.
      </p>
      <WhatsAppLink
        mensaje={title ? siteConfig.mensajes.blog(title) : siteConfig.mensajes.diagnostico}
        origen="blog"
        className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'relative mt-7')}
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        Escribinos por WhatsApp
      </WhatsAppLink>
    </aside>
  );
}
