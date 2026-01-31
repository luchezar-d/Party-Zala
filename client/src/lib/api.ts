import axios from 'axios';
// import { toast } from 'sonner'; // MVP: Disabled for auth-free mode

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// MVP: Auth disabled - these variables not needed but kept for future use
// let authErrorShown = false;
// let authErrorTimeout: number | null = null;

// Debug: Log the API URL being used
console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_URL,
  baseURL: `${API_URL}/api`,
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
});

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🌐 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      withCredentials: config.withCredentials
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
    console.log('✅ API Response:', {
      status: response.status,
      contentType: response.headers['content-type'],
      isJSON: response.headers['content-type']?.includes('application/json'),
      isHTML: response.headers['content-type']?.includes('text/html'),
      dataType: typeof response.data,
      dataPreview: typeof response.data === 'string' ? response.data.substring(0, 100) : 'object'
    });
    
    // WARNING: If we get HTML when expecting JSON, the API URL is wrong!
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      console.error('🚨 CRITICAL: API returned HTML instead of JSON!');
      console.error('🚨 This means VITE_API_URL is pointing to the CLIENT instead of the SERVER');
      console.error('🚨 Check your Railway environment variables!');
      console.error('🚨 VITE_API_URL should be: https://your-SERVER-name.up.railway.app');
    }
    
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data || error.message,
      url: error.config?.url,
      method: error.config?.method,
      cookies: document.cookie
    });
    
    // MVP: Auth disabled - no 401 handling needed
    // TODO: Re-enable for production with external users
    /* COMMENTED OUT FOR MVP - KEEP FOR FUTURE USE
    // Handle 401 Unauthorized errors globally
    if (error.response?.status === 401) {
      const isAuthMeRequest = error.config?.url?.includes('/auth/me');
      const isOnLoginPage = window.location.pathname === '/';
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      
      console.log('🔐 401 Error Debug:', {
        isAuthMeRequest,
        isOnLoginPage,
        isLoginRequest,
        pathname: window.location.pathname,
        url: error.config?.url,
        willShowToast: !isAuthMeRequest && !isOnLoginPage && !authErrorShown,
        cookies: document.cookie
      });
      
      if (!isAuthMeRequest && !isOnLoginPage && !isLoginRequest && !authErrorShown) {
        authErrorShown = true;
        toast.error('Session expired. Please log in again.', {
          id: 'auth-error',
          duration: 5000
        });
        
        if (authErrorTimeout) clearTimeout(authErrorTimeout);
        authErrorTimeout = setTimeout(() => {
          authErrorShown = false;
        }, 2000) as unknown as number;
        
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    }
    */
    
    return Promise.reject(error);
  }
);

export default api;
