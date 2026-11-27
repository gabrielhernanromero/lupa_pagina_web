'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extensions';
import {
  Bold,
  ClipboardPaste,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Undo2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { toast, ui } from './ui';
import { uploadImage } from './upload-image';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  compact?: boolean;
}

function ToolButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        'flex h-8 min-w-8 items-center justify-center rounded-[7px] px-1.5 text-body transition-colors hover:bg-white/[0.06] hover:text-title disabled:opacity-40',
        active && 'bg-teal/15 text-teal hover:bg-teal/20 hover:text-teal',
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, onPasteHtml, compact }: { editor: Editor; onPasteHtml: () => void; compact?: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      link: e.isActive('link'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link (dejalo vacío para quitarlo):', previous ?? 'https://');
    if (url === null) return;
    if (url.trim() === '' || url.trim() === 'https://') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const insertImage = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const src = await uploadImage(file);
      const alt = window.prompt('Describí la imagen en pocas palabras (ayuda a Google y a la accesibilidad):', '') ?? '';
      editor.chain().focus().setImage({ src, alt }).run();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'No se pudo subir la imagen.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const sep = <span className="mx-1 h-5 w-px bg-white/10" aria-hidden="true" />;

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-line bg-surface-2 px-2 py-1.5">
      {!compact && (
        <>
          <button
            type="button"
            onClick={onPasteHtml}
            className="mr-1 inline-flex h-8 items-center gap-1.5 rounded-[7px] bg-teal/15 px-2.5 text-[13px] font-semibold text-teal transition-colors hover:bg-teal/25"
          >
            <ClipboardPaste className="h-4 w-4" aria-hidden="true" />
            Pegar HTML
          </button>
          {sep}
        </>
      )}
      <ToolButton label="Negrita" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Itálica" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </ToolButton>
      {sep}
      <ToolButton label="Subtítulo" active={state.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Subtítulo menor" active={state.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-4 w-4" />
      </ToolButton>
      {sep}
      <ToolButton label="Lista" active={state.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Lista numerada" active={state.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Cita destacada" active={state.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Separador" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </ToolButton>
      {sep}
      <ToolButton label="Link" active={state.link} onClick={setLink}>
        <LinkIcon className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Imagen" disabled={uploading} onClick={() => fileRef.current?.click()}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      </ToolButton>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          insertImage(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <span className="flex-1" />
      <ToolButton label="Deshacer" disabled={!state.canUndo} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Rehacer" disabled={!state.canRedo} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </ToolButton>
    </div>
  );
}

export function RichTextEditor({ content, onChange, placeholder, minHeight = 380, compact }: RichTextEditorProps) {
  const [htmlOpen, setHtmlOpen] = useState(false);
  const [rawHtml, setRawHtml] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Escribí el artículo acá, o tocá "Pegar HTML" para traer el texto que te dio la IA…',
      }),
    ],
    content,
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? '' : e.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-lupa max-w-none px-5 py-4 focus:outline-none',
        style: `min-height:${minHeight}px`,
      },
    },
  });

  // Si el contenido cambia desde afuera (por ejemplo, al pegar la respuesta de la IA), actualizar el editor.
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? '' : editor.getHTML();
    if (content !== current) editor.commands.setContent(content || '', { emitUpdate: false });
  }, [content, editor]);

  const applyHtml = () => {
    if (!editor || !rawHtml.trim()) return;
    editor.commands.setContent(rawHtml, { emitUpdate: true });
    setRawHtml('');
    setHtmlOpen(false);
  };

  return (
    <>
      <div className="overflow-hidden rounded-[12px] border border-white/[0.12] bg-surface-2/40 focus-within:border-teal/60">
        {editor ? (
          <>
            <Toolbar editor={editor} onPasteHtml={() => setHtmlOpen(true)} compact={compact} />
            <EditorContent editor={editor} />
          </>
        ) : (
          <div className="animate-pulse bg-surface-2/60" style={{ minHeight: minHeight + 46 }} />
        )}
      </div>

      {htmlOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="pegar-html-titulo">
          <div className={cn(ui.card, 'w-full max-w-[680px] p-6 shadow-mock')}>
            <h2 id="pegar-html-titulo" className="m-0 font-display text-lg font-semibold text-title">
              Pegar HTML
            </h2>
            <p className="mb-4 mt-1 text-sm text-body">
              Pegá el bloque <strong className="text-title">CONTENIDO HTML</strong> que te devolvió la IA. Reemplaza lo que haya en el editor.
            </p>
            <textarea
              autoFocus
              value={rawHtml}
              onChange={(e) => setRawHtml(e.target.value)}
              rows={12}
              placeholder={'<h2>Subtítulo</h2>\n<p>Primer párrafo…</p>'}
              className={cn(ui.input, 'resize-y font-mono text-[13px]')}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className={ui.btnOutline} onClick={() => setHtmlOpen(false)}>
                Cancelar
              </button>
              <button type="button" className={ui.btnPrimary} disabled={!rawHtml.trim()} onClick={applyHtml}>
                Insertar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RichTextEditor;
