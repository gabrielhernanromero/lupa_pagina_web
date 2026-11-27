import { GoogleAnalytics } from '@next/third-parties/google';

import { FloatingWhatsApp } from '@/components/layout/floating-whatsapp';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

const gaId = process.env.NEXT_PUBLIC_GA_ID;

/** Estructura de la web pública: header, contenido, footer, botón de WhatsApp y GA4. El panel /admin no la usa. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* overflow-x: clip (no hidden) para no romper el header sticky */}
      <div className="min-h-screen overflow-x-clip">
        <a
          href="#contenido"
          className="sr-only z-[60] rounded-lg bg-brand px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
      </div>
      <FloatingWhatsApp />
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </>
  );
}
