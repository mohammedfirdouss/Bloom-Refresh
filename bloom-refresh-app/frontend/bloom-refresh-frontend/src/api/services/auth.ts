import apiClient from '../client';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'volunteer' | 'organizer';
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface SignupParams {
  username: string;
  email: string;
  password: string;
  role: 'volunteer' | 'organizer';
}

export interface AuthResponse {
  user: User;
  access_token: string;
  message?: string;
}

// Auth service
export const authService = {
  login: async (credentials: LoginParams) => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },
  
  signup: async (userData: SignupParams) => {
    return apiClient.post<AuthResponse>('/auth/signup', userData);
  },
  
  refreshToken: async () => {
    return apiClient.post<{ access_token: string }>('/auth/refresh');
  },
  
  logout: async () => {
    return apiClient.post('/auth/logout');
  },
  
  forgotPassword: async (email: string) => {
    return apiClient.post('/auth/forgot-password', { email });
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  }
};
