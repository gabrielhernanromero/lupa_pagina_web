'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowDown, ArrowUp, BookmarkPlus, ChevronDown, GripVertical, Trash2 } from 'lucide-react';

import { BlockRenderer } from '@/components/blog/renderer/block-renderer';
import {
  BLOCK_META,
  BLOCK_TYPES,
  newId,
  type BlockContent,
  type BlockType,
  type Column,
  type ColumnSpan,
  type PostBlocks,
  type Row,
  type TemplateStructure,
} from '@/lib/blog/blocks';
import { cn } from '@/lib/utils';
import { ConfigPanel } from './config-panel';
import { BlockFill } from './fills';

interface BlockBuilderProps {
  structure: TemplateStructure;
  blocks: PostBlocks;
  onStructureChange: (s: TemplateStructure) => void;
  onBlocksChange: (b: PostBlocks) => void;
  onSaveTemplate: () => void;
  meta: { title?: string; tags?: string[]; lead?: string | null };
}

const LAYOUTS: { label: string; spans: ColumnSpan[] }[] = [
  { label: '1 columna', spans: [12] },
  { label: '2 iguales', spans: [6, 6] },
  { label: 'Ancha + angosta', spans: [8, 4] },
  { label: 'Angosta + ancha', spans: [4, 8] },
  { label: '3 columnas', spans: [4, 4, 4] },
];

const SPAN_CLASS: Record<number, string> = {
  4: 'col-span-12 xl:col-span-4',
  6: 'col-span-12 xl:col-span-6',
  8: 'col-span-12 xl:col-span-8',
  12: 'col-span-12',
};

function newColumn(type: BlockType, span: ColumnSpan = 12): Column {
  return { id: newId('c'), span, block: { type, config: { ...BLOCK_META[type].defaultConfig } } };
}

// ---- Paleta ----

function PaletteItem({ type, onAdd }: { type: BlockType; onAdd: (t: BlockType) => void }) {
  const meta = BLOCK_META[type];
  const Icon = meta.icon;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { source: 'palette', type },
  });
  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      onClick={() => onAdd(type)}
      title="Arrastralo al lienzo o hacé clic para agregarlo al final"
      className={cn(
        'flex w-full cursor-grab items-start gap-2.5 rounded-[10px] border border-line bg-surface p-2.5 text-left transition-colors hover:border-teal/50 active:cursor-grabbing',
        isDragging && 'opacity-40',
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-title">{meta.label}</span>
        <span className="block text-[11px] leading-[1.35] text-muted">{meta.description}</span>
      </span>
    </button>
  );
}

function DropZone({ id, label }: { id: string; label?: string }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex items-center justify-center rounded-[10px] border-2 border-dashed text-[12px] text-muted transition-all',
        label ? 'h-20' : 'h-3 border-transparent',
        isOver && 'h-14 border-teal bg-teal/10 text-teal',
      )}
    >
      {(label || isOver) && (label ?? 'Soltá acá')}
    </div>
  );
}

// ---- Fila ----

interface RowCardProps {
  row: Row;
  index: number;
  total: number;
  blocks: PostBlocks;
  openKey: string | null;
  setOpenKey: (k: string | null) => void;
  onMove: (d: -1 | 1) => void;
  onDelete: () => void;
  onLayout: (spans: ColumnSpan[]) => void;
  onType: (colId: string, type: BlockType) => void;
  onConfig: (colId: string, config: Record<string, unknown>) => void;
  onContent: (colId: string, content: BlockContent) => void;
}

