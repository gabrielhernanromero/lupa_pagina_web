import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';

import { GradientDefs } from '@/components/brand/gradient-defs';
import { FloatingWhatsApp } from '@/components/layout/floating-whatsapp';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { MotionProvider } from '@/components/motion/motion-provider';
import { siteConfig } from '@/config/site';
import './globals.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: '#060A13',
  colorScheme: 'dark',
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${sora.variable} ${inter.variable}`}>
      <head>
        {/* Sin JavaScript, el contenido con animación de entrada se muestra igual. */}
        <noscript>
          <style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body>
        <GradientDefs />
        <MotionProvider>
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
        </MotionProvider>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
