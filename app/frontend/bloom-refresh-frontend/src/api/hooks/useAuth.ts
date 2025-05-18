import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, LoginParams, SignupParams, AuthResponse } from '../services/auth';
import { useAuthStore } from '@/stores/auth/store';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  token: () => [...authKeys.all, 'token'] as const
};

// Hooks
export const useLogin = () => {
  const { loginUser } = useAuthStore();
  
  return useMutation({
    mutationFn: (credentials: LoginParams) => authService.login(credentials),
    onSuccess: (response: AuthResponse) => {
      // Update auth store with user data and token
      if (response.access_token && response.user) {
        loginUser({
          username: response.user.username,
          password: '' // Don't store password
        });
      }
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (userData: SignupParams) => authService.signup(userData),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logoutUser } = useAuthStore();
  
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear auth store
      logoutUser();
      
      // Clear all queries from cache on logout
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string, newPassword: string }) => 
      authService.resetPassword(token, newPassword),
  });
};
