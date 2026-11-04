'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CustomerProfile } from '@/types/api';
import {
  apiGetCurrentUser,
  apiLogin,
  apiRegister,
  apiLogout,
  apiGetCustomerProfile,
} from '@/lib/api';

interface AuthContextType {
  user: User | null;
  profile: CustomerProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (payload: {
    full_name: string;
    email: string;
    mobile_number: string;
    customer_type?: 'individual' | 'business';
    password: string;
    password_confirmation: string;
    business_name?: string;
    business_type?: string;
    gstin?: string;
  }) => Promise<{ success: boolean; error?: string; errors?: Record<string, string[] | string> }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndUser = async () => {
    try {
      const userRes = await apiGetCurrentUser();
      if (userRes.data) {
        setUser(userRes.data);
        if (userRes.data.profile) {
          setProfile(userRes.data.profile);
        } else {
          const profileRes = await apiGetCustomerProfile();
          if (profileRes.data) {
            setProfile(profileRes.data);
          }
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await apiLogin({ email, password });
    if (res.status === 'success' && res.user) {
      setUser(res.user);
      setProfile(res.user.profile || null);
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
    return {
      success: false,
      error: res.detail || 'Login failed. Please check your credentials.',
    };
  };

  const register = async (payload: {
    full_name: string;
    email: string;
    mobile_number: string;
    customer_type?: 'individual' | 'business';
    password: string;
    password_confirmation: string;
    business_name?: string;
    business_type?: string;
    gstin?: string;
  }) => {
    setLoading(true);
    const res = await apiRegister(payload);
    if (res.status === 'success' && res.user) {
      setUser(res.user);
      setProfile(res.user.profile || null);
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
    return {
      success: false,
      error: res.detail || 'Registration failed. Please review errors.',
      errors: res.errors,
    };
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setProfile(null);
  };

  const refreshUser = async () => {
    await fetchProfileAndUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

