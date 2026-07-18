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
  firebaseToken?: string;
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

/** Sign into Firebase Auth with custom token so Firestore security rules pass.
 *  Uses dynamic import so Firebase is never evaluated server-side. */
async function signInToFirebase(firebaseToken?: string) {
  if (!firebaseToken || typeof window === 'undefined') return;
  try {
    const { auth } = await import('../lib/firebase');
    const { signInWithCustomToken } = await import('firebase/auth');
    if (auth) await signInWithCustomToken(auth, firebaseToken);
  } catch (e) {
    console.warn('[Auth] signInWithCustomToken failed (non-fatal):', e);
  }
}

/** Sign out of Firebase Auth */
async function signOutFirebase() {
  if (typeof window === 'undefined') return;
  try {
    const { auth } = await import('../lib/firebase');
    const { signOut } = await import('firebase/auth');
    if (auth) await signOut(auth);
  } catch { /* ignore */ }
}

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
        // Re-sign into Firebase on session restore
        if (userData.firebaseToken) {
          signInToFirebase(userData.firebaseToken);
        }
      }
    } catch { /* ignore */ }
    setIsLoading(false);
  }, []);

  const setUser = (userData: UserData | null) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('fm_user', JSON.stringify(userData));
      if (userData.token) setToken(userData.token);
      // Sign into Firebase so Firestore rules pass
      if (userData.firebaseToken) {
        signInToFirebase(userData.firebaseToken);
      }
    } else {
      clearToken();
    }
  };

  const logout = () => {
    setUserState(null);
    clearToken();
    signOutFirebase();
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
