'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setToken, clearToken } from '../lib/api';

interface UserData {
  uid: string;
  name: string;
  phone: string;
  phoneNumber?: string;
  email?: string;
  role?: string;
  token?: string;
  referralCode?: string;
  homeAddress?: AddressData;
  workAddress?: AddressData;
  otherAddress?: AddressData;
  defaultAddress?: string;
  age?: string;
  gender?: string;
  bloodGroup?: string;
}

interface AddressData {
  name?: string;
  phone?: string;
  houseNo?: string;
  locality?: string;
  landmark?: string;
  pinCode?: string;
  district?: string;
  state?: string;
  coordinates?: { latitude: number; longitude: number } | null;
}

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  setUser: (user: UserData | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fm_user');
      const token = localStorage.getItem('fm_token');
      if (stored && token) {
        const userData = JSON.parse(stored) as UserData;
        setUserState(userData);
      }
    } catch { /* ignore */ }
    setIsLoading(false);
  }, []);

  const setUser = (userData: UserData | null) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('fm_user', JSON.stringify(userData));
      if (userData.token) setToken(userData.token);
    } else {
      clearToken();
    }
  };

  const logout = () => {
    setUserState(null);
    clearToken();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
