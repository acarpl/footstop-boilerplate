import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './utils/auth';

const AUTHENTICATED_PATHS = ['/about', '/cart', '/checkout', '/profile'];
const GUEST_PATHS = ['/login', '/register'];
const ADMIN_PATH = '/admin';
const HOMEPAGE_PATH = '/home';

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  const isAuthenticatedPath = AUTHENTICATED_PATHS.some((path) => pathname.startsWith(path));
  const isGuestPath = GUEST_PATHS.some((path) => pathname.startsWith(path));
  const isAdminPath = pathname.startsWith(ADMIN_PATH);
  const isHomePage = pathname === HOMEPAGE_PATH;

  // 🔒 Handle admin-only route
  if (isAdminPath) {
    if (!accessToken) return NextResponse.redirect(new URL('/login', request.url));

    try {
      const { payload } = await decrypt(accessToken);
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/home', request.url));
      }
    } catch (error) {
      const res = NextResponse.redirect(new URL('/login', request.url));
      res.cookies.set('accessToken', '', { expires: new Date(0) });
      return res;
    }
  }

  // 🔒 Handle authenticated-only pages (client)
  if (isAuthenticatedPath) {
    if (!accessToken) return NextResponse.redirect(new URL('/login', request.url));

    try {
      const { payload } = await decrypt(accessToken);
      if (payload.role !== 'client') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      const res = NextResponse.redirect(new URL('/login', request.url));
      res.cookies.set('accessToken', '', { expires: new Date(0) });
      return res;
    }
  }

  // ❌ Prevent logged-in users from accessing guest pages
  if (isGuestPath) {
    if (accessToken) {
      try {
        const { payload } = await decrypt(accessToken);

        if (payload.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
        if (payload.role === 'client') {
          return NextResponse.redirect(new URL('/home', request.url));
        }
      } catch (error) {
        // Token rusak: biarkan user tetap bisa akses /login
      }
    }
  }

  // ✅ Homepage (/home) is public for both guest & client
  return NextResponse.next();
}
