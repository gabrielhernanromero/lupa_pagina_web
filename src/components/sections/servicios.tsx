import { Cpu, Instagram, Monitor, ZoomIn, type IconComponent } from '@/components/brand/icons';
import { ICON_GRADIENT } from '@/components/brand/gradient-defs';
import { Reveal } from '@/components/motion/reveal';
import { CheckItem, Section, SectionHeading } from '@/components/section';
import { servicios, type IconoServicio } from '@/data/servicios';

const iconos: Record<IconoServicio, IconComponent> = {
  web: Monitor,
  seo: ZoomIn,
  marketing: Instagram,
  sistemas: Cpu,
};

export function Servicios() {
  return (
    <Section id="servicios" alt containerClassName="gap-12" aria-labelledby="servicios-titulo">
      <SectionHeading
        id="servicios-titulo"
        eyebrow="Qué hacemos"
        title="Desarrollo y marketing en un mismo lugar."
        text="No tenés que coordinar por separado a un programador, a una community manager y al que sabe de Google."
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] gap-5">
        {servicios.map((s, i) => {
          const Icon = iconos[s.icono];
          return (
            <Reveal key={s.id} index={i % 2} className="h-full">
              <article className="flex h-full flex-col gap-[18px] rounded-[20px] border border-line bg-surface p-[34px] transition-transform duration-300 hover:-translate-y-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10">
                  <Icon size={24} color={ICON_GRADIENT} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="m-0 font-display text-[23px] font-semibold text-title">{s.titulo}</h3>
                  <p className="m-0 text-[15px] leading-[1.6]">{s.bajada}</p>
                </div>
                <ul className="m-0 flex list-none flex-col gap-[9px] p-0 text-[14.5px] text-list">
                  {s.items.map((it) => (
                    <CheckItem key={it}>{it}</CheckItem>
                  ))}
                </ul>
                {s.nota && <p className="m-0 text-[12.5px] leading-[1.5] text-muted">{s.nota}</p>}
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
