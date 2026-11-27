'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Blocks, ExternalLink, Loader2, PenLine, Trash2 } from 'lucide-react';

import {
  joinSavedBlocks,
  newId,
  splitSavedBlocks,
  type HeroContent,
  type PostBlocks,
  type TemplateStructure,
} from '@/lib/blog/blocks';
import { slugify } from '@/lib/blog/format';
import { PRESETS, cloneStructure } from '@/lib/blog/presets';
import type { Post, PostTemplate } from '@/lib/blog/types';
import { cn } from '@/lib/utils';
import { AiGuide, type AiResult } from './ai-guide';
import { ImageField } from './image-field';
import { TagSelector } from './tag-selector';
import { apiErrorMessage, toast, ui } from './ui';

const RichTextEditor = dynamic(() => import('./rich-text-editor'), {
  ssr: false,
  loading: () => <div className="h-[430px] animate-pulse rounded-[12px] bg-surface-2" />,
});
const BlockBuilder = dynamic(() => import('./builder/block-builder').then((m) => m.BlockBuilder), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-muted">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  ),
});

interface PostEditorProps {
  post?: Post;
  templates: PostTemplate[];
  /** id de una plantilla para arrancar un artículo nuevo con bloques. */
  initialTemplate?: string;
}

type Mode = 'text' | 'blocks';

function findTemplate(id: string, saved: PostTemplate[]): TemplateStructure | null {
  const preset = PRESETS.find((p) => p.id === id);
  if (preset) return cloneStructure(preset.structure);
  const tpl = saved.find((t) => t.id === id);
  return tpl ? cloneStructure(tpl.structure) : null;
}

