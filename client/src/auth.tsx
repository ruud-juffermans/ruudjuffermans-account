import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth as authApi, ApiError } from './api';
import type { AuthUser } from './types';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, app?: string) => Promise<void>;
  guest: (app?: string) => Promise<void>;
  convert: (data: { email: string; password: string; name?: string }) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const { user } = await authApi.me();
      setUser(user);
    } catch (err) {
      // 401 simply means "not signed in"; anything else we also treat as signed out.
      if (!(err instanceof ApiError)) console.error(err);
      setUser(null);
    }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string, app?: string) {
    const { user } = await authApi.login({ email, password, app });
    setUser(user);
  }

  async function guest(app?: string) {
    const { user } = await authApi.guest(app);
    setUser(user);
  }

  async function convert(data: { email: string; password: string; name?: string }) {
    const { user } = await authApi.convert(data);
    setUser(user);
  }

  async function updateName(name: string) {
    const { user } = await authApi.updateMe({ name });
    setUser(user);
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, guest, convert, updateName, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
