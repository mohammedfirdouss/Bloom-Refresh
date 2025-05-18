import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import EventDetailPage from '@/app/events/[id]/page';
import { useAuthStore } from '@/stores/auth/store';
import apiClient from '@/api/client';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock the auth store
jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock the API client
jest.mock('@/api/client', () => ({
  getEventById: jest.fn(),
  checkRsvpStatus: jest.fn(),
  rsvpToEvent: jest.fn(),
  withdrawRsvp: jest.fn(),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('EventDetailPage Component', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  const mockEvent = {
    id: '123',
    name: 'Test Event',
    description: 'This is a test event description',
    date: '2025-12-31',
    time: '12:00 PM',
    location: 'Test Location',
    organizer: 'Test Organizer',
    category: 'Cleanup',
    requiredVolunteers: 20,
    currentVolunteers: 10,
    photoUrl: 'https://example.com/photo.jpg',
    mapCoordinates: { lat: 40.7128, lng: -74.0060 },
  };
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mocks
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    (useAuthStore as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: 'user123', name: 'Test User' },
    });
    (apiClient.getEventById as jest.Mock).mockResolvedValue(mockEvent);
    (apiClient.checkRsvpStatus as jest.Mock).mockResolvedValue({ hasRsvped: false });
  });
  
  test('renders loading state initially', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EventDetailPage />
      </QueryClientProvider>
    );
    
    expect(screen.getByText(/Loading event details/i)).toBeInTheDocument();
  });
  
  test('renders event details correctly when loaded', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EventDetailPage />
      </QueryClientProvider>
    );
    
    // Wait for event details to load
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    
    // Check if event details are rendered
    expect(screen.getByText('Organized by: Test Organizer')).toBeInTheDocument();
    expect(screen.getByText('This is a test event description')).toBeInTheDocument();
    expect(screen.getByText(/Location:/)).toBeInTheDocument();
    expect(screen.getByText(/Category:/)).toBeInTheDocument();
    expect(screen.getByText(/10 \/ 20 volunteers signed up/)).toBeInTheDocument();
    
    // Check if RSVP button is rendered
    expect(screen.getByRole('button', { name: /RSVP for this Event/i })).toBeInTheDocument();
  });
  
  test('renders error state when event not found', async () => {
    // Mock API error
    (apiClient.getEventById as jest.Mock).mockRejectedValue(new Error('Event not found'));
    
    render(
      <QueryClientProvider client={queryClient}>
        <EventDetailPage />
      </QueryClientProvider>
    );
    
    // Wait for error state to render
    await waitFor(() => {
      expect(screen.getByText('Event Not Found')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Error: Event not found/i)).toBeInTheDocument();
    expect(screen.getByText('Browse all events')).toBeInTheDocument();
  });
  
  test('shows withdraw button when user has already RSVPed', async () => {
    // Mock user has already RSVPed
    (apiClient.checkRsvpStatus as jest.Mock).mockResolvedValue({ hasRsvped: true });
    
    render(
      <QueryClientProvider client={queryClient}>
        <EventDetailPage />
      </QueryClientProvider>
    );
    
    // Wait for event details to load
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    
    // Check if withdraw button is rendered instead of RSVP button
    expect(screen.getByRole('button', { name: /Withdraw RSVP/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /RSVP for this Event/i })).not.toBeInTheDocument();
  });
  
  test('redirects to login when unauthenticated user tries to RSVP', async () => {
    // Mock unauthenticated user
    (useAuthStore as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
    
    render(
      <QueryClientProvider client={queryClient}>
        <EventDetailPage />
      </QueryClientProvider>
    );
    
    // Wait for event details to load
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    
    // Click RSVP button
    screen.getByRole('button', { name: /RSVP for this Event/i }).click();
    
    // Check if router.push was called with login path
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
  });
});
