import { create } from 'zustand';
import apiClient from '@/api/client';
import { persist, createJSONStorage } from 'zustand/middleware';
import { refreshTokenIfNeeded } from '@/lib/tokenRefresh';

interface User {
  id: string;
  username: string;
  role: 'volunteer' | 'organizer';
  // Add other user properties as needed from backend response
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface SignupData {
  username: string;
  password: string;
  email: string;
  role: 'volunteer' | 'organizer';
}

interface AuthResponse {
  user: User;
  access_token: string;
  message?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginUser: (credentials: LoginCredentials) => Promise<void>;
  signupUser: (userData: SignupData) => Promise<void>;
  logoutUser: () => void;
  setAuthLoading: (loading: boolean) => void;
  clearError: () => void;
  setToken: (token: string) => void;
  refreshToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false, // Set to false initially, true when an auth operation starts
      error: null,

      setAuthLoading: (loading) => set({ isLoading: loading }),
      clearError: () => set({ error: null }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),

      refreshToken: async (): Promise<string | null> => {
        return await refreshTokenIfNeeded();
      },

      loginUser: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response: AuthResponse = await apiClient.login(credentials);
          if (response && response.access_token && response.user) {
            set({
              user: response.user,
              token: response.access_token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || 'Login failed: Invalid response from server');
          }
        } catch (error: any) {
          console.error("Login error in store:", error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Failed to login. Please check your credentials.',
          });
        }
      },

      signupUser: async (userData: SignupData) => {
        set({ isLoading: true, error: null });
        try {
          const response: AuthResponse = await apiClient.signup(userData);
          if (response && response.access_token && response.user) {
            set({
              user: response.user,
              token: response.access_token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else if (response && response.message === "User created successfully") {
            set({ isLoading: false, error: null });
          } else {
            throw new Error(response.message || 'Signup failed: Invalid response from server');
          }
        } catch (error: any) {
          console.error("Signup error in store:", error);
          set({
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
            error: error.message || 'Failed to sign up. Please try again.',
          });
        }
      },

      logoutUser: () => {
        // Optionally call a backend /auth/logout endpoint if it exists
        // apiClient.logout(); 
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        // localStorage.removeItem('auth-storage'); // Handled by persist middleware's clearStorage option if needed
      },
      // The initializeAuth function is no longer explicitly needed here
      // as `persist` middleware handles rehydration from localStorage on load.
      // The `isLoading` state can be managed by components checking `isAuthenticated` and `token` on mount.
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: () => {
        if (process.env.NODE_ENV === 'development') {
          console.log("Hydration finished for auth-storage");
        }
        return (state, error) => {
          if (error) {
            console.error("An error happened during auth storage hydration", error);
          } else if (state) {
            if (state.token) {
              state.isAuthenticated = true;
            }
            state.isLoading = false;
          }
        };
      },
    }
  )
);
