'use client';

import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ui } from './ui';

export const SUGGESTED_TAGS = [
  'Sitios web',
  'SEO',
  'GEO e IA',
  'Google Business',
  'Redes sociales',
  'Marketing de contenidos',
  'Automatizaciones',
  'Casos de clientes',
  'Guías',
  'Novedades',
];

const MAX_TAGS = 10;

export function TagSelector({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState('');
  const custom = tags.filter((t) => !SUGGESTED_TAGS.includes(t));

  const toggle = (tag: string) =>
    onChange(tags.includes(tag) ? tags.filter((t) => t !== tag) : tags.length < MAX_TAGS ? [...tags, tag] : tags);

  const add = () => {
    const tag = input.trim().slice(0, 40);
    setInput('');
    if (!tag || tags.some((t) => t.toLowerCase() === tag.toLowerCase()) || tags.length >= MAX_TAGS) return;
    onChange([...tags, tag]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED_TAGS.map((tag) => {
          const on = tags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(tag)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors',
                on ? 'border-teal/50 bg-teal/15 text-teal' : 'border-white/[0.12] text-body hover:border-teal/40 hover:text-title',
              )}
            >
              {on && <Check className="h-3 w-3" aria-hidden="true" />}
              {tag}
            </button>
          );
        })}
        {custom.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-sky/50 bg-sky/10 py-1 pl-2.5 pr-1.5 text-[12px] font-medium text-sky">
            {tag}
            <button type="button" aria-label={`Quitar ${tag}`} onClick={() => toggle(tag)} className="rounded-full p-0.5 hover:bg-sky/20">
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          maxLength={40}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Otra etiqueta…"
          className={ui.inputSm}
        />
        <button type="button" onClick={add} disabled={!input.trim()} className={cn(ui.btnOutline, 'px-3 py-1.5 text-[13px]')}>
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Agregar
        </button>
      </div>
    </div>
  );
}
