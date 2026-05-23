import axios from 'axios';

const TOKEN_KEY = 'dormitory_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor with retry logic for rate limit errors
let requestQueue = [];
let isRetrying = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const originalRequest = config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('dormitory_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Handle 429 Too Many Requests with exponential backoff
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Add request to queue if not already retrying
      if (!isRetrying) {
        isRetrying = true;
        
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          // Retry the original request
          return api.request(originalRequest);
        } catch (retryError) {
          isRetrying = false;
          return Promise.reject(retryError);
        } finally {
          isRetrying = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export const unwrapList = (res) => res.data?.data ?? [];
export const unwrapOne = (res) => res.data?.data ?? res.data;

export default api;
