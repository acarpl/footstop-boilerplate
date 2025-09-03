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

// ==================== Types ====================
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

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

// ==================== Context ====================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ==================== AUTH ====================
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await apiClient.get<User>("/auth/profile");
      setUser(response.data);
    } catch (_) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const checkInitialSession = async () => {
      await fetchUserProfile();
      setLoading(false);
    };
    checkInitialSession();
  }, [fetchUserProfile]);

  const login = async (email: string, password: string) => {
    await apiClient.post("/auth/login", { email, password });
    await fetchUserProfile();
  };

  const register = async (data: RegisterInput) => {
    await apiClient.post("/auth/register", data);
    await fetchUserProfile();
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (_) {}
    setUser(null);
    clearCart();
    window.location.href = "/login";
  };

  // ==================== CART ====================
  // Load cart dari localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Sync cart ke localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCartItems([]);

  // ==================== LOADING ====================
  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
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
