'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin/articulos', label: 'Artículos' },
  { href: '/admin/plantillas', label: 'Plantillas' },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Panel" className="flex items-center gap-1">
      {LINKS.map((l) => {
        const active = pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'rounded-[8px] px-3 py-1.5 text-sm font-medium transition-colors',
              active ? 'bg-white/[0.07] text-title' : 'text-body hover:text-title',
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
