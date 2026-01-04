import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || '';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify stored token with server
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: storedToken })
        });
        const data = await res.json();
        
        if (data.valid) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('auth_token');
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (data.success && data.token) {
        localStorage.setItem('auth_token', data.token);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, error: data.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Connection error' };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('auth_token');
    
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  const changePassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem('auth_token');
    
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, currentPassword, newPassword })
      });
      
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Change password error:', error);
      return { error: 'Connection error' };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
