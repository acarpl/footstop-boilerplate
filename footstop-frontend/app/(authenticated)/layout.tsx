'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Spin } from 'antd';
import { useRouter } from 'next/navigation';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Selagi memverifikasi sesi, tampilkan loading screen
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
  }

  // Jika setelah loading selesai ternyata tidak ada user,
  // rujuk ke halaman login.
  if (!user) {
    // Menggunakan useEffect untuk menghindari error render di server
    React.useEffect(() => {
      router.push('/login');
    }, [router]);
    
    // Tampilkan loading lagi selagi menunggu redirect
    return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
  }

  // Jika user ada, render children (yaitu, layout admin atau halaman user biasa)
  return <>{children}</>;
}