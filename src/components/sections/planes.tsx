import { Reveal } from '@/components/motion/reveal';
import { Section, SectionHeading } from '@/components/section';
import { extras, planes, tabsPlanes, vigenciaPrecios } from '@/data/planes';
import { precioExtra } from '@/lib/format';
import { toPlanView } from '@/lib/plan-view';
import { PlanesTabs, type TabView } from './planes-tabs';

/**
 * Los precios se formatean acá (servidor / build) y llegan como texto al
 * componente cliente: así no hay diferencias de formato al hidratar.
 */
export function Planes() {
  const tabs: TabView[] = tabsPlanes.map((t) => ({
    id: t.id,
    label: t.label,
    nota: t.nota,
    planes: planes.filter((p) => p.categoria === t.id).map(toPlanView),
  }));

  return (
    <Section id="planes" alt containerClassName="gap-9" aria-labelledby="planes-titulo">
      <SectionHeading
        id="planes-titulo"
        eyebrow="Planes"
        title="Elegí cómo arrancar"
        text="Contratá solo la web, solo el marketing o todo junto. Armamos lo que tu empresa necesita."
        className="max-w-[680px]"
      />

      <PlanesTabs tabs={tabs} />

      <Reveal className="flex flex-col gap-[18px] rounded-[20px] border border-line bg-surface p-7">
        <h3 className="m-0 font-display text-[19px] font-semibold text-title">Extras</h3>
        <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-x-10">
          {extras.map((x) => (
            <div key={x.id} className="flex justify-between gap-4 border-b border-line-soft py-[11px] text-sm">
              <dt className="text-list">{x.nombre}</dt>
              <dd className="m-0 shrink-0 text-right font-semibold text-title">{precioExtra(x)}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <p className="m-0 text-[13px] text-muted">{vigenciaPrecios}</p>
    </Section>
  );
}
