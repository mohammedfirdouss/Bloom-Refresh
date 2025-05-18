import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { refreshTokenIfNeeded } from '@/lib/tokenRefresh';
import { useAuthStore } from '@/stores/auth/store';

// Types for the API client
export interface ApiClientOptions {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(options: ApiClientOptions) {
    this.baseURL = options.baseURL;
    
    this.client = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Try to refresh token if needed before making request
        const token = await refreshTokenIfNeeded();
        
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // If token expired error and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Force token refresh
            const { refreshToken } = useAuthStore.getState();
            const newToken = await refreshToken();
            
            if (newToken) {
              // Update the failed request with new token
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // If refresh failed, logout user
            const { logoutUser } = useAuthStore.getState();
            logoutUser();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Generic request method with proper typing
  async request<T = any, R = AxiosResponse<T>>(
    endpoint: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response = await this.client.request<T, R>({
        url: endpoint,
        ...options,
      });
      
      return (response as AxiosResponse<T>).data;
    } catch (error: any) {
      // Enhanced error handling
      if (error.response) {
        // Server responded with non-2xx status
        const message = error.response.data?.message || 'An error occurred with the request';
        const customError = new Error(message);
        customError.name = 'ApiError';
        Object.assign(customError, { 
          status: error.response.status,
          data: error.response.data
        });
        throw customError;
      } else if (error.request) {
        // Request made but no response received
        console.error("API request failed: Network Error", error);
        throw new Error("Unable to connect to the server. Please check your connection or try again later.");
      } else {
        // Error setting up request
        console.error("API request setup error:", error);
        throw error;
      }
    }
  }

  // HTTP method wrappers
  async get<T = any>(endpoint: string, params?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', data });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', data });
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', data });
  }

  async delete<T = any>(endpoint: string, params?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', params });
  }

  // Event-specific methods
  async createEvent(data: any): Promise<any> {
    return this.post('/events', data);
  }

  // Auth methods
  async refreshToken(): Promise<{ access_token: string }> {
    return this.post('/auth/refresh');
  }

  async login(credentials: { username: string; password: string }) {
    return this.post('/auth/login', credentials);
  }

  async signup(userData: { username: string; password: string; email: string; role: 'volunteer' | 'organizer' }) {
    return this.post('/auth/signup', userData);
  }
}

// Create and export API client instance
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const apiClient = new ApiClient({ baseURL: apiBaseUrl });

export default apiClient;
