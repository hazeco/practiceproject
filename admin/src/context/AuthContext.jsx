import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        // เรียก endpoint ที่ต้อง auth เช่น /users (หรือ /me ถ้ามี)
        await axios.get('/users');
        setIsAuthenticated(true);
      } catch (err) {
        // ถ้า token หมดอายุหรือไม่ valid ให้ logout
        localStorage.removeItem('admin_token');
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/login', { email, password });
      localStorage.setItem('admin_token', res.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
