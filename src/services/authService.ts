import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dsa_quest_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),

  getProfile: () => api.get('/auth/profile'),

  updateProfile: (data: { username?: string; avatar?: string }) =>
    api.put('/auth/profile', data),
};

export default api;
