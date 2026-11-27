import Link from 'next/link';
import { ExternalLink, LogOut } from 'lucide-react';

import { logout } from '@/app/admin/actions';
import { AdminNav } from '@/components/admin/admin-nav';
import { ui } from '@/components/admin/styles';
import { Logo } from '@/components/brand/logo';
import { requireAdmin } from '@/lib/admin-guard';
import { contarNuevas } from '@/lib/blog/consultas';
import { isBlogConfigured } from '@/lib/blog/supabase';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const yo = await requireAdmin();
  const nuevas = await contarNuevas();
  const configured = isBlogConfigured() && Boolean(process.env.SUPABASE_SECRET_KEY);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-[rgba(6,10,19,0.88)] backdrop-blur-[14px]">
        <div className="mx-auto flex h-[64px] max-w-[1280px] items-center gap-5 px-5">
          <Link href="/admin/articulos" aria-label="Panel, inicio" className="flex items-center gap-2.5">
            <Logo size={24} textClassName="text-base" />
            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
              Panel
            </span>
          </Link>
          <AdminNav nuevas={nuevas} />
          <span className="flex-1" />
          <span className="hidden text-[13px] text-muted lg:inline" title={yo.email}>
            {yo.nombre}
          </span>
          <a href="/blog" target="_blank" rel="noopener" className={ui.btnGhost}>
            Ver blog <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <form action={logout}>
            <button type="submit" className={ui.btnGhost}>
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Salir
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-5 py-8">
        {!configured && (
          <p role="alert" className="mb-6 rounded-[12px] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            Falta conectar Supabase: cargá SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY y SUPABASE_SECRET_KEY en las variables de
            entorno. Hasta entonces no se puede guardar nada.
          </p>
        )}
        {children}
      </main>
    </>
  );
}
