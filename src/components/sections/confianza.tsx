import { Reveal } from '@/components/motion/reveal';
import { fraseConfianza } from '@/data/casos';

export function Confianza() {
  return (
    <section className="px-6" aria-label="Resultado de un cliente">
      <Reveal className="mx-auto flex max-w-site items-center justify-center gap-4 border-y border-line py-7 text-center">
        <p className="m-0 max-w-[760px] text-balance text-base text-list">{fraseConfianza}</p>
      </Reveal>
    </section>
  );
}
