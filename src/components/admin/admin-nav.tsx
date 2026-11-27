'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin/articulos', label: 'Artículos' },
  { href: '/admin/consultas', label: 'Consultas' },
  { href: '/admin/plantillas', label: 'Plantillas' },
  { href: '/admin/usuarios', label: 'Usuarios' },
];

export function AdminNav({ nuevas }: { nuevas: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Panel" className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none]">
      {LINKS.map((l) => {
        const active = pathname.startsWith(l.href);
        const badge = l.href === '/admin/consultas' && nuevas > 0;
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-sm font-medium transition-colors',
              active ? 'bg-white/[0.07] text-title' : 'text-body hover:text-title',
            )}
          >
            {l.label}
            {badge && (
              <span className="rounded-full bg-teal px-1.5 text-[11px] font-bold leading-[18px] text-ink">
                {nuevas}
                <span className="sr-only"> nuevas</span>
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
