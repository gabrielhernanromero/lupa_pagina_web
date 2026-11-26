'use client';

import { m, type MotionStyle } from 'framer-motion';

const tags = {
  div: m.div,
  li: m.li,
  article: m.article,
  p: m.p,
};

interface RevealProps {
  /** Posición en la cascada: cada ítem espera 80 ms más que el anterior. */
  index?: number;
  as?: keyof typeof tags;
  className?: string;
  style?: MotionStyle;
  children: React.ReactNode;
}

/**
 * Aparición al scrollear: opacity 0→1 y translateY 24px→0 en 0,6 s.
 * Con prefers-reduced-motion se muestra directo (ver globals.css).
 */
export function Reveal({ index = 0, as = 'div', className, style, children }: RevealProps) {
  const Tag = tags[as];
  return (
    <Tag
      data-reveal=""
      className={className}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.08 }}
    >
      {children}
    </Tag>
  );
}
