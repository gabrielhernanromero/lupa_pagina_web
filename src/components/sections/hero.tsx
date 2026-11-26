import { MessageCircle, Search } from 'lucide-react';

import { GradientText } from '@/components/section';
import { WhatsAppLink } from '@/components/whatsapp-link';
import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

/** El hero no usa Reveal: está arriba del pliegue y es el LCP. */
export function Hero() {
  return (
    <section id="inicio" className="relative px-6 pb-[clamp(64px,8vw,104px)] pt-[clamp(56px,9vw,112px)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[120px] -top-[160px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.14),transparent_65%)]"
      />
      <div className="relative mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-14">
        <div className="flex flex-col gap-6">
          <h1 className="m-0 text-balance font-display text-[clamp(38px,6vw,64px)] font-bold leading-[1.05] tracking-[-0.02em] text-title">
            Tu trabajo ya es bueno. <GradientText>Que se note.</GradientText>
          </h1>
          <p className="m-0 max-w-[540px] text-pretty text-[clamp(17px,1.6vw,19px)] leading-[1.6]">
            Web, Google y redes para pymes de servicios. Un solo equipo de desarrollo y marketing para que te
            encuentren, te vean serio y te escriban.
          </p>
          <div className="mt-1 flex flex-wrap gap-3">
            <WhatsAppLink
              mensaje={siteConfig.mensajes.diagnostico}
              origen="hero"
              className={buttonVariants({ variant: 'primary', size: 'lg' })}
            >
              <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
              Hablemos por WhatsApp
            </WhatsAppLink>
            <a href="#planes" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              Ver planes
            </a>
          </div>
          <p className="m-0 text-[13px] text-muted">Diagnóstico inicial sin cargo · Te respondemos en el día hábil</p>
        </div>

        <SearchMock />
      </div>
    </section>
  );
}

function ResultadoBorroso({ dominio, titulo, texto }: { dominio: string; titulo: string; texto: string }) {
  return (
    <div className="flex flex-col gap-1 opacity-40 blur-[0.6px]">
      <div className="text-xs text-muted">{dominio}</div>
      <div className="text-base text-[#7DA7E8]">{titulo}</div>
      <div className="text-[13px]">{texto}</div>
    </div>
  );
}

/** Mock de resultados de búsqueda: "Tu empresa" nítido, el resto desenfocado, y la lupa encima. */
function SearchMock() {
  return (
    <div
      className="relative w-full max-w-[500px] justify-self-center"
      role="img"
      aria-label="Ejemplo de resultados de búsqueda en Google donde tu empresa aparece destacada entre la competencia"
    >
      <div className="flex flex-col gap-[18px] rounded-[20px] border border-line bg-surface p-[22px] shadow-mock" aria-hidden="true">
        <div className="flex items-center gap-2.5 rounded-full border border-line bg-surface-2 px-4 py-[11px]">
          <Search className="h-4 w-4 shrink-0 text-muted" strokeWidth={2} />
          <span className="text-sm text-list">control de plagas industrial zona oeste</span>
        </div>
        <ResultadoBorroso
          dominio="competencia-sa.com.ar"
          titulo="Control de plagas | Competencia S.A."
          texto="Servicios para empresas e industrias. Consultá..."
        />
        <div className="-mx-2 flex flex-col gap-[5px] rounded-[14px] bg-teal/[0.06] px-4 py-3.5">
          <div className="text-xs text-body">tuempresa.com.ar</div>
          <div className="font-display text-lg font-semibold text-title">Tu empresa | Control de plagas industrial</div>
          <div className="text-[13px] text-list">Atención en todo el AMBA. Pedí tu presupuesto por WhatsApp.</div>
          <div className="flex items-center gap-1.5 text-xs text-teal">
            ★★★★★ <span className="text-body">Ficha de Google verificada</span>
          </div>
        </div>
        <ResultadoBorroso
          dominio="directorio-servicios.com"
          titulo="Las 10 mejores empresas de control de plagas"
          texto="Compará precios y opiniones de proveedores..."
        />
      </div>

      {/* Lente flotante */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-[18px] top-24 h-[200px] w-[200px] animate-lupa-float">
        <div className="lens-ring absolute inset-0 rounded-full bg-brand-diag p-1" />
        <div className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.10),rgba(56,189,248,0.04)_60%)] shadow-[0_0_60px_rgba(45,212,191,0.25)]" />
        <div className={cn('absolute -bottom-11 -right-11 h-4 w-[70px] origin-left rotate-45 rounded-lg bg-brand')} />
      </div>
    </div>
  );
}
