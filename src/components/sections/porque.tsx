import { Calendar, ChartLine, Code, Key, MessageSquare, Users, type IconComponent } from '@/components/brand/icons';
import { ICON_GRADIENT } from '@/components/brand/gradient-defs';
import { Reveal } from '@/components/motion/reveal';
import { Section, SectionHeading } from '@/components/section';
import { beneficios, type IconoBeneficio } from '@/data/home';

const iconos: Record<IconoBeneficio, IconComponent> = {
  equipo: Users,
  codigo: Code,
  llave: Key,
  numeros: ChartLine,
  charla: MessageSquare,
  calendario: Calendar,
};

export function PorQue() {
  return (
    <Section alt containerClassName="gap-11" aria-labelledby="porque-titulo">
      <SectionHeading id="porque-titulo" eyebrow="Por qué Lupa" title="Trabajar con nosotros es simple." />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-x-8 gap-y-9">
        {beneficios.map((b, i) => {
          const Icon = iconos[b.icono];
          return (
            <Reveal key={b.titulo} index={i % 3} className="flex gap-4">
              <Icon size={24} color={ICON_GRADIENT} strokeWidth={1.8} aria-hidden="true" className="mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1.5">
                <h3 className="m-0 font-display text-[17px] font-semibold text-title">{b.titulo}</h3>
                <p className="m-0 text-[14.5px] leading-[1.55]">{b.texto}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
