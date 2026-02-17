import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { UserResponse } from '@/types';
import { authApi } from '@/api/services';

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, user: UserResponse) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
  });

  const login = useCallback((token: string, user: UserResponse) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setState({ user, token, loading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ user: null, token: null, loading: false });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await authApi.me();
      localStorage.setItem('user', JSON.stringify(user));
      setState((prev) => ({ ...prev, user, loading: false }));
    } catch {
      logout();
    }
  }, [logout]);

  // On mount, hydrate from localStorage / validate token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setState({ user: null, token: null, loading: false });
      return;
    }
    // Try to validate the token
    authApi
      .me()
      .then((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        setState({ user, token, loading: false });
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setState({ user: null, token: null, loading: false });
      });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
