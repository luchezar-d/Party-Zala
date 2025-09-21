import { create } from 'zustand';
import { api } from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user } = response.data;
      
      set({ user, loading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    
    try {
      await api.post('/auth/logout');
      set({ user: null, loading: false });
    } catch (error) {
      // Even if logout fails on server, clear local state
      set({ user: null, loading: false });
    }
  },

  hydrate: async () => {
    set({ loading: true });
    
    try {
      const response = await api.get('/auth/me');
      const { user } = response.data;
      
      set({ user, loading: false });
    } catch (error) {
      // User not authenticated, clear state
      set({ user: null, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
