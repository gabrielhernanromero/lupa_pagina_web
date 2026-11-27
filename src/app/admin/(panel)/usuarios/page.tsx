import type { Metadata } from 'next';

import { UsersManager } from '@/components/admin/users-manager';
import { requireAdmin } from '@/lib/admin-guard';
import { listUsuarios } from '@/lib/blog/usuarios';

export const metadata: Metadata = { title: 'Usuarios' };

export default async function UsuariosPage() {
  const yo = await requireAdmin();
  const usuarios = await listUsuarios();
  return (
    <UsersManager
      inicial={usuarios.map(({ id, email, nombre, cargo, linkedin, activo }) => ({ id, email, nombre, cargo, linkedin, activo }))}
      yo={{ id: yo.id, emergencia: yo.emergencia }}
    />
  );
}
