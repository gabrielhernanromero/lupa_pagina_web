import { Reveal } from '@/components/motion/reveal';
import { GradientText, Section } from '@/components/section';
import { problemas } from '@/data/home';

export function Problema() {
  return (
    <Section containerClassName="gap-12" aria-labelledby="problema-titulo">
      <h2 id="problema-titulo" className="sr-only">
        El problema
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
        {problemas.map((p, i) => (
          <Reveal key={p.titulo} index={i} className="h-full">
            <div className="flex h-full flex-col gap-3 rounded-[18px] border border-line bg-surface p-[30px] transition-transform duration-300 hover:-translate-y-1.5">
              <h3 className="m-0 font-display text-[21px] font-semibold text-title">{p.titulo}</h3>
              <p className="m-0 text-[15px] leading-[1.6]">{p.texto}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal as="p" className="m-0 text-balance text-center font-display text-[clamp(22px,3vw,30px)] font-semibold leading-[1.3] text-title">
        No es un problema de calidad. Es un problema de visibilidad. <GradientText>Y se resuelve.</GradientText>
      </Reveal>
    </Section>
  );
}
