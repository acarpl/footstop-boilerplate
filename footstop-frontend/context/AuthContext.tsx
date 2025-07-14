// context/AuthContext.tsx

'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import apiClient from '../lib/apiClient'; // Pastikan path ini benar

// 1. Tipe User yang lebih spesifik dan lengkap
interface User {
  phone_number: any;
  id_user: number;
  username: string;
  email: string;
  role: {
    id_role: number;
    nama_role: string;
  };
}

// 2. Tipe Context yang lebih spesifik
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>; // Menggunakan string, bukan any
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Mengambil data profil pengguna dari server untuk memverifikasi sesi aktif.
   * Ini adalah "sumber kebenaran" untuk status login.
   */
  const fetchUser = async () => {
    try {
      const response = await apiClient.get<User>('/auth/profile');
      setUser(response.data);
    } catch (error) {
      // Jika error (misal 401), berarti tidak ada sesi, set user ke null.
      setUser(null);
    }
  };

  // Jalankan pemeriksaan sesi sekali saat aplikasi dimuat
  useEffect(() => {
    const checkUserStatus = async () => {
      await fetchUser();
      setLoading(false);
    };
    checkUserStatus();
  }, []);

  /**
   * Menangani proses login. Memanggil API, lalu memperbarui state user.
   * @param email - Email pengguna
   * @param password - Password pengguna
   */
  const login = (email: string, password: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        await apiClient.post('/auth/login', { email, password });
        // Setelah login berhasil, langsung perbarui state dengan data user baru
        await fetchUser(); 
        resolve(); 
      } catch (err) {
        reject(err);
      }
    });
  };

  /**
   * Menangani proses logout. Memanggil API dan membersihkan state.
   */
  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Selalu bersihkan state dan arahkan ulang, bahkan jika API gagal
      setUser(null);
      // Menggunakan window.location.href akan memaksa refresh penuh,
      // memastikan semua state di-reset dengan bersih.
      window.location.href = '/login'; 
    }
  };

  // Tampilkan loading screen sederhana selagi status otentikasi diperiksa
  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook kustom untuk menggunakan context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};