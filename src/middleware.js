import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  console.log('Middleware path:', request.nextUrl.pathname);
  console.log('Token exists:', !!token);

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register');

  if (isAuthPage) {
    if (token) {
      const searchParams = new URLSearchParams(request.nextUrl.search);
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/workouts/:path*',
    '/exercises/:path*',
    '/api/dashboard/:path*',
    '/api/workouts/:path*',
    '/api/judo-classes/:path*',
    '/login',
    '/register'
  ]
}; 