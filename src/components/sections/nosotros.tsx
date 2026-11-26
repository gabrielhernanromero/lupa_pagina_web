import { Reveal } from '@/components/motion/reveal';
import { Section, SectionHeading } from '@/components/section';
import { equipo } from '@/data/home';
import { cn } from '@/lib/utils';

export function Nosotros() {
  return (
    <Section id="nosotros" containerClassName="gap-10" aria-labelledby="nosotros-titulo">
      <SectionHeading
        id="nosotros-titulo"
        eyebrow="Nosotros"
        title="Somos un equipo chico a propósito: hablás directo con quien hace el trabajo."
        titleClassName="text-balance text-[clamp(28px,3.6vw,40px)] leading-[1.15]"
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-5">
        {equipo.map((p, i) => (
          <Reveal
            key={p.nombre}
            index={i}
            className="flex items-start gap-5 rounded-[20px] border border-line bg-surface p-[30px]"
          >
            {/* Avatar con iniciales hasta tener fotos */}
            <div
              aria-hidden="true"
              className={cn(
                'flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full font-display text-2xl font-bold text-ink',
                p.gradiente === 'directo' ? 'bg-brand-diag' : 'bg-brand-diag-rev',
              )}
            >
              {p.iniciales}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="m-0 font-display text-xl font-semibold text-title">{p.nombre}</h3>
              <p className="m-0 text-[13px] font-semibold text-teal">{p.rol}</p>
              <p className="m-0 text-[14.5px] leading-[1.6]">{p.bio}</p>
              {p.linkedin && (
                <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="w-fit text-sm font-semibold">
                  LinkedIn <span aria-hidden="true">→</span>
                  <span className="sr-only"> de {p.nombre}</span>
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
