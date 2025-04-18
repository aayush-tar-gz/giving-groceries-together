
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Failed to restore session');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.login(email, password);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err) {
      setError(err.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await api.signup(userData);
      // Automatically log in after signup
      return await login(userData.email, userData.password);
    } catch (err) {
      setError(err.error || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Auth context value
  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isRetailer: user?.role === 'retailer',
    isNGO: user?.role === 'ngo',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
