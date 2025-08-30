
"use client";

import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'wordwave_auth';
const USER_STORAGE_KEY = 'wordwave_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const authFromStorage = localStorage.getItem(AUTH_STORAGE_KEY);
      const userFromStorage = localStorage.getItem(USER_STORAGE_KEY);
      if (authFromStorage && userFromStorage) {
        setIsAuthenticated(JSON.parse(authFromStorage));
        setUser(JSON.parse(userFromStorage));
      }
    } catch (error) {
      console.error("Failed to parse auth state from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(true));
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    router.push('/login');
  }, [router]);

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
