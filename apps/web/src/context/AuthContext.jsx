import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext.js';
import * as AuthService from '../services/AuthService';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      return;
    }
    let mounted = true;

    AuthService.me()
      .then((currentUser) => {
        if (mounted) setUser(currentUser);
      })
      .catch(() => AuthService.logout())
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const data = await AuthService.login(email, password);
    setUser(data.user);
    return data.user;
  };

  const register = (payload) => AuthService.register(payload);

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: Boolean(user), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}