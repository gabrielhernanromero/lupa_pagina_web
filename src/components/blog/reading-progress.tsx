'use client';

import { useEffect, useRef, useState } from 'react';

import { trackEvent } from '@/lib/analytics';

const MILESTONES = [25, 50, 75, 100];

/** Barra de progreso de lectura. Registra en GA4 cuando se lee el 25, 50, 75 y 100 %. */
export function ReadingProgress({ slug }: { slug: string }) {
  const [progress, setProgress] = useState(0);
  const sent = useRef(new Set<number>());

  useEffect(() => {
    sent.current = new Set();
    let frame = 0;
    const update = () => {
      frame = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 100;
      setProgress(pct);
      for (const m of MILESTONES) {
        if (pct >= m && !sent.current.has(m)) {
          sent.current.add(m);
          trackEvent('read_progress', { slug, percent: String(m) });
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [slug]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]">
      <div className="h-full origin-left bg-brand" style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
}
