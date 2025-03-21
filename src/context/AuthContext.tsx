'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        console.log("Checking if user is logged in...");
        setLoading(true);
        const res = await fetch('/api/auth/user');
        
        console.log("Auth check response:", { status: res.status, ok: res.ok });
        
        if (res.ok) {
          const data = await res.json();
          console.log("Auth check data:", { success: data.success, hasUser: !!data.user });
          
          if (data.success && data.user) {
            console.log("User is authenticated:", { username: data.user.username });
            setUser(data.user);
          } else {
            console.log("User is not authenticated");
          }
        } else {
          console.log("Failed to check authentication status");
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const register = async (username: string, email: string, password: string) => {
    try {
      console.log("Starting registration process...");
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      console.log("Registration response:", { status: response.status, ok: response.ok });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Registration failed:", data);
        throw new Error(data.message || 'Registration failed');
      }
      
      console.log("Registration successful:", { username: data.user.username });
      setUser(data.user);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Starting login process...");
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log("Login response:", { status: response.status, ok: response.ok });
      
      const data = await response.json();
      console.log("Login data received:", { success: data.success, hasUser: !!data.user });
      
      if (!response.ok) {
        console.error("Login failed:", data);
        throw new Error(data.message || 'Login failed');
      }
      
      console.log("Login successful:", { username: data.user.username });
      setUser(data.user);
    } catch (err) {
      console.error("Login error details:", err);
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      console.log("Login process in auth context completed");
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Starting logout process...");
      setLoading(true);
      const response = await fetch('/api/auth/user', { method: 'POST' });
      console.log("Logout response:", { status: response.status, ok: response.ok });
      
      setUser(null);
      console.log("User logged out successfully");
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 