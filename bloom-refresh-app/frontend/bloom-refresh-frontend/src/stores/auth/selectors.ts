import { GetState } from 'zustand';
import { AuthState } from '@/types/auth';

export const authSelectors = (get: GetState<AuthState>) => ({
  getUser: () => get().user,
  getToken: () => get().token,
  isAuthenticated: () => get().isAuthenticated,
  isLoading: () => get().isLoading,
  getError: () => get().error,
});
