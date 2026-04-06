import { create } from 'zustand';
import { api } from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
}

const TOKEN_KEY = 'party_zala_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
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
      
      const { user, token } = response.data;
      
      // Store token in localStorage for cross-origin Bearer auth
      if (token) {
        saveToken(token);
        console.log('💾 Auth Store: Token saved to localStorage');
      }
      
      set({ user, loading: false });
      console.log('✅ Auth Store: User set in state:', user);
    } catch (error: any) {
      console.error('❌ Auth Store: Login failed:', {
        status: error.response?.status,
        data: error.response?.data,
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
    } catch (error) {
      // Ignore server errors on logout
    } finally {
      clearToken();
      set({ user: null, loading: false });
    }
  },

  hydrate: async () => {
    console.log('💧 Auth Store: Hydrating auth state...');
    set({ loading: true });
    
    // If no token stored, skip the network call entirely
    if (!getStoredToken()) {
      console.log('ℹ️  Auth Store: No stored token, skipping hydration');
      set({ user: null, loading: false });
      return;
    }
    
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
        data: error.response?.data
      });
      // Token is invalid/expired — clear it
      clearToken();
      set({ user: null, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
