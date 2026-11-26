import { Reveal } from '@/components/motion/reveal';
import { Section, SectionHeading } from '@/components/section';
import { pasos } from '@/data/home';

/** Borde superior y número, del teal al celeste. */
const estilos = [
  { borde: '#2DD4BF', numero: 'text-teal' },
  { borde: 'rgba(45,212,191,0.75)', numero: 'text-teal' },
  { borde: 'rgba(56,189,248,0.6)', numero: 'text-sky' },
  { borde: 'rgba(56,189,248,0.45)', numero: 'text-sky' },
  { borde: 'rgba(56,189,248,0.3)', numero: 'text-sky' },
];

export function Proceso() {
  return (
    <Section containerClassName="gap-12" aria-labelledby="proceso-titulo">
      <SectionHeading id="proceso-titulo" eyebrow="Cómo trabajamos" title="Cinco pasos, sin vueltas." />
      <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-4 p-0">
        {pasos.map((p, i) => (
          <Reveal
            as="li"
            key={p.numero}
            index={i}
            className="flex flex-col gap-2.5 border-t-2 pt-5"
            style={{ borderTopColor: estilos[i].borde }}
          >
            <span className={`font-display text-sm font-semibold ${estilos[i].numero}`} aria-hidden="true">
              {p.numero}
            </span>
            <h3 className="m-0 font-display text-lg font-semibold text-title">{p.titulo}</h3>
            <p className="m-0 text-[14.5px] leading-[1.6]">{p.texto}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
