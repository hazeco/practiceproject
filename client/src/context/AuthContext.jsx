
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
    // Listen for storage changes (multi-tab/session sync)
    const handleStorage = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Refresh token logic
  useEffect(() => {
    const refresh = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return;
      try {
        const res = await import('../services/auth').then(m => m.refreshToken(refreshToken));
        if (res && res.data && res.data.accessToken) {
          localStorage.setItem('token', res.data.accessToken);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    };
    // 20 hours = 20 * 60 * 60 * 1000 ms
    const interval = setInterval(refresh, 20 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const login = (user, token) => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
