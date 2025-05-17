export interface User {
    id: string;
    username: string;
    role: 'volunteer' | 'organizer';
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    loginUser: (credentials: { username: string; password: string }) => Promise<void>;
    signupUser: (userData: { username: string; password: string; email: string; role: 'volunteer' | 'organizer' }) => Promise<void>;
    logoutUser: () => void;
    setAuthLoading: (loading: boolean) => void;
    clearError: () => void;
    setToken: (token: string) => void;
    refreshToken: () => Promise<string | null>;
  } 