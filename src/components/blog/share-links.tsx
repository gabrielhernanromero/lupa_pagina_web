'use client';

import { useState } from 'react';
import { Check, Link2, MessageCircle } from 'lucide-react';

import { Linkedin } from '@/components/brand/icons';
import { trackEvent } from '@/lib/analytics';

const btn =
  'inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-[13px] font-medium text-title transition-colors hover:border-teal/60 hover:text-title';

/** Compartir el artículo por WhatsApp o LinkedIn, o copiar el link. */
export function ShareLinks({ url, title, slug }: { url: string; title: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('share', { method: 'copiar', slug });
    } catch {
      window.prompt('Copiá el link:', url);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="mr-1 text-sm text-muted">Compartir:</span>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('share', { method: 'whatsapp', slug })}
        className={btn}
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        WhatsApp
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('share', { method: 'linkedin', slug })}
        className={btn}
      >
        <Linkedin className="h-4 w-4" aria-hidden="true" />
        LinkedIn
      </a>
      <button type="button" onClick={copy} className={btn}>
        {copied ? <Check className="h-4 w-4 text-teal" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
        <span aria-live="polite">{copied ? 'Link copiado' : 'Copiar link'}</span>
      </button>
    </div>
  );
}
