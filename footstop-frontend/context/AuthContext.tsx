"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import apiClient from "../lib/apiClient";
import { TokenUtil } from "../utils/token";
import Loading from "#/components/loading";

interface User {
  id_user: number;
  username: string;
  email: string;
  phone_number?: string;
  id_role: number;
  role_id?: number;
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

  const fetchUser = async () => {
    try {
      const response = await apiClient.get<User>("/auth/profile");
      setUser(response.data);
    } catch (_) {
      setUser(null);
    }
  };

  useEffect(() => {
    TokenUtil.loadToken();
    const checkUser = async () => {
      await fetchUser();
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    const { accessToken, refreshToken } = response.data;

    if (accessToken && refreshToken) {
      TokenUtil.setAccessToken(accessToken);
      TokenUtil.setRefreshToken(refreshToken);
    }

    await fetchUser();
  };

  const register = async (data: RegisterInput) => {
    const response = await apiClient.post("/auth/register", data);
    const { accessToken, refreshToken, user: newUser } = response.data;

    if (accessToken && refreshToken) {
      TokenUtil.setAccessToken(accessToken);
      TokenUtil.setRefreshToken(refreshToken);
    }

    setUser(newUser);
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (_) {
      // ignore error
    }
    TokenUtil.clearAccessToken();
    TokenUtil.clearRefreshToken();
    setUser(null);
  };

  if (loading) return <Loading />;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default AuthProvider;
