import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ImpactPage from '@/app/impact/page';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';

// Mock the API client
jest.mock('@/lib/apiClient', () => ({
  getImpactStats: jest.fn(),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('ImpactPage Component', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  const mockImpactStats = {
    totalEvents: 42,
    totalVolunteers: 256,
    totalItemsCollected: 1500,
    totalAreaCleanedSqFt: 25000,
    totalTreesPlanted: 350,
    recentPhotos: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
      'https://example.com/photo3.jpg',
    ],
  };
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('renders loading state initially', () => {
    apiClient.getImpactStats.mockReturnValue(new Promise(() => {})); // Never resolves
    
    render(
      <QueryClientProvider client={queryClient}>
        <ImpactPage />
      </QueryClientProvider>
    );
    
    expect(screen.getByText(/Loading impact statistics/i)).toBeInTheDocument();
  });
  
  test('renders impact statistics correctly when loaded', async () => {
    apiClient.getImpactStats.mockResolvedValue(mockImpactStats);
    
    render(
      <QueryClientProvider client={queryClient}>
        <ImpactPage />
      </QueryClientProvider>
    );
    
    // Wait for impact stats to load
    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument();
    });
    
    // Check if all statistics are rendered
    expect(screen.getByText('Community Events')).toBeInTheDocument();
    expect(screen.getByText('256')).toBeInTheDocument();
    expect(screen.getByText('Volunteers Engaged')).toBeInTheDocument();
    expect(screen.getByText('1,500')).toBeInTheDocument();
    expect(screen.getByText('Items Collected')).toBeInTheDocument();
    expect(screen.getByText('350')).toBeInTheDocument();
    expect(screen.getByText('Trees Planted')).toBeInTheDocument();
    
    // Check if area cleaned section is rendered
    expect(screen.getByText('Total Area Cleaned')).toBeInTheDocument();
    expect(screen.getByText('25,000')).toBeInTheDocument();
    expect(screen.getByText(/approximately 0.57 acres/i)).toBeInTheDocument();
    
    // Check if call to action is rendered
    expect(screen.getByText('Join Us in Making a Difference')).toBeInTheDocument();
    expect(screen.getByText('Browse Events')).toBeInTheDocument();
    expect(screen.getByText('Create an Event')).toBeInTheDocument();
  });
  
  test('renders empty state when no impact data is available', async () => {
    apiClient.getImpactStats.mockResolvedValue(null);
    
    render(
      <QueryClientProvider client={queryClient}>
        <ImpactPage />
      </QueryClientProvider>
    );
    
    // Wait for empty state to render
    await waitFor(() => {
      expect(screen.getByText('No Impact Data Available')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/We're still collecting data/i)).toBeInTheDocument();
  });
  
  test('handles API errors correctly', async () => {
    apiClient.getImpactStats.mockRejectedValue(new Error('Failed to fetch impact stats'));
    
    render(
      <QueryClientProvider client={queryClient}>
        <ImpactPage />
      </QueryClientProvider>
    );
    
    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
    
    expect(toast.error).toHaveBeenCalledWith('Error loading impact statistics', expect.anything());
  });
});
