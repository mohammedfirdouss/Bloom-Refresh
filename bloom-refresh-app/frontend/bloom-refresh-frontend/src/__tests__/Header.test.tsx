import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/common/layout/Header';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock the auth store
jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Header Component', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    // Reset mocks and create a fresh QueryClient
    jest.clearAllMocks();
    queryClient = new QueryClient();
  });
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('renders correctly when user is not authenticated', () => {
    // Mock the auth store to return not authenticated
    useAuthStore.mockImplementation(() => ({
      isAuthenticated: false,
      user: null,
      logout: jest.fn(),
    }));
    
    render(
      <QueryClientProvider client={queryClient}>
        <Header />
      </QueryClientProvider>
    );
    
    // Check if site name is rendered
    expect(screen.getByText('Bloom Refresh')).toBeInTheDocument();
    
    // Check if login and signup buttons are rendered
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    
    // Check if navigation links are rendered
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Impact')).toBeInTheDocument();
    
    // Dashboard should not be visible when not authenticated
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
  
  test('renders correctly when user is authenticated', () => {
    // Mock the auth store to return authenticated
    useAuthStore.mockImplementation(() => ({
      isAuthenticated: true,
      user: { name: 'Test User', id: '123', role: 'volunteer' },
      logout: jest.fn(),
    }));
    
    render(
      <QueryClientProvider client={queryClient}>
        <Header />
      </QueryClientProvider>
    );
    
    // Check if site name is rendered
    expect(screen.getByText('Bloom Refresh')).toBeInTheDocument();
    
    // Check if user greeting and logout button are rendered
    expect(screen.getByText('Hi, Test User')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    // Check if navigation links are rendered
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Impact')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Login and signup should not be visible when authenticated
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });
});
