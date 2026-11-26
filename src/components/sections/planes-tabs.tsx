'use client';

import { CheckItem } from '@/components/section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WhatsAppLink } from '@/components/whatsapp-link';
import { buttonVariants } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export interface PlanView {
  id: string;
  nombre: string;
  paraQuien: string;
  precio: string;
  sufijo: string;
  detalle: string;
  incluye: string[];
  nota: string;
  destacado: boolean;
  ctaTexto: string;
  mensaje: string;
}

export interface TabView {
  id: string;
  label: string;
  nota: string;
  planes: PlanView[];
}

export function PlanesTabs({ tabs }: { tabs: TabView[] }) {
  return (
    <Tabs
      defaultValue={tabs[0]?.id}
      onValueChange={(value) => {
        const tab = tabs.find((t) => t.id === value);
        if (tab) trackEvent('view_plan_tab', { tab: tab.label });
      }}
      className="flex flex-col gap-9"
    >
      <TabsList
        aria-label="Tipos de plan"
        className="-mx-6 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
      >
        {tabs.map((t) => (
          <TabsTrigger key={t.id} value={t.id}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((t) => (
        // forceMount: todos los planes quedan en el HTML (SEO/GEO); los inactivos se ocultan con CSS.
        <TabsContent key={t.id} value={t.id} forceMount className="flex flex-col gap-9 data-[state=inactive]:hidden">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] items-stretch gap-[18px]">
            {t.planes.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
          {t.nota && <p className="m-0 max-w-[820px] text-sm leading-[1.6] text-body">{t.nota}</p>}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function PlanCard({ plan: p }: { plan: PlanView }) {
  return (
    <div
      className={cn(
        'relative rounded-[20px] p-px transition-transform duration-300 hover:-translate-y-1.5',
        p.destacado ? 'animate-lupa-breath bg-brand-diag' : 'bg-line',
      )}
    >
      <article className="flex h-full flex-col gap-[18px] rounded-[19px] bg-surface px-6 py-7">
        {p.destacado && (
          <div className="self-start rounded-full bg-brand px-[11px] py-[5px] text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
            Más elegido
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <h3 className="m-0 font-display text-[21px] font-semibold text-title">{p.nombre}</h3>
          <p className="m-0 text-sm leading-[1.5]">{p.paraQuien}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="m-0 flex flex-wrap items-baseline gap-1">
            <span className="font-display text-[30px] font-bold tracking-[-0.01em] text-title">{p.precio}</span>
            {p.sufijo && <span className="text-[15px] text-body">{p.sufijo}</span>}
          </p>
          <p className="m-0 text-[13px] text-muted">{p.detalle}</p>
        </div>
        <ul className="m-0 flex flex-grow list-none flex-col gap-[9px] p-0 text-sm leading-[1.45] text-list">
          {p.incluye.map((it) => (
            <CheckItem key={it} className="gap-[9px]">
              {it}
            </CheckItem>
          ))}
        </ul>
        {p.nota && <p className="m-0 text-[12.5px] leading-[1.5] text-muted">{p.nota}</p>}
        <WhatsAppLink
          mensaje={p.mensaje}
          origen="plan"
          params={{ plan: p.nombre }}
          className={cn(
            buttonVariants({ variant: p.destacado ? 'primary' : 'outline', size: 'md' }),
            'w-full',
            !p.destacado && 'border-white/[0.16]',
          )}
        >
          {p.ctaTexto}
          <span className="sr-only"> — plan {p.nombre}</span>
        </WhatsAppLink>
      </article>
    </div>
  );
}
