import { Casos } from '@/components/sections/casos';
import { Confianza } from '@/components/sections/confianza';
import { Contacto } from '@/components/sections/contacto';
import { Preguntas } from '@/components/sections/faq';
import { Hero } from '@/components/sections/hero';
import { Nosotros } from '@/components/sections/nosotros';
import { Planes } from '@/components/sections/planes';
import { PorQue } from '@/components/sections/porque';
import { Problema } from '@/components/sections/problema';
import { Proceso } from '@/components/sections/proceso';
import { Servicios } from '@/components/sections/servicios';
import { buildJsonLd, serializeJsonLd } from '@/lib/jsonld';

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildJsonLd()) }} />
      <Hero />
      <Confianza />
      <Problema />
      <Servicios />
      <Proceso />
      <Planes />
      <Casos />
      <PorQue />
      <Nosotros />
      <Preguntas />
      <Contacto />
    </>
  );
}
