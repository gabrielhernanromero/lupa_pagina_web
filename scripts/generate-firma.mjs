/**
 * Genera public/firma/logo-firma.png (logo para la firma de mail).
 * Uso: npm run generate:firma
 *
 * Fondo oscuro propio para que se vea bien tanto en clientes de mail claros como oscuros.
 * Se exporta al doble de tamaño (600×180) para pantallas retina; en la firma usarlo a 300×90.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createElement as h } from 'react';
import { ImageResponse } from 'next/og.js';

const root = process.cwd();
const fontDir = join(root, 'node_modules/@fontsource/sora/files');
const [w600, w800] = await Promise.all([
  readFile(join(fontDir, 'sora-latin-600-normal.woff')),
  readFile(join(fontDir, 'sora-latin-800-normal.woff')),
]);

const W = 600;
const H = 180;

const lens = h(
  'svg',
  { width: 104, height: 104, viewBox: '0 0 120 120', fill: 'none' },
  h(
    'defs',
    null,
    h(
      'linearGradient',
      { id: 'g', x1: 0, y1: 0, x2: 120, y2: 120, gradientUnits: 'userSpaceOnUse' },
      h('stop', { offset: '0%', stopColor: '#2DD4BF' }),
      h('stop', { offset: '100%', stopColor: '#38BDF8' }),
    ),
  ),
  h('circle', { cx: 50, cy: 50, r: 32, stroke: 'url(#g)', strokeWidth: 10 }),
  h('path', { d: 'M74 74 L102 102', stroke: 'url(#g)', strokeWidth: 12, strokeLinecap: 'round' }),
);

const tree = h(
  'div',
  {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      padding: '0 44px',
      backgroundColor: '#060A13',
      borderRadius: 28,
      fontFamily: 'Sora',
    },
  },
  lens,
  h(
    'div',
    { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
    h('span', { style: { fontSize: 64, fontWeight: 800, letterSpacing: '0.02em', color: '#F1F5F9', lineHeight: 1 } }, 'LUPA'),
    h('span', { style: { fontSize: 24, fontWeight: 600, color: '#94A3B8', lineHeight: 1.2 } }, 'Servicios Digitales'),
  ),
);

const res = new ImageResponse(tree, {
  width: W,
  height: H,
  fonts: [
    { name: 'Sora', data: w600, weight: 600, style: 'normal' },
    { name: 'Sora', data: w800, weight: 800, style: 'normal' },
  ],
});

const outDir = join(root, 'public/firma');
await mkdir(outDir, { recursive: true });
const out = join(outDir, 'logo-firma.png');
await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log(`✓ ${out} (${W}×${H})`);
