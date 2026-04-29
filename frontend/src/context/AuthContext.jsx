import { useCallback, useMemo, useState, useEffect } from 'react';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import AuthContext from './authContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.get(ENDPOINTS.AUTH.PROFILE);
          setUser(res.data.data);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token, logout]);

  const login = useCallback(async (email, password) => {
    const res = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    const { token, ...userData } = res.data.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
    return res.data.data;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
    const { token, ...newUserData } = res.data.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(newUserData);
    return res.data.data;
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'Admin',
    isSupport: user?.role === 'Support',
  }), [user, token, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