export function PostEditor({ post, templates: initialTemplates, initialTemplate }: PostEditorProps) {
  const router = useRouter();
  const isNew = !post;
  const saved = splitSavedBlocks(post?.blocks);
  const startTemplate = isNew && initialTemplate ? findTemplate(initialTemplate, initialTemplates) : null;

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [cover, setCover] = useState(post?.cover_image ?? '');
  const [published, setPublished] = useState(post?.published ?? false);
  const [savedSlug, setSavedSlug] = useState(post?.slug ?? '');
  const [mode, setMode] = useState<Mode>(saved.structure || startTemplate ? 'blocks' : 'text');
  const [templates, setTemplates] = useState(initialTemplates);
  const [templateId, setTemplateId] = useState(post?.template_id ?? (startTemplate ? initialTemplate! : ''));
  const [structure, setStructure] = useState<TemplateStructure>(saved.structure ?? startTemplate ?? { rows: [] });
  const [blocks, setBlocks] = useState<PostBlocks>(saved.blocks);
  const [busy, setBusy] = useState<null | 'save' | 'publish' | 'unpublish' | 'delete'>(null);

  // ---- Cambios sin guardar ----
  const snapshot = useMemo(
    () => JSON.stringify({ title, slug, excerpt, content, tags, cover, mode, structure, blocks }),
    [title, slug, excerpt, content, tags, cover, mode, structure, blocks],
  );
  const [savedSnapshot, setSavedSnapshot] = useState(snapshot);
  const dirty = snapshot !== savedSnapshot;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  // El editor de bloques ocupa toda la pantalla: sin scroll de fondo.
  useEffect(() => {
    document.body.style.overflow = mode === 'blocks' ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mode]);

  const changeTitle = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const applyAi = (r: AiResult) => {
    if (r.title) setTitle(r.title);
    if (r.slug) {
      setSlug(r.slug);
      setSlugTouched(true);
    } else if (r.title && !slugTouched) setSlug(slugify(r.title));
    if (r.excerpt) setExcerpt(r.excerpt);
    if (r.tags?.length) setTags(r.tags);
    if (r.html) {
      if (mode === 'blocks') {
        const hero = structure.rows.find((row) => row.columns[0]?.block.type === 'hero');
        const rowId = newId('r');
        const colId = newId('c');
        setStructure({ rows: [...(hero ? [hero] : []), { id: rowId, columns: [{ id: colId, span: 12, block: { type: 'text', config: {} } }] }, ...structure.rows.filter((row) => row !== hero)] });
        setBlocks({ ...blocks, [rowId]: { [colId]: { html: r.html } } });
      } else setContent(r.html);
    }
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    if (next === 'blocks' && structure.rows.length === 0) {
      // Arranca con una portada y el texto que ya estaba escrito.
      const heroRow = newId('r');
      const heroCol = newId('c');
      const textRow = newId('r');
      const textCol = newId('c');
      setStructure({
        rows: [
          { id: heroRow, columns: [{ id: heroCol, span: 12, block: { type: 'hero', config: { overlay: true } } }] },
          { id: textRow, columns: [{ id: textCol, span: 12, block: { type: 'text', config: {} } }] },
        ],
      });
      setBlocks({ [heroRow]: { [heroCol]: { image: cover || undefined } }, [textRow]: { [textCol]: { html: content } } });
    }
    if (next === 'text' && !content && structure.rows.length > 0) {
      toast('En modo texto libre se guarda solo el texto. Los bloques quedan acá hasta que guardes.');
    }
    setMode(next);
  };

  const applyTemplate = (id: string) => {
    const next = id ? findTemplate(id, templates) : { rows: [] };
    if (!next) return;
    const hasContent = Object.keys(blocks).length > 0 || structure.rows.length > 0;
    if (hasContent && !window.confirm('La plantilla reemplaza los bloques actuales y su contenido. ¿Seguimos?')) return;
    setTemplateId(id);
    setStructure(next);
    setBlocks({});
  };

  const saveTemplate = async () => {
    const name = window.prompt('Nombre de la plantilla:')?.trim();
    if (!name) return;
    const res = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, structure }),
    });
    if (!res.ok) return toast(await apiErrorMessage(res), 'error');
    const tpl = (await res.json()) as PostTemplate;
    setTemplates((list) => [tpl, ...list]);
    toast(`Plantilla "${name}" guardada.`);
  };

  const save = useCallback(
    async (publish: boolean, kind: 'save' | 'publish' | 'unpublish') => {
      if (!title.trim()) return toast('Poné un título antes de guardar.', 'error');
      if (!slug) return toast('Falta la URL del artículo.', 'error');
      if (mode === 'blocks' && structure.rows.length === 0) return toast('Agregá al menos un bloque.', 'error');

      const heroImage = (() => {
        for (const row of structure.rows) {
          const col = row.columns.find((c) => c.block.type === 'hero');
          if (col) return (blocks[row.id]?.[col.id] as HeroContent | undefined)?.image;
        }
      })();
      const body = {
        title: title.trim(),
        slug,
        excerpt: excerpt.trim() || null,
        tags,
        cover_image: cover || (mode === 'blocks' ? heroImage : '') || null,
        published: publish,
        content: mode === 'text' ? content : null,
        blocks: mode === 'blocks' ? joinSavedBlocks(structure, blocks) : null,
        template_id: mode === 'blocks' && /^[0-9a-f-]{36}$/.test(templateId) ? templateId : null,
      };

      setBusy(kind);
      try {
        const res = await fetch(isNew ? '/api/posts' : `/api/posts/${post.id}`, {
          method: isNew ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) return toast(await apiErrorMessage(res), 'error');
        const result = (await res.json()) as { id: string; slug: string; published: boolean };
        setSavedSnapshot(snapshot);
        setPublished(result.published);
        setSavedSlug(result.slug);
        toast(
          kind === 'publish'
            ? published
              ? 'Cambios publicados. La web se actualiza en unos segundos.'
              : '¡Publicado! Ya está en el blog.'
            : kind === 'unpublish'
              ? 'Lo pasaste a borrador: ya no se ve en el blog.'
              : 'Borrador guardado.',
        );
        if (isNew) router.replace(`/admin/articulos/${result.id}`);
      } catch {
        toast('No hay conexión. Revisá internet y probá de nuevo.', 'error');
      } finally {
        setBusy(null);
      }
    },
    [title, slug, excerpt, tags, cover, mode, content, structure, blocks, templateId, isNew, post, snapshot, published, router],
  );

  // Ctrl/Cmd + S guarda sin cambiar el estado de publicación.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!busy) save(published, published ? 'publish' : 'save');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save, published, busy]);

  const remove = async () => {
    if (!post || !window.confirm('¿Eliminar este artículo? No se puede deshacer.')) return;
    setBusy('delete');
    const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
    setBusy(null);
    if (!res.ok) return toast(await apiErrorMessage(res), 'error');
    setSavedSnapshot(snapshot);
    toast('Artículo eliminado.');
    router.push('/admin/articulos');
    router.refresh();
  };

  // ---- Piezas compartidas por los dos modos ----

  const actions = (
    <>
      {published ? (
        <>
          <button type="button" className={ui.btnOutline} disabled={!!busy} onClick={() => window.confirm('¿Pasarlo a borrador? Deja de verse en el blog.') && save(false, 'unpublish')}>
            {busy === 'unpublish' && <Loader2 className="h-4 w-4 animate-spin" />}
            Pasar a borrador
          </button>
          <button type="button" className={ui.btnPrimary} disabled={!!busy} onClick={() => save(true, 'publish')}>
            {busy === 'publish' && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar cambios
          </button>
        </>
      ) : (
        <>
          <button type="button" className={ui.btnOutline} disabled={!!busy} onClick={() => save(false, 'save')}>
            {busy === 'save' && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar borrador
          </button>
          <button type="button" className={ui.btnPrimary} disabled={!!busy} onClick={() => save(true, 'publish')}>
            {busy === 'publish' && <Loader2 className="h-4 w-4 animate-spin" />}
            Publicar
          </button>
        </>
      )}
    </>
  );

  const status = (
    <span className={cn('rounded-full px-2.5 py-1 text-[12px] font-semibold', published ? 'bg-teal/15 text-teal' : 'bg-white/[0.06] text-body')}>
      {published ? 'Publicado' : 'Borrador'}
      {dirty && <span className="font-normal text-muted"> · sin guardar</span>}
    </span>
  );

  const modeSwitch = (
    <div className="inline-flex rounded-[10px] border border-line bg-surface p-0.5" role="group" aria-label="Tipo de artículo">
      {(
        [
          ['text', 'Texto libre', PenLine],
          ['blocks', 'Con bloques', Blocks],
        ] as const
      ).map(([value, label, Icon]) => (
        <button
          key={value}
          type="button"
          aria-pressed={mode === value}
          onClick={() => switchMode(value)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[13px] font-semibold transition-colors',
            mode === value ? 'bg-teal/15 text-teal' : 'text-body hover:text-title',
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );

  const settings = (
    <div className="flex flex-col divide-y divide-line">
      {mode === 'blocks' && (
        <div className="flex flex-col gap-1.5 p-4">
          <label htmlFor="plantilla" className={ui.label}>
            Plantilla
          </label>
          <select id="plantilla" value={templateId} onChange={(e) => applyTemplate(e.target.value)} className={ui.inputSm}>
            <option value="">Sin plantilla</option>
            <optgroup label="Prediseñadas">
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </optgroup>
            {templates.length > 0 && (
              <optgroup label="Mis plantillas">
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <Link href="/admin/plantillas" target="_blank" className="text-[12px] text-teal">
            Ver y administrar plantillas
          </Link>
        </div>
      )}
      <div className="flex flex-col gap-1.5 p-4">
        <label htmlFor="slug" className={ui.label}>
          URL del artículo
        </label>
        <div className="flex items-center gap-1">
          <span className="shrink-0 text-[12px] text-muted">/blog/</span>
          <input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            className={ui.inputSm}
          />
        </div>
        {published && !isNew && slug !== savedSlug && (
          <p className="m-0 text-[12px] text-danger">Ojo: cambiar la URL de un artículo publicado rompe los links que ya compartiste.</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <label htmlFor="resumen" className={ui.label}>
          Resumen para Google
        </label>
        <textarea
          id="resumen"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          maxLength={300}
          rows={3}
          placeholder="1 o 2 oraciones. Aparece en Google, en el listado del blog y al compartir."
          className={cn(ui.inputSm, 'resize-y')}
        />
        <p className={cn('m-0 text-right text-[12px]', excerpt.length > 155 ? 'text-danger' : 'text-muted')}>{excerpt.length}/155</p>
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <span className={ui.label}>Imagen de portada</span>
        <ImageField
          value={cover}
          onChange={setCover}
          hint={mode === 'blocks' ? 'Para el listado del blog. Si la dejás vacía, se usa la foto del bloque Portada.' : 'Se ve arriba del artículo y en el listado. Ideal: 1600 × 900 px.'}
        />
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <span className={ui.label}>Etiquetas</span>
        <TagSelector tags={tags} onChange={setTags} />
      </div>
      {!isNew && (
        <div className="p-4">
          <button type="button" onClick={remove} disabled={!!busy} className={cn(ui.btnDanger, 'w-full')}>
            {busy === 'delete' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Eliminar artículo
          </button>
        </div>
      )}
    </div>
  );

  const viewLink =
    published && savedSlug ? (
      <a href={`/blog/${savedSlug}`} target="_blank" rel="noopener" className={cn(ui.btnGhost, 'text-teal')}>
        Ver en el blog <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    ) : null;

  // ---- Modo bloques: pantalla completa ----
  if (mode === 'blocks') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-ink">
        <div className="flex h-[60px] shrink-0 items-center gap-3 border-b border-line bg-ink-alt px-3">
          <Link href="/admin/articulos" className={ui.btnGhost} aria-label="Volver a los artículos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <input
            value={title}
            onChange={(e) => changeTitle(e.target.value)}
            placeholder="Título del artículo…"
            aria-label="Título del artículo"
            maxLength={200}
            className="min-w-0 flex-1 bg-transparent font-display text-lg font-semibold text-title placeholder:text-muted focus:outline-none"
          />
          {status}
          {modeSwitch}
          {viewLink}
          {actions}
        </div>
        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1">
            <BlockBuilder
              structure={structure}
              blocks={blocks}
              onStructureChange={setStructure}
              onBlocksChange={setBlocks}
              onSaveTemplate={saveTemplate}
              meta={{ title, tags, lead: excerpt }}
            />
          </div>
          <aside className="w-[290px] shrink-0 overflow-y-auto border-l border-line bg-ink-alt" aria-label="Configuración del artículo">
            {settings}
          </aside>
        </div>
      </div>
    );
  }

  // ---- Modo texto libre ----
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/admin/articulos" className={ui.btnGhost}>
          <ArrowLeft className="h-4 w-4" /> Artículos
        </Link>
        <h1 className="m-0 font-display text-2xl font-bold text-title">{isNew ? 'Nuevo artículo' : 'Editar artículo'}</h1>
        {status}
        <span className="flex-1" />
        {modeSwitch}
      </div>

      <AiGuide onApply={applyAi} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className={cn(ui.card, 'p-5')}>
            <label htmlFor="titulo" className={ui.label}>
              Título
            </label>
            <input
              id="titulo"
              value={title}
              onChange={(e) => changeTitle(e.target.value)}
              maxLength={200}
              placeholder="Ej.: Cómo aparecer en Google Maps si tenés un negocio de servicios"
              className={cn(ui.input, 'font-display text-lg font-semibold')}
            />
            <p className={cn('m-0 mt-1 text-right text-[12px]', title.length > 65 ? 'text-danger' : 'text-muted')}>
              {title.length}/65 recomendado
            </p>
          </div>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-[84px] lg:self-start">
          <div className={cn(ui.card, 'flex flex-col gap-2 p-4')}>
            <div className="flex flex-wrap gap-2 [&>*]:flex-1">{actions}</div>
            {viewLink}
            <p className="m-0 text-center text-[11px] text-muted">Atajo: Ctrl/Cmd + S para guardar.</p>
          </div>
          <div className={ui.card}>{settings}</div>
        </aside>
      </div>
    </div>
  );
}
