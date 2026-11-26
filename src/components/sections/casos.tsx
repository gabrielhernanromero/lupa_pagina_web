import { Reveal } from '@/components/motion/reveal';
import { Section, SectionHeading } from '@/components/section';
import { WhatsAppLink } from '@/components/whatsapp-link';
import { siteConfig } from '@/config/site';
import { casos } from '@/data/casos';

export function Casos() {
  return (
    <Section id="casos" containerClassName="gap-10" aria-labelledby="casos-titulo">
      <SectionHeading id="casos-titulo" eyebrow="Casos" title="Lo que pasa cuando te encuentran." />
      <div className="flex flex-wrap gap-5">
        {casos.map((c) => (
          <Reveal
            as="article"
            key={c.id}
            className="flex min-w-0 max-w-full flex-[2_1_520px] flex-col gap-6 rounded-[20px] border border-line bg-surface p-[34px]"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="m-0 font-display text-2xl font-semibold text-title">{c.cliente}</h3>
                <span className="text-sm text-muted">{c.rubro}</span>
              </div>
              <a href={c.url} target="_blank" rel="noopener" className="text-sm font-semibold">
                Ver sitio <span aria-hidden="true">→</span>
                <span className="sr-only"> de {c.cliente}</span>
              </a>
            </div>
            <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-6">
              <div className="flex flex-col gap-2">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Desafío</dt>
                <dd className="m-0 text-[14.5px] leading-[1.6]">{c.desafio}</dd>
              </div>
              <div className="flex flex-col gap-2">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Qué hicimos</dt>
                <dd className="m-0 text-[14.5px] leading-[1.6]">{c.queHicimos}</dd>
              </div>
              <div className="flex flex-col gap-2">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-teal">Resultado</dt>
                <dd className="m-0 text-base font-medium leading-[1.55] text-title">{c.resultado}</dd>
              </div>
            </dl>
          </Reveal>
        ))}

        <Reveal index={1} className="flex min-w-0 flex-[1_1_280px]">
          <WhatsAppLink
            mensaje={siteConfig.mensajes.diagnostico}
            origen="casos"
            className="flex w-full flex-col justify-center gap-3 rounded-[20px] border border-dashed border-teal/45 bg-teal/[0.04] p-[34px] transition-transform duration-300 hover:-translate-y-1.5"
          >
            <span className="font-display text-2xl font-semibold text-title">Tu empresa acá.</span>
            <span className="text-[15px] leading-[1.6] text-body">Arrancá con un diagnóstico sin cargo.</span>
            <span className="text-[15px] font-semibold text-teal">
              Escribinos por WhatsApp <span aria-hidden="true">→</span>
            </span>
          </WhatsAppLink>
        </Reveal>
      </div>
    </Section>
  );
}
