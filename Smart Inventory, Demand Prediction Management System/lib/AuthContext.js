'use client';

/**
 * Authentication Context
 * ======================
 * 
 * Provides auth state (login/logout/user info) across the app.
 * Persists user session in localStorage.
 */

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('smartinv_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      localStorage.removeItem('smartinv_user');
    }
    setLoading(false);
  }, []);

  async function login(username, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    const userData = result.data;
    setUser(userData);
    localStorage.setItem('smartinv_user', JSON.stringify(userData));
    return userData;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('smartinv_user');
  }

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
