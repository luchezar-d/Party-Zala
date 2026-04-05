import { create } from 'zustand';
import { api } from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: () => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  isAdmin: () => get().user?.role === 'admin',

  login: async (email: string, password: string) => {
    console.log('🔐 Auth Store: Starting login...', { email });
    set({ loading: true, error: null });
    
    try {
      console.log('📤 Auth Store: Sending login request...');
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Auth Store: Login response:', response.data);
      console.log('🍪 Auth Store: Response headers:', {
        'set-cookie': response.headers['set-cookie'],
        'access-control-allow-credentials': response.headers['access-control-allow-credentials'],
        'access-control-allow-origin': response.headers['access-control-allow-origin'],
        all: response.headers
      });
      
      const { user } = response.data;
      
      set({ user, loading: false });
      console.log('✅ Auth Store: User set in state:', user);
      console.log('🍪 Auth Store: Document cookies after login:', document.cookie);
    } catch (error: any) {
      console.error('❌ Auth Store: Login failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
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
    console.log('💧 Auth Store: Hydrating auth state...');
    console.log('🍪 Document cookies:', document.cookie);
    set({ loading: true });
    
    try {
      console.log('📤 Auth Store: Sending /auth/me request...');
      const response = await api.get('/auth/me');
      console.log('✅ Auth Store: /auth/me response:', response.data);
      const { user } = response.data;
      
      set({ user, loading: false });
      console.log('✅ Auth Store: User hydrated:', user);
    } catch (error: any) {
      console.log('ℹ️  Auth Store: Not authenticated', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      // User not authenticated, clear state
      set({ user: null, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
