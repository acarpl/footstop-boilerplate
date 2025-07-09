// context/AuthContext.tsx

'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import apiClient from '../lib/apiClient'; // Pastikan path ini benar

// Definisikan tipe untuk data User agar lebih aman
interface User {
  id_user: number;
  username: string;
  email: string;
  // Tambahkan properti lain yang dikembalikan oleh endpoint /auth/profile
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

  // FIX 2: Fungsi ini WAJIB ada. Tugasnya bertanya ke backend "siapa saya?".
  const fetchUser = async () => {
    try {
      // Panggil endpoint profile. Browser akan otomatis mengirim cookie.
      const response = await apiClient.get<User>('/auth/profile');
      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      // Jika gagal (error 401), berarti tidak ada sesi login yang valid.
      setUser(null);
    }
  };

  useEffect(() => {
    // FIX 1: Hapus semua logika localStorage.
    // Sebagai gantinya, panggil fetchUser untuk memeriksa sesi via cookie.
    const checkUserStatus = async () => {
      await fetchUser();
      setLoading(false); // Hentikan loading setelah selesai memeriksa.
    };
    checkUserStatus();
  }, []); // [] berarti ini hanya berjalan sekali saat komponen dimuat.

  // Fungsi login Anda sudah hampir benar, kita hanya perlu memastikannya
  // memanggil fetchUser yang sudah kita definisikan.
   const login = async (email: any, password: any) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        // 1. Panggil API login. Backend akan mengatur cookie.
        await apiClient.post('/auth/login', { email, password });
        
        // 2. SETELAH login berhasil, LANGSUNG panggil fetchUser.
        // Ini akan mengambil data profil menggunakan cookie yang baru saja diatur
        // dan langsung memperbarui state 'user' di context.
        await fetchUser(); 
        
        // 3. Beri tahu komponen pemanggil bahwa semuanya berhasil.
        resolve(); 
      } catch (err) {
        // 4. Jika gagal, kirim error.
        reject(err);
      }
    });
  };
  // FIX 3: Fungsi logout harus memanggil API backend.
  const logout = async () => {
    try {
      // Beritahu backend untuk menghapus sesi/refresh token.
      await apiClient.post('/auth/logout');
      // Set state user menjadi null di frontend.
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Bahkan jika API gagal, tetap paksa logout di frontend.
      setUser(null);
    }
  };

  if (loading) {
    return <div>Loading Authentication...</div>; // Tampilkan pesan loading yang jelas.
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook kustom untuk menggunakan context, sudah benar.
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};