import { Section, SectionHeading } from '@/components/section';
import { faq } from '@/data/faq';
import { FaqAccordion } from './faq-accordion';

export function Preguntas() {
  return (
    <Section id="preguntas" alt containerClassName="max-w-[820px] gap-9" aria-labelledby="preguntas-titulo">
      <SectionHeading id="preguntas-titulo" eyebrow="Preguntas frecuentes" title="Lo que más nos preguntan." />
      <FaqAccordion items={faq} />
    </Section>
  );
}
