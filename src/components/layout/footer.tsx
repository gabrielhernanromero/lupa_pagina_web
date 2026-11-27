import Link from 'next/link';

import { Logo } from '@/components/brand/logo';
import { WhatsAppLink } from '@/components/whatsapp-link';
import { mailtoHref, siteConfig } from '@/config/site';
import { servicios } from '@/data/servicios';

export function Footer() {
  const { redes } = siteConfig;
  return (
    <footer className="border-t border-line px-6 pb-8 pt-14">
      <div className="mx-auto flex max-w-site flex-col gap-10">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-8">
          <div className="flex flex-col gap-3.5">
            <Logo size={26} textClassName="text-lg" />
            <p className="m-0 text-sm leading-[1.6]">{siteConfig.lema}</p>
          </div>

          <nav aria-label="Secciones" className="flex flex-col gap-2.5 text-sm">
            {siteConfig.nav.map((item) => (
              <a key={item.href} href={item.href} className="w-fit text-body transition-colors hover:text-title">
                {item.label}
              </a>
            ))}
          </nav>

          <nav aria-label="Servicios" className="flex flex-col gap-2.5 text-sm">
            {servicios.map((s) => (
              <Link key={s.id} href={`/servicios/${s.id}`} className="w-fit text-body transition-colors hover:text-title">
                {s.titulo}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5 text-sm">
            <WhatsAppLink mensaje={siteConfig.mensajes.diagnostico} origen="footer" className="w-fit whitespace-nowrap">
              WhatsApp {siteConfig.whatsapp.display}
            </WhatsAppLink>
            <a href={mailtoHref} className="w-fit [overflow-wrap:normal] [word-break:normal]">
              contacto@
              <wbr />
              {siteConfig.domain}
            </a>
            <a href={siteConfig.url} className="w-fit whitespace-nowrap">
              {siteConfig.domain}
            </a>
            {redes.linkedin && (
              <a href={redes.linkedin} target="_blank" rel="noopener noreferrer" className="w-fit">
                LinkedIn
              </a>
            )}
            {redes.instagram && (
              <a href={redes.instagram} target="_blank" rel="noopener noreferrer" className="w-fit">
                Instagram
              </a>
            )}
          </div>

          <p className="m-0 text-sm leading-[1.6]">{siteConfig.ubicacion}</p>
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-line-soft pt-6 text-[13px] text-muted">
          <span>
            © {siteConfig.copyrightYear} {siteConfig.name}
          </span>
          <Link href="/privacidad" className="text-muted transition-colors hover:text-title">
            Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
