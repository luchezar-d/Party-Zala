import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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
      message: error.response?.data || error.message
    });
    
    // Don't auto-redirect on 401 - let the app handle it
    // The auth store will handle clearing the user state
    
    return Promise.reject(error);
  }
);

export default api;
