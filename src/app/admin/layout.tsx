import type { Metadata } from 'next';

import { Toaster } from '@/components/admin/ui';

export const metadata: Metadata = {
  title: { default: 'Panel', template: '%s | Panel de Lupa' },
  robots: { index: false, follow: false },
};

/** Panel de administración del blog. No usa el header ni el footer de la web. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink">
      {children}
      <Toaster />
    </div>
  );
}
