'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Logo } from '@/components/brand/logo';
import { WhatsAppLink } from '@/components/whatsapp-link';
import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { MobileMenu } from './mobile-menu';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-[14px] transition-[background-color,border-color] duration-300',
        scrolled ? 'border-line bg-[rgba(6,10,19,0.82)]' : 'border-transparent bg-[rgba(6,10,19,0)]',
      )}
    >
      <div className="mx-auto flex max-w-site items-center justify-between gap-6 px-6 py-3.5">
        <Link href="/#inicio" aria-label="Lupa Servicios Digitales, inicio" className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 text-sm min-[860px]:flex">
          {siteConfig.nav.map((item) => (
            <a key={item.href} href={item.href} className="text-body transition-colors hover:text-title">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <WhatsAppLink
            mensaje={siteConfig.mensajes.diagnostico}
            origen="header"
            className={buttonVariants({ variant: 'primary', size: 'sm' })}
          >
            Escribinos
          </WhatsAppLink>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
