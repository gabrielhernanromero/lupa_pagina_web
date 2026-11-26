import { cn } from '@/lib/utils';
import { Reveal } from '@/components/motion/reveal';

interface SectionProps {
  id?: string;
  /** Fondo alterno #0A101C. */
  alt?: boolean;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  'aria-labelledby'?: string;
}

export function Section({ id, alt, className, containerClassName, children, ...rest }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={rest['aria-labelledby']}
      className={cn('px-6 py-[clamp(72px,9vw,112px)]', alt && 'bg-ink-alt', id && 'scroll-mt-[70px]', className)}
    >
      <div className={cn('mx-auto flex max-w-site flex-col', containerClassName)}>{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({ id, eyebrow, title, text, className, titleClassName }: SectionHeadingProps) {
  return (
    <Reveal className={cn('flex max-w-[640px] flex-col gap-3.5', className)}>
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-teal">{eyebrow}</p>
      <h2
        id={id}
        className={cn(
          'm-0 font-display text-[clamp(30px,4vw,44px)] font-bold leading-[1.1] tracking-[-0.01em] text-title',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {text && <p className="m-0 text-[17px] leading-[1.6]">{text}</p>}
    </Reveal>
  );
}

export function GradientText({ children }: { children: React.ReactNode }) {
  return <span className="text-gradient">{children}</span>;
}

/** Ítem de lista con ✓ de marca. */
export function CheckItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <li className={cn('flex gap-2.5', className)}>
      <span className="shrink-0 text-teal" aria-hidden="true">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}