function RowCard({ row, index, total, blocks, openKey, setOpenKey, onMove, onDelete, onLayout, onType, onConfig, onContent }: RowCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  const layoutIndex = LAYOUTS.findIndex((l) => l.spans.join() === row.columns.map((c) => c.span).join());

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('rounded-[12px] border border-line bg-surface', isDragging && 'z-10 opacity-60 shadow-float')}
    >
      <div className="flex items-center gap-1.5 border-b border-line px-2 py-1.5">
        <button type="button" {...attributes} {...listeners} aria-label="Arrastrar para reordenar" className="cursor-grab rounded p-1 text-muted hover:text-title active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Fila {index + 1}</span>
        <select
          value={layoutIndex}
          onChange={(e) => onLayout(LAYOUTS[Number(e.target.value)].spans)}
          aria-label="Columnas de la fila"
          className="ml-1 rounded-[6px] border border-white/[0.12] bg-surface-2 px-1.5 py-0.5 text-[12px] text-body focus:border-teal focus:outline-none"
        >
          {layoutIndex === -1 && <option value={-1}>Personalizado</option>}
          {LAYOUTS.map((l, i) => (
            <option key={l.label} value={i}>
              {l.label}
            </option>
          ))}
        </select>
        <span className="flex-1" />
        <button type="button" aria-label="Subir fila" disabled={index === 0} onClick={() => onMove(-1)} className="rounded p-1 text-muted hover:text-title disabled:opacity-30">
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button type="button" aria-label="Bajar fila" disabled={index === total - 1} onClick={() => onMove(1)} className="rounded p-1 text-muted hover:text-title disabled:opacity-30">
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Eliminar fila"
          onClick={() => {
            if (window.confirm('¿Eliminar esta fila y su contenido?')) onDelete();
          }}
          className="rounded p-1 text-muted hover:text-danger"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-2 p-2">
        {row.columns.map((col) => {
          const key = `${row.id}:${col.id}`;
          const open = openKey === key;
          const meta = BLOCK_META[col.block.type];
          const Icon = meta.icon;
          return (
            <div key={col.id} className={cn('flex min-w-0 flex-col gap-2 rounded-[10px] border p-2', SPAN_CLASS[col.span], open ? 'border-teal/50 bg-teal/[0.04]' : 'border-line')}>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setOpenKey(open ? null : key)} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  <Icon className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                  <span className="truncate text-[13px] font-semibold text-title">{meta.label}</span>
                  <ChevronDown className={cn('ml-auto h-4 w-4 shrink-0 text-muted transition-transform', open && 'rotate-180')} aria-hidden="true" />
                </button>
              </div>
              {!open && (
                <button type="button" onClick={() => setOpenKey(key)} className="text-left text-[12px] text-muted hover:text-teal">
                  Clic para cargar el contenido
                </button>
              )}
              {open && (
                <div className="flex flex-col gap-3 border-t border-line pt-3">
                  <label className="flex items-center gap-2 text-[12px] text-body">
                    Tipo de bloque
                    <select
                      value={col.block.type}
                      onChange={(e) => onType(col.id, e.target.value as BlockType)}
                      className="rounded-[6px] border border-white/[0.12] bg-surface-2 px-1.5 py-0.5 text-[12px] text-title focus:border-teal focus:outline-none"
                    >
                      {BLOCK_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {BLOCK_META[t].label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <ConfigPanel type={col.block.type} config={col.block.config} onChange={(c) => onConfig(col.id, c)} />
                  <BlockFill type={col.block.type} content={(blocks[row.id]?.[col.id] ?? {}) as BlockContent} onChange={(c) => onContent(col.id, c)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Editor ----

export function BlockBuilder({ structure, blocks, onStructureChange, onBlocksChange, onSaveTemplate, meta }: BlockBuilderProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [dragType, setDragType] = useState<BlockType | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const setRows = (rows: Row[]) => onStructureChange({ rows });
  const updateRow = (rowId: string, fn: (r: Row) => Row) => setRows(structure.rows.map((r) => (r.id === rowId ? fn(r) : r)));

  const addRow = (type: BlockType, at?: number) => {
    const row: Row = { id: newId('r'), columns: [newColumn(type)] };
    const rows = [...structure.rows];
    rows.splice(at ?? rows.length, 0, row);
    setRows(rows);
    setOpenKey(`${row.id}:${row.columns[0].id}`);
  };

  const deleteRow = (rowId: string) => {
    setRows(structure.rows.filter((r) => r.id !== rowId));
    const next = { ...blocks };
    delete next[rowId];
    onBlocksChange(next);
  };

  const changeLayout = (rowId: string, spans: ColumnSpan[]) =>
    updateRow(rowId, (r) => ({
      ...r,
      columns: spans.map((span, i) => (r.columns[i] ? { ...r.columns[i], span } : newColumn('text', span))),
    }));

  const changeType = (rowId: string, colId: string, type: BlockType) => {
    updateRow(rowId, (r) => ({
      ...r,
      columns: r.columns.map((c) => (c.id === colId ? { ...c, block: { type, config: { ...BLOCK_META[type].defaultConfig } } } : c)),
    }));
    onBlocksChange({ ...blocks, [rowId]: { ...(blocks[rowId] ?? {}), [colId]: {} } });
  };

  const changeConfig = (rowId: string, colId: string, config: Record<string, unknown>) =>
    updateRow(rowId, (r) => ({
      ...r,
      columns: r.columns.map((c) => (c.id === colId ? { ...c, block: { ...c.block, config } } : c)),
    }));

  const changeContent = (rowId: string, colId: string, content: BlockContent) =>
    onBlocksChange({ ...blocks, [rowId]: { ...(blocks[rowId] ?? {}), [colId]: content } });

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.source === 'palette') setDragType(e.active.data.current.type as BlockType);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setDragType(null);
    if (!over) return;
    if (active.data.current?.source === 'palette') {
      const type = active.data.current.type as BlockType;
      const overId = String(over.id);
      if (overId === 'canvas-end') addRow(type);
      else if (overId.startsWith('before-')) addRow(type, structure.rows.findIndex((r) => `before-${r.id}` === overId));
      else {
        const idx = structure.rows.findIndex((r) => r.id === overId);
        if (idx !== -1) addRow(type, idx + 1);
      }
      return;
    }
    if (active.id !== over.id) {
      const from = structure.rows.findIndex((r) => r.id === active.id);
      const to = structure.rows.findIndex((r) => r.id === over.id);
      if (from !== -1 && to !== -1) setRows(arrayMove(structure.rows, from, to));
    }
  };

  const DragIcon = dragType ? BLOCK_META[dragType].icon : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex h-full min-h-0">
        {/* Paleta */}
        <aside className="flex w-[220px] shrink-0 flex-col overflow-y-auto border-r border-line bg-ink-alt">
          <div className="border-b border-line px-3 py-2.5">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Bloques</p>
            <p className="m-0 text-[11px] text-muted">Arrastrá o hacé clic para agregar</p>
          </div>
          <div className="flex flex-col gap-1.5 p-2.5">
            {BLOCK_TYPES.map((t) => (
              <PaletteItem key={t} type={t} onAdd={(type) => addRow(type)} />
            ))}
          </div>
        </aside>

        {/* Lienzo */}
        <section className="flex min-w-0 flex-1 flex-col" aria-label="Lienzo">
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Lienzo · {structure.rows.length} filas</p>
            {structure.rows.length > 0 && (
              <button type="button" onClick={onSaveTemplate} className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-[12px] font-medium text-body hover:bg-white/[0.05] hover:text-title">
                <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
                Guardar como plantilla
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {structure.rows.length === 0 ? (
              <DropZone id="canvas-end" label="Arrastrá un bloque acá, hacé clic en uno de la izquierda o elegí una plantilla" />
            ) : (
              <SortableContext items={structure.rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col">
                  {structure.rows.map((row, i) => (
                    <div key={row.id}>
                      <DropZone id={`before-${row.id}`} />
                      <RowCard
                        row={row}
                        index={i}
                        total={structure.rows.length}
                        blocks={blocks}
                        openKey={openKey}
                        setOpenKey={setOpenKey}
                        onMove={(d) => setRows(arrayMove(structure.rows, i, i + d))}
                        onDelete={() => deleteRow(row.id)}
                        onLayout={(spans) => changeLayout(row.id, spans)}
                        onType={(colId, type) => changeType(row.id, colId, type)}
                        onConfig={(colId, c) => changeConfig(row.id, colId, c)}
                        onContent={(colId, c) => changeContent(row.id, colId, c)}
                      />
                    </div>
                  ))}
                  <div className="mt-3">
                    <DropZone id="canvas-end" label="Soltá un bloque acá para agregarlo al final" />
                  </div>
                </div>
              </SortableContext>
            )}
          </div>
        </section>

        {/* Vista previa */}
        <section className="hidden w-[40%] max-w-[620px] shrink-0 flex-col border-l border-line bg-ink lg:flex" aria-label="Vista previa">
          <div className="border-b border-line px-4 py-2">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Vista previa · así se va a ver</p>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {structure.rows.length === 0 ? (
              <p className="px-8 py-20 text-center text-sm text-muted">Agregá bloques para ver la vista previa.</p>
            ) : (
              <div className="pointer-events-none origin-top-left [zoom:0.55]">
                <BlockRenderer structure={structure} blocks={blocks} meta={{ ...meta, date: 'Hoy', readMinutes: 3 }} preview />
              </div>
            )}
          </div>
        </section>
      </div>

      <DragOverlay>
        {dragType && DragIcon && (
          <div className="flex w-[200px] items-center gap-2 rounded-[10px] border border-teal bg-surface-2 p-2.5 shadow-float">
            <DragIcon className="h-4 w-4 text-teal" />
            <span className="text-[13px] font-semibold text-title">{BLOCK_META[dragType].label}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
