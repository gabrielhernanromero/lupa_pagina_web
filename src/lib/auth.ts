import { createHash, timingSafeEqual } from 'node:crypto';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

/**
 * Login del panel /admin: un único usuario definido por variables de entorno
 * (ADMIN_EMAIL y ADMIN_PASSWORD). La sesión dura 8 horas.
 */

function sameText(a: string, b: string): boolean {
  // Compara hashes de largo fijo para no filtrar información por tiempos de respuesta.
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminEmail || !adminPassword) return null;

        const email = String(credentials?.email ?? '').trim().toLowerCase();
        const password = String(credentials?.password ?? '');
        const ok = sameText(email, adminEmail) && sameText(password, adminPassword);
        if (!ok) {
          // Frena los intentos por fuerza bruta.
          await new Promise((r) => setTimeout(r, 1000));
          return null;
        }
        return { id: 'admin', name: 'Lupa', email: adminEmail };
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 },
  trustHost: true,
});
