// context/AuthContext.tsx

'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import apiClient from '../lib/apiClient'; // Pastikan path ini benar
import axios from 'axios';

// Definisikan tipe untuk data User agar lebih aman
interface User {
  phone_number: any;
  id_user: number;
  username: string;
  email: string;
  // Tambahkan properti lain yang dikembalikan oleh endpoint /auth/profile
}

// Definisikan tipe untuk nilai yang disediakan oleh Context
interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: any, password: any) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // FIX 2: Fungsi ini WAJIB ada. Tugasnya bertanya ke backend "siapa saya?".
  // Di dalam AuthProvider
const fetchUser = async () => {
    try {
      console.log('--- AuthContext: fetchUser() called ---');
      const response = await apiClient.get<User>('/auth/profile');
      
      // Jika request berhasil, log data yang diterima
      console.log('✅ AuthContext: /auth/profile SUCCESS. Data:', response.data);
      setUser(response.data);

    } catch (error) {
      // Jika request GAGAL, log errornya secara detail
      console.error('❌ AuthContext: /auth/profile FAILED. Error details:', error);
      
      // Kita bisa lihat detail error dari axios
      if (axios.isAxiosError(error)) {
        console.error('Axios error response:', error.response?.status, error.response?.data);
      }
      
      setUser(null);
    }
};

  // Di dalam AuthProvider
useEffect(() => {
    console.log('--- AuthContext: Initial mount, checking user status... ---');
    const checkUserStatus = async () => {
      await fetchUser();
      setLoading(false);
      console.log('--- AuthContext: Initial status check complete. ---');
    };
    checkUserStatus();
}, []);

   const login = (email: string, password: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      console.log('--- AuthContext: Attempting login ---');
      try {
        // 1. Panggil API login
        const loginResponse = await apiClient.post('/auth/login', { email, password });
        console.log('✅ AuthContext: Login API call successful.', loginResponse);

        // 2. SETELAH login berhasil, panggil fetchUser
        console.log('--- AuthContext: Fetching user profile after login... ---');
        await fetchUser(); 
        
        console.log('✅ AuthContext: Login process complete, resolving promise.');
        resolve(); 
      } catch (err) {
        console.error('❌ AuthContext: Login API call or fetchUser FAILED.', err);
        reject(err);
      }
    });
};
  // FIX 3: Fungsi logout harus memanggil API backend.
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