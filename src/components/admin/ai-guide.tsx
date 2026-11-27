'use client';

import { useState } from 'react';
import { Check, ChevronDown, Copy, Sparkles, Wand2 } from 'lucide-react';

import { slugify } from '@/lib/blog/format';
import { cn } from '@/lib/utils';
import { SUGGESTED_TAGS } from './tag-selector';
import { toast, ui } from './ui';

export const AI_PROMPT = `Sos redactor de contenido de Lupa Servicios Digitales, una agencia argentina de dos personas (desarrollo + marketing) con base en Zona Oeste, Buenos Aires, que trabaja con pymes de servicios de todo el país. Escribí un artículo de blog en español rioplatense (con voseo) sobre: [TEMA DEL ARTÍCULO].

SOBRE LUPA
- Servicios: sitios web a medida; posicionamiento SEO + GEO (Google y buscadores con IA); marketing y contenido para redes; sistemas, automatizaciones e IA.
- Lema: "Tu trabajo ya es bueno. Que se note."
- Público: dueños y equipos de pymes de servicios que no son técnicos.
- Tono: claro, cercano y concreto. Ejemplos reales, cero humo. Nunca prometas resultados garantizados (por ejemplo, un puesto en Google).

ESTRUCTURA
1. Introducción de un párrafo que plantee el problema del lector.
2. Desarrollo con subtítulos <h2> y <h3>.
3. Al menos una lista de pasos o puntos clave.
4. Cierre con una invitación a escribirle a Lupa por WhatsApp para un diagnóstico sin cargo.

FORMATO DE RESPUESTA (respetá exactamente este formato)
TÍTULO: [máx. 65 caracteres, con la palabra clave principal]
RESUMEN: [1 o 2 oraciones, máx. 155 caracteres, para Google]
URL: [en minúsculas y con guiones, máx. 6 palabras]
ETIQUETAS: [1 a 3 de esta lista: ${SUGGESTED_TAGS.join(', ')}]
CONTENIDO HTML:
[el artículo completo usando solo <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote> y <a>. Sin <h1>, sin clases y sin estilos. Entre 700 y 1200 palabras.]`;

export interface AiResult {
  title?: string;
  excerpt?: string;
  slug?: string;
  tags?: string[];
  html?: string;
}

/** Lee la respuesta de la IA con el formato del prompt. */
export function parseAiResponse(raw: string): AiResult {
  const text = raw.replace(/\*\*/g, '').replace(/\r/g, '');
  const line = (label: string) => text.match(new RegExp(`^\\s*${label}\\s*:\\s*(.+)$`, 'im'))?.[1]?.trim();
  const result: AiResult = {};

  const title = line('T[ÍI]TULO');
  if (title) result.title = title.replace(/^["“]|["”]$/g, '').slice(0, 200);
  const excerpt = line('RESUMEN');
  if (excerpt) result.excerpt = excerpt.slice(0, 300);
  const slug = line('URL');
  if (slug) result.slug = slugify(slug.replace(/^.*\/blog\//, ''));
  const tags = line('ETIQUETAS') ?? line('TAGS');
  if (tags) {
    result.tags = tags
      .split(/[,;]/)
      .map((t) => t.trim().replace(/^\[|\]$/g, ''))
      .filter(Boolean)
      .map((t) => SUGGESTED_TAGS.find((s) => s.toLowerCase() === t.toLowerCase()) ?? t)
      .slice(0, 5);
  }

  const htmlStart = text.search(/CONTENIDO HTML\s*:?/i);
  let html = htmlStart >= 0 ? text.slice(htmlStart).replace(/^CONTENIDO HTML\s*:?/i, '') : '';
  if (!html && /<(p|h2|h3|ul|ol)[\s>]/i.test(text)) html = text;
  html = html.replace(/```(?:html)?/gi, '').trim();
  if (html) result.html = html;
  return result;
}

export function AiGuide({ onApply }: { onApply: (r: AiResult) => void }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [answer, setAnswer] = useState('');

  const copy = async () => {
    await navigator.clipboard.writeText(AI_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const apply = () => {
    const r = parseAiResponse(answer);
    if (!r.title && !r.html) {
      toast('No encontré el título ni el contenido. Revisá que hayas pegado la respuesta completa.', 'error');
      return;
    }
    onApply(r);
    setAnswer('');
    setOpen(false);
    toast('Listo: completé los campos con la respuesta de la IA. Revisalos antes de publicar.');
  };

  return (
    <div className={cn(ui.card, 'overflow-hidden')}>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center gap-3 px-5 py-4 text-left">
        <Sparkles className="h-5 w-5 text-teal" aria-hidden="true" />
        <span className="flex-1">
          <span className="block font-display text-[15px] font-semibold text-title">Escribir con IA</span>
          <span className="block text-[13px] text-muted">ChatGPT, Claude o Gemini: copiá el prompt, pegá la respuesta y se completa todo.</span>
        </span>
        <ChevronDown className={cn('h-5 w-5 text-muted transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div className="grid gap-5 border-t border-line p-5 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-title">1. Copiá el prompt y cambiá el tema</span>
              <button type="button" onClick={copy} className={cn(ui.btnOutline, 'px-3 py-1.5 text-[13px]')}>
                {copied ? <Check className="h-3.5 w-3.5 text-teal" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <pre className="m-0 max-h-[280px] overflow-auto whitespace-pre-wrap rounded-[10px] border border-line bg-surface-2 p-3 font-mono text-[12px] leading-[1.6] text-body">
              {AI_PROMPT}
            </pre>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold text-title">2. Pegá acá la respuesta completa</span>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={11}
              placeholder={'TÍTULO: …\nRESUMEN: …\nURL: …\nETIQUETAS: …\nCONTENIDO HTML:\n<p>…</p>'}
              className={cn(ui.input, 'resize-y font-mono text-[12px]')}
            />
            <button type="button" onClick={apply} disabled={!answer.trim()} className={cn(ui.btnPrimary, 'self-end')}>
              <Wand2 className="h-4 w-4" aria-hidden="true" />
              Completar el artículo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
