// Auth Context — Kavi's file
// Provides auth convenience hooks for components

import { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction, clearError } from '../store/authSlice';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(logoutAction());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const value = {
    ...auth,
    logout,
    clearError: handleClearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
