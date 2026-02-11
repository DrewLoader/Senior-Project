import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authApi from '../api/auth';

export interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | { name: string } | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  continueAsGuest: () => void;
  setUser: (user: User | { name: string } | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | { name: string } | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !isGuest && 'id' in user;

  useEffect(() => {
    const token = localStorage.getItem('mealmate_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .getMe()
      .then((res) => {
        if (res.success && res.user) {
          setUserState(res.user);
          setIsGuest(false);
        }
      })
      .catch(() => {
        authApi.clearAuthToken();
      })
      .finally(() => setLoading(false));
  }, []);

  const setUser = (u: User | { name: string } | null) => {
    setUserState(u);
    if (!u) setIsGuest(false);
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    if (!res.success || !res.token || !res.user) throw new Error('Login failed');
    authApi.setAuthToken(res.token);
    setUserState(res.user);
    setIsGuest(false);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authApi.register(name, email, password);
    if (!res.success || !res.token || !res.user) throw new Error('Registration failed');
    authApi.setAuthToken(res.token);
    setUserState(res.user);
    setIsGuest(false);
  };

  const signOut = () => {
    authApi.clearAuthToken();
    setUserState(null);
    setIsGuest(false);
    localStorage.removeItem('mealmate_plan');
    localStorage.removeItem('mealmate_session');
  };

  const continueAsGuest = () => {
    setUserState({ name: 'Guest' });
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        isAuthenticated,
        loading,
        login,
        register,
        signOut,
        continueAsGuest,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
