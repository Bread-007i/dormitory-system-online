import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

const TOKEN_KEY = 'dormitory_token';
const USER_KEY = 'dormitory_user';

function normalizeRole(role) {
  if (role === 'manager') return 'staff';
  return role;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return { ...parsed, role: normalizeRole(parsed.role) };
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, id, name, role, email: userEmail } = res.data.data;
    const userData = {
      id,
      name,
      email: userEmail || email,
      role: normalizeRole(role),
    };
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const role = user?.role;

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      isAuthenticated: Boolean(token),
      isAdmin: role === 'admin',
      isStaff: role === 'staff',
      isTenant: role === 'tenant',
      canWrite: role === 'admin' || role === 'staff',
      login,
      logout,
    }),
    [user, token, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
