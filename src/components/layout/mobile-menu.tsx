'use client';

import { useRef, useState } from 'react';
import { Menu } from 'lucide-react';

import { Logo } from '@/components/brand/logo';
import { WhatsAppLink } from '@/components/whatsapp-link';
import { buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

/** Navega a un ancla "/#seccion": en la home scrollea, en otras páginas va a la home. */
function goTo(href: string) {
  const [path, hash] = href.split('#');
  const target = hash ? document.getElementById(hash) : null;
  if ((path === '' || path === window.location.pathname) && target) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', `#${hash}`);
  } else {
    window.location.assign(href);
  }
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pending = useRef<string | null>(null);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Abrir menú"
        className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-white/[0.12] text-title transition-colors hover:border-teal/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal min-[860px]:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="top"
        className="px-6 pb-6 pt-3.5"
        onCloseAutoFocus={(e) => {
          // Si se eligió una sección, scrolleamos ahí en vez de devolver el foco al botón.
          if (pending.current) {
            e.preventDefault();
            const href = pending.current;
            pending.current = null;
            goTo(href);
          }
        }}
      >
        <div className="flex h-[42px] items-center">
          <Logo />
        </div>
        <SheetTitle className="sr-only">Menú</SheetTitle>
        <SheetDescription className="sr-only">Secciones del sitio</SheetDescription>
        <nav aria-label="Principal" className="mt-4 flex flex-col">
          {siteConfig.nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                pending.current = item.href;
                setOpen(false);
              }}
              className={cn(
                'py-3.5 text-[17px] text-title transition-colors hover:text-teal',
                i < siteConfig.nav.length - 1 && 'border-b border-line-soft',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <WhatsAppLink
          mensaje={siteConfig.mensajes.diagnostico}
          origen="header"
          onClick={() => setOpen(false)}
          className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'mt-5 w-full')}
        >
          Escribinos por WhatsApp
        </WhatsAppLink>
      </SheetContent>
    </Sheet>
  );
}
