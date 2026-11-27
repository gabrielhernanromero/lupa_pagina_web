import type { Metadata } from 'next';
import Link from 'next/link';

import { LogoMark } from '@/components/brand/logo';
import { SiteShell } from '@/components/layout/site-shell';
import { buttonVariants } from '@/components/ui/button';
import { WhatsAppLink } from '@/components/whatsapp-link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <SiteShell>
      <section className="relative px-6 py-[clamp(72px,12vw,140px)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.12),transparent_65%)]"
        />
        <div className="relative mx-auto flex max-w-[620px] flex-col items-center gap-6 text-center">
          <LogoMark size={72} />
          <p className="m-0 text-[13px] font-semibold uppercase tracking-[0.14em] text-teal">Error 404</p>
          <h1 className="m-0 text-balance font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.08] tracking-[-0.02em] text-title">
            Buscamos con lupa y <span className="text-gradient">esta página no está.</span>
          </h1>
          <p className="m-0 max-w-[480px] text-[17px] leading-[1.6]">
            Puede que el link esté mal escrito o que la página se haya movido. Volvé al inicio o escribinos y te
            ayudamos.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link href="/" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
              Volver al inicio
            </Link>
            <WhatsAppLink
              mensaje={siteConfig.mensajes.diagnostico}
              origen="404"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Escribinos por WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
