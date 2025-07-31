'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import apiClient from '../lib/apiClient'; // Pastikan path ini benar
import axios from 'axios';

// --- Tipe User ---
interface User {
  phone_number: any;
  id_user: number;
  username: string;
  email: string;
  // Tambahkan properti lain dari /auth/profile jika ada
}

// --- Tipe Context ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
}

// --- Tipe untuk input register ---
interface RegisterInput {
  username: string;
  email: string;
  password: string;
  phone_number?: string;
  // Tambahkan input lain jika perlu
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Ambil user aktif ---
  const fetchUser = async () => {
    try {
      console.log('--- AuthContext: fetchUser() called ---');
      const response = await apiClient.get<User>('/auth/profile');
      console.log('✅ /auth/profile SUCCESS:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('❌ /auth/profile FAILED:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error response:', error.response?.status, error.response?.data);
      }
      setUser(null);
    }
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      await fetchUser();
      setLoading(false);
    };
    checkUserStatus();
  }, []);

  // --- Login ---
  const login = (email: string, password: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const loginResponse = await apiClient.post('/auth/login', { email, password });
        console.log('✅ Login API success:', loginResponse);
        await fetchUser();
        resolve();
      } catch (err) {
        console.error('❌ Login error:', err);
        reject(err);
      }
    });
  };

  // --- Register ---
  const register = (data: RegisterInput): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const registerResponse = await apiClient.post('/auth/register', data);
        console.log('✅ Register API success:', registerResponse);

        // Opsional: Langsung login atau fetch user setelah daftar
        await login(data.email, data.password); // auto login setelah register
        resolve();
      } catch (err) {
        console.error('❌ Register error:', err);
        reject(err);
      }
    });
  };

  // --- Logout ---
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
    return <div>Loading Authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Hook custom ---
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;