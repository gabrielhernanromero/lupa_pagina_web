import { Reveal } from '@/components/motion/reveal';
import { Section } from '@/components/section';
import { mailtoHref, siteConfig } from '@/config/site';
import { ContactForm } from './contact-form';

export function Contacto() {
  return (
    <Section
      id="contacto"
      containerClassName="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-12"
      aria-labelledby="contacto-titulo"
    >
      <Reveal className="flex flex-col gap-4">
        <h2
          id="contacto-titulo"
          className="m-0 font-display text-[clamp(32px,4.4vw,48px)] font-bold leading-[1.08] tracking-[-0.01em] text-title"
        >
          Contanos qué necesitás
        </h2>
        <p className="m-0 text-[17px] leading-[1.6]">Te respondemos en el día hábil con un diagnóstico inicial sin cargo.</p>
        <p className="m-0 mt-2 text-[15px] leading-[1.6] [overflow-wrap:normal] [word-break:normal]">
          ¿Preferís mail?{' '}
          {/* En mobile el mail solo puede cortar después de la @ */}
          <a href={mailtoHref}>
            contacto@
            <wbr />
            {siteConfig.domain}
          </a>
        </p>
      </Reveal>
      <Reveal index={1}>
        <ContactForm />
      </Reveal>
    </Section>
  );
}
