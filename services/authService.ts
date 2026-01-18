// services/authService.ts - FIXED
import { api } from '@/lib/api';

export const authService = {
  async register(userData: { username: string; email: string; password: string }) {
    const response = await api.register(userData);
    if (response.success && typeof window !== 'undefined') {
      // Backend sudah tidak return token saat register
      // User harus login setelah register
    }
    return response;
  },

  async login(credentials: { email: string; password: string }) {
    const response = await api.login(credentials);
    if (response.success && typeof window !== 'undefined' && response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  isAuthenticated() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      return !!(token && user);
    }
    return false;
  },

  async updateProfile(userData: any) {
    const response = await api.updateProfile(userData);
    if (response.success && typeof window !== 'undefined' && response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  }
};