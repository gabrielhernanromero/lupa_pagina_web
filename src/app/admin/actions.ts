'use server';

import { AuthError } from 'next-auth';

import { signIn, signOut } from '@/lib/auth';

export interface LoginState {
  error: string | null;
  email: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');
  try {
    await signIn('credentials', {
      email,
      password: formData.get('password'),
      redirectTo: '/admin/articulos',
    });
    return { error: null, email };
  } catch (error) {
    // Si el login sale bien, signIn "lanza" la redirección: hay que dejarla pasar.
    if (error instanceof AuthError) {
      return {
        email,
        error:
          error.type === 'CredentialsSignin'
            ? 'Email o contraseña incorrectos.'
            : 'No se pudo iniciar sesión. Revisá la configuración del panel.',
      };
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: '/admin/login' });
}
