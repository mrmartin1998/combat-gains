import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from './app/config';

export function middleware(request) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  console.log('Middleware path:', request.nextUrl.pathname);
  console.log('Token exists:', !!token);

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register', '/about'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  // If no token and trying to access protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists and trying to access login/register
  if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 