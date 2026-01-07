import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
    // eslint-disable-next-line
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (data) => {
    // TODO: Implement register logic
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 