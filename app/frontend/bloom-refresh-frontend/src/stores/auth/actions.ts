import { AuthState } from '@/types/auth';
import apiClient from '@/api/client';
import { refreshTokenIfNeeded } from '@/lib/tokenRefresh';

export const authActions = (
  set: (state: Partial<AuthState>) => void
) => ({
  setAuthLoading: (loading: boolean) => set({ isLoading: loading }),
  clearError: () => set({ error: null }),
  setToken: (token: string) => set({ token, isAuthenticated: !!token }),

  refreshToken: async (): Promise<string | null> => {
    return await refreshTokenIfNeeded();
  },

  loginUser: async (credentials: { username: string; password: string }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.login(credentials);
      if (response?.access_token && response?.user) {
        set({
          user: response.user,
          token: response.access_token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Failed to login',
      });
    }
  },

  signupUser: async (userData: { username: string; password: string; email: string; role: 'volunteer' | 'organizer' }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.signup(userData);
      if (response?.access_token && response?.user) {
        set({
          user: response.user,
          token: response.access_token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else if (response?.message === "User created successfully") {
        set({ isLoading: false, error: null });
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: any) {
      set({
        isLoading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        error: error.message || 'Failed to sign up',
      });
    }
  },

  logoutUser: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
});
