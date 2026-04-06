import axios from 'axios';
import { getStoredToken } from '../store/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_URL,
  baseURL: `${API_URL}/api`,
  mode: import.meta.env.MODE,
});

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token from localStorage on every request
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('🌐 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasToken: !!token,
    });
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // WARNING: If we get HTML when expecting JSON, the API URL is wrong!
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      console.error('🚨 CRITICAL: API returned HTML instead of JSON! Check VITE_API_URL.');
    }
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      message: error.response?.data || error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default api;
