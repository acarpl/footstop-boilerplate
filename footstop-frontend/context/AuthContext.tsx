"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import apiClient from "../lib/apiClient";
import Loading from "#/components/loading";

// Tipe data untuk User, disesuaikan dengan respons backend
interface User {
  id_user: number;
  username: string;
  email: string;
  phone_number?: string;
  role: {
    id_role: number;
    nama_role: string;
  };
}

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  phone_number?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fungsi tunggal untuk memeriksa sesi dengan bertanya ke backend
  const fetchUserProfile = useCallback(async () => {
    try {
      // Browser akan otomatis mengirim cookie karena `withCredentials: true` di apiClient
      const response = await apiClient.get<User>("/auth/profile");
      setUser(response.data);
    } catch (_) {
      // Jika error (401), berarti tidak ada sesi valid
      setUser(null);
    }
  }, []);

  // Periksa sesi saat aplikasi pertama kali dimuat
  useEffect(() => {
    const checkInitialSession = async () => {
      await fetchUserProfile();
      setLoading(false);
    };
    checkInitialSession();
  }, [fetchUserProfile]);

  // Logika login disederhanakan
  const login = async (email: string, password: string) => {
    // API call di sini akan membuat backend mengatur cookie
    await apiClient.post("/auth/login", { email, password });
    // Setelah cookie diatur, perbarui state user dengan data terbaru
    await fetchUserProfile();
  };

  // Logika register disederhanakan
  const register = async (data: RegisterInput) => {
    // API call ini akan membuat user baru DAN membuat backend mengatur cookie
    // jika Anda menggunakan metode registerAndLogin
    await apiClient.post("/auth/register", data);
    // Setelah registrasi dan login otomatis, perbarui state user
    await fetchUserProfile();
  };

  // Logika logout disederhanakan
  const logout = async () => {
    try {
      // Beritahu backend untuk menghapus sesi dan cookie
      await apiClient.post("/auth/logout");
    } catch (_) {
      // Tetap lanjutkan logout di frontend bahkan jika API gagal
    }
    setUser(null);
    // Paksa refresh ke halaman login untuk membersihkan semua state
    window.location.href = "/login";
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
