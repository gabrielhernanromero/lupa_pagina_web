import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

import { siteConfig } from '@/config/site';

export const ogSize = { width: 1200, height: 630 };
export const ogAlt = `${siteConfig.name}: ${siteConfig.lema}`;

const fontDir = join(process.cwd(), 'node_modules/@fontsource/sora/files');

async function loadSora() {
  const [w600, w800] = await Promise.all([
    readFile(join(fontDir, 'sora-latin-600-normal.woff')),
    readFile(join(fontDir, 'sora-latin-800-normal.woff')),
  ]);
  return [
    { name: 'Sora', data: w600, weight: 600 as const, style: 'normal' as const },
    { name: 'Sora', data: w800, weight: 800 as const, style: 'normal' as const },
  ];
}

function LensSvg({ size, ring = 10, handle = 12 }: { size: number; ring?: number; handle?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="32" stroke="url(#g)" strokeWidth={ring} />
      <path d="M74 74 L102 102" stroke="url(#g)" strokeWidth={handle} strokeLinecap="round" />
    </svg>
  );
}

/** Imagen para compartir en redes (Open Graph / Twitter). */
export async function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#060A13',
          backgroundImage: 'radial-gradient(circle at 92% 8%, rgba(56,189,248,0.22), rgba(6,10,19,0) 45%)',
          fontFamily: 'Sora',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', right: -60, top: 120, display: 'flex', opacity: 0.18 }}>
          <LensSvg size={520} ring={6} handle={8} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <LensSvg size={60} />
          <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '0.02em', color: '#F1F5F9' }}>LUPA</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#F1F5F9' }}>
            Tu trabajo ya es bueno.
          </span>
          <span
            style={{
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              backgroundImage: 'linear-gradient(90deg, #2DD4BF, #38BDF8)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Que se note.
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 28, fontWeight: 600 }}>
          <span style={{ color: '#94A3B8' }}>Web, SEO y marketing para pymes</span>
          <span style={{ color: '#2DD4BF' }}>{siteConfig.domain}</span>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await loadSora() },
  );
}

/** Ícono cuadrado con fondo oscuro (apple-touch-icon / logo en JSON-LD). */
export function renderSquareIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#060A13',
        }}
      >
        <LensSvg size={Math.round(size * 0.72)} />
      </div>
    ),
    { width: size, height: size },
  );
}
