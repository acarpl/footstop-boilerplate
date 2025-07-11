// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTHENTICATED_PATHS = ['/cart', '/checkout', '/profile', '/dashboard'];
const GUEST_PATHS = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  console.log(`--- Middleware Check on: ${pathname} ---`);
  console.log("Token Exists:", !!accessToken);

  // Jika mencoba akses halaman terproteksi TAPI tidak punya cookie token
  if (AUTHENTICATED_PATHS.some(path => pathname.startsWith(path)) && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika mencoba akses halaman guest TAPI punya cookie token
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};