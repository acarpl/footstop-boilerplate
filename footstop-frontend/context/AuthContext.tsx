'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import apiClient from '../lib/apiClient'; // Pastikan path ini benar

// Definisikan tipe untuk data User yang diterima dari API
interface User {
  phone_number: any;
  id_user: number;
  username: string;
  email: string;
  // Tambahkan properti lain jika ada, misal: role
}

// Definisikan tipe untuk nilai yang disediakan oleh Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: any, password: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data profil user dari backend
  const fetchUser = async () => {
    try {
      const response = await apiClient.get<User>('/auth/profile');
      setUser(response.data);
      console.log("User data fetched successfully in Context:", response.data);
    } catch (error) {
      // Ini normal terjadi jika user belum login
      setUser(null);
      console.log("No active session found.");
    }
  };

  // Jalankan pemeriksaan sesi saat aplikasi pertama kali dimuat
  useEffect(() => {
    const checkUserStatus = async () => {
      await fetchUser();
      setLoading(false);
    };
    checkUserStatus();
  }, []); // Dependensi kosong berarti hanya berjalan sekali

  const login = async (email: any, password: any) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await apiClient.post('/auth/login', { email, password });
        // Setelah login, langsung panggil fetchUser untuk memperbarui state
        await fetchUser(); 
        resolve(); 
      } catch (err) {
        reject(err);
      }
    });
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
    }
  };

  if (loading) {
    // Tampilkan pesan loading selagi memeriksa sesi
    return <div>Loading Authentication...</div>;
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