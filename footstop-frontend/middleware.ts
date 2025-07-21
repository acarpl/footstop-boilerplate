import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTHENTICATED_PATHS = ['/cart', '/checkout', '/profile', '/dashboard'];
const GUEST_PATHS = ['/login', '/register'];
const ADMIN_PATH = ['/admin', 'admin/dashboard', '/admin/users', '/admin/orders', '/admin/products'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Hanya periksa keberadaan cookie accessToken.
  const hasAccessToken = request.cookies.has('accessToken');

  if (ADMIN_PATH.some(path => pathname.startsWith(path)) && !hasAccessToken) {
  // Langsung rujuk ke login
  return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log(`--- Middleware on ${pathname}, Token Exists: ${hasAccessToken} ---`);

  // Jika mencoba akses halaman terproteksi TAPI tidak punya cookie token
  if (AUTHENTICATED_PATHS.some(path => pathname.startsWith(path)) && !hasAccessToken) {
    console.log("Redirecting to /login (protected route, no token)");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika punya cookie token TAPI mencoba akses halaman tamu
  if (hasAccessToken && GUEST_PATHS.some(path => pathname.startsWith(path))) {
    console.log("Redirecting to /login (guest route, user has token)");
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};