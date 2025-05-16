import { create } from 'zustand';
import apiClient from '@/lib/apiClient'; // Assuming apiClient is in lib
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  // Add other user properties as needed from backend response
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginUser: (credentials: any) => Promise<void>;
  signupUser: (userData: any) => Promise<void>;
  logoutUser: () => void;
  setAuthLoading: (loading: boolean) => void;
  clearError: () => void;
  // initializeAuth: () => void; // Removed as middleware handles persistence
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false, // Set to false initially, true when an auth operation starts
      error: null,

      setAuthLoading: (loading) => set({ isLoading: loading, error: null }),
      clearError: () => set({ error: null }),

      loginUser: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.login(credentials);
          // Assuming response contains { user: User, access_token: string }
          // Adjust based on your actual backend response structure
          if (response && response.access_token && response.user) {
            set({
              user: response.user,
              token: response.access_token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // Handle cases where token or user might be missing even if API call was 'successful'
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
          // Optionally re-throw or handle more specifically
        }
      },

      signupUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Assuming signup also returns user and token, or a success message
          // Adjust based on your actual backend response structure for signup
          const response = await apiClient.signup(userData);
          // If signup automatically logs in the user:
          if (response && response.access_token && response.user) {
            set({
              user: response.user,
              token: response.access_token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else if (response && response.message === "User created successfully") {
            // If signup only creates user and doesn't log in
            set({ isLoading: false, error: null });
            // Potentially trigger a notification for the user to log in
          } else {
            throw new Error(response.message || 'Signup failed: Invalid response from server');
          }
        } catch (error: any) {
          console.error("Signup error in store:", error);
          set({
            isLoading: false,
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
      onRehydrateStorage: (state) => {
        console.log("Hydration finished for auth-storage");
        return (state, error) => {
          if (error) {
            console.error("An error happened during auth storage hydration", error);
          } else {
            // Check if token exists and is valid (e.g. not expired) - advanced
            // For now, if token exists, we assume authenticated, but set isLoading to false.
            // Components can then verify auth status if needed.
            if (state?.token) {
              state.isAuthenticated = true; // Or verify token validity here
            }
            state.isLoading = false; // Done loading from storage
          }
        };
      },
    }
  )
);

// Initial check if already authenticated (e.g. on app load)
// This can be called in your _app.tsx or a main layout component
// to ensure the store is correctly initialized with persisted data.
// However, with `persist` middleware, this is largely automatic.
// The `isLoading` state in the store can be used to show a loading spinner
// until rehydration is complete.

// Example of how a component might check auth status on mount:
// useEffect(() => {
//   const { token, isLoading, isAuthenticated } = useAuthStore.getState();
//   if (!isLoading && token && !isAuthenticated) {
//     // Potentially re-validate token with backend if needed
//     // or just set isAuthenticated based on token presence after hydration
//   }
// }, []);

