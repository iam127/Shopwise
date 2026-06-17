import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const user = request.cookies.get('user')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/register', '/', '/categorias', '/explorar', '/nosotros', '/contacto'];
  const adminRoutes = ['/admin'];
  const protectedRoutes = ['/productos', '/carrito', '/pedidos', '/favoritos', '/perfil'];

  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/productos', request.url));
  }

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url));
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
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|bg-auth.png|bg-login.png|hero-banner.png).*)',
  ],
};