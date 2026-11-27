import { NextResponse, type NextRequest } from 'next/server';

/**
 * Chequeo rápido para /admin: si no hay cookie de sesión, manda al login.
 * Es solo un atajo: la verificación real de la sesión se hace en cada página y ruta de la API.
 */
const SESSION_COOKIES = ['authjs.session-token', '__Secure-authjs.session-token'];

export function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === '/admin/login') return NextResponse.next();
  const hasSession = SESSION_COOKIES.some((name) => req.cookies.has(name));
  if (!hasSession) return NextResponse.redirect(new URL('/admin/login', req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
