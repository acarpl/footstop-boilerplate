// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/auth'; // Asumsi fungsi decrypt ada di lib/auth.ts

// --- Konfigurasi Rute ---
// Rute yang hanya boleh diakses oleh pengguna yang sudah login
const AUTHENTICATED_PATHS = ['/cart', '/checkout', '/profile'];
// Rute yang hanya boleh diakses oleh tamu (belum login)
const GUEST_PATHS = ['/login', '/register'];
// Rute khusus admin
const ADMIN_PATH = '/admin';
// Halaman utama setelah login (untuk customer)
const USER_HOME_PATH = '/homelogin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  // --- Langkah 1: Verifikasi Sesi Pengguna ---
  let sessionPayload = null;
  if (accessToken) {
    try {
      // Coba dekripsi token sekali saja
      const { payload } = await decrypt(accessToken);
      sessionPayload = payload;
    } catch (error) {
      // Jika token rusak atau tidak valid, hapus cookie-nya dan anggap sebagai tamu.
      console.error('Invalid token, clearing cookie:', error);
      const response = NextResponse.next();
      response.cookies.set('accessToken', '', { expires: new Date(0) });
      // Kita tidak me-redirect di sini, biarkan logika di bawah yang menanganinya
      // sebagai request dari seorang tamu.
    }
  }

  // --- Langkah 2: Terapkan Aturan Berdasarkan Status Login dan Rute ---

  const userRole = sessionPayload?.role; // 'admin', 'customer', atau undefined

  // 🔒 Aturan untuk Rute Admin
  if (pathname.startsWith(ADMIN_PATH)) {
    // Jika mencoba akses /admin tapi perannya bukan admin (atau tidak login sama sekali)
    if (userRole !== 'admin') {
      // Rujuk ke halaman utama pengguna biasa jika login, atau ke login jika tidak.
      const redirectUrl = sessionPayload ? USER_HOME_PATH : '/login';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // 🔒 Aturan untuk Rute Terproteksi (pengguna biasa)
  if (AUTHENTICATED_PATHS.some((path) => pathname.startsWith(path))) {
    // Jika mencoba akses halaman terproteksi tapi tidak punya sesi/token
    if (!sessionPayload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ❌ Aturan untuk Rute Tamu (Login & Register)
  if (GUEST_PATHS.some((path) => pathname.startsWith(path))) {
    // Jika pengguna sudah login dan mencoba akses halaman login/register
    if (sessionPayload) {
      // Jika admin, rujuk ke dashboard admin. Jika customer, ke home.
      const redirectUrl = userRole === 'admin' ? ADMIN_PATH : USER_HOME_PATH;
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // ✅ Jika tidak ada aturan di atas yang cocok, izinkan request untuk melanjutkan.
  return NextResponse.next();
}

// --- Konfigurasi Matcher ---
// Middleware ini akan berjalan di semua rute kecuali file statis, gambar, dan rute API.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};