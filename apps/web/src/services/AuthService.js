import api from './api';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  return data;
};

export const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const me = async () => {
  const { data } = await api.get('/auth/me');
  return data.user ?? data;
};

export const logout = () => localStorage.removeItem('token');