import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/admin/login-form';
import { auth } from '@/lib/auth';

export const metadata: Metadata = { title: 'Ingresar' };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect('/admin/articulos');
  return <LoginForm />;
}
