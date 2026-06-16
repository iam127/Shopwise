import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const user = request.cookies.get('user')?.value;
  const { pathname } = request.nextUrl;

  // Rutas públicas (no requieren login)
  const publicRoutes = ['/login', '/register'];

  // Rutas de admin
  const adminRoutes = ['/admin'];

  // Si no tiene token y quiere entrar a ruta protegida
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si tiene token y quiere entrar a login/register, redirigir a productos
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/productos', request.url));
  }

  // Si quiere entrar a rutas de admin, verificar rol
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      const userData = JSON.parse(user);
      if (userData.rol !== 'admin') {
        return NextResponse.redirect(new URL('/productos', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|bg-auth.png|bg-login.png).*)',
  ],
};