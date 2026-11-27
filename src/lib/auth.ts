import { createHash, timingSafeEqual } from 'node:crypto';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUsuarioParaLogin } from '@/lib/blog/usuarios';
import { verifyPassword } from '@/lib/passwords';

/**
 * Login del panel /admin.
 * 1. Usuarios del panel (tabla lupa_usuarios, se crean desde /admin/usuarios).
 * 2. Acceso de emergencia: ADMIN_EMAIL y ADMIN_PASSWORD de las variables de entorno.
 * La sesión dura 8 horas.
 */

/** id de sesión del acceso de emergencia. */
export const EMERGENCY_ID = 'admin';

function sameText(a: string, b: string): boolean {
  // Compara hashes de largo fijo para no filtrar información por tiempos de respuesta.
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

const pause = () => new Promise((r) => setTimeout(r, 1000)); // frena los intentos por fuerza bruta

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '').trim().toLowerCase();
        const password = String(credentials?.password ?? '');
        if (!email || !password) return null;

        // 1. Usuario del panel
        const usuario = await getUsuarioParaLogin(email);
        if (usuario) {
          if (usuario.activo && (await verifyPassword(password, usuario.password_hash))) {
            return { id: usuario.id, name: usuario.nombre, email: usuario.email };
          }
          await pause();
          return null;
        }

        // 2. Acceso de emergencia
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (adminEmail && adminPassword && sameText(email, adminEmail) && sameText(password, adminPassword)) {
          return { id: EMERGENCY_ID, name: 'Acceso de emergencia', email: adminEmail };
        }
        await pause();
        return null;
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 },
  trustHost: true,
});
