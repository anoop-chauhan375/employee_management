import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/services';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const hasToken = localStorage.getItem('access-token');
      if (hasToken) {
        try {
          const response = await authService.getMe();
          if (response.data.success) {
            setCurrentUser(response.data.data);
          }
        } catch (error) {
          localStorage.removeItem('access-token');
          localStorage.removeItem('token-type');
          localStorage.removeItem('uid');
          localStorage.removeItem('client');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await authService.signIn(email, password);
      if (response.data.success) {
        setCurrentUser(response.data.data);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error(error);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem('access-token');
      localStorage.removeItem('token-type');
      localStorage.removeItem('uid');
      localStorage.removeItem('client');
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      loading,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};
