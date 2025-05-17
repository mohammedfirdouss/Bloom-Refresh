import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EventCreationWizard from '@/features/events/components/events/EventCreationWizard';
import { toast } from 'sonner';
import apiClient from '@/api/client';

// Mock the API client
jest.mock('@/lib/apiClient', () => ({
  createEvent: jest.fn(),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('EventCreationWizard Component', () => {
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
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('renders form fields correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EventCreationWizard />
      </QueryClientProvider>
    );
    
    // Check if form title is rendered
    expect(screen.getByText('Create a New Community Event')).toBeInTheDocument();
    
    // Check if all form fields are rendered
    expect(screen.getByLabelText(/Event Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Required Volunteers/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Image URL/i)).toBeInTheDocument();
    
    // Check if submit button is rendered
    expect(screen.getByRole('button', { name: /Create Event/i })).toBeInTheDocument();
  });
  
  test('validates form inputs correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EventCreationWizard />
      </QueryClientProvider>
    );
    
    // Submit the form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /Create Event/i }));
    
    // Check if validation errors are displayed
    expect(await screen.findByText(/Event name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Description is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Category is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Required volunteers is required/i)).toBeInTheDocument();
  });
  
  test('submits form data correctly when valid', async () => {
    // Mock successful API response
    apiClient.createEvent.mockResolvedValue({ id: '123', name: 'Test Event' });
    
    render(
      <QueryClientProvider client={queryClient}>
        <EventCreationWizard />
      </QueryClientProvider>
    );
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Cleanup' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'This is a test event description that is long enough to pass validation.' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Required Volunteers/i), { target: { value: '10' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Event/i }));
    
    // Check if API was called with correct data
    expect(apiClient.createEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventName: 'Test Event',
      category: 'Cleanup',
      description: 'This is a test event description that is long enough to pass validation.',
      location: 'Test Location',
      requiredVolunteers: 10,
    }));
    
    // Check if success toast was displayed
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
  
  test('handles API errors correctly', async () => {
    // Mock API error
    apiClient.createEvent.mockRejectedValue(new Error('API Error'));
    
    render(
      <QueryClientProvider client={queryClient}>
        <EventCreationWizard />
      </QueryClientProvider>
    );
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Cleanup' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'This is a test event description that is long enough to pass validation.' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Required Volunteers/i), { target: { value: '10' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Event/i }));
    
    // Check if API was called
    expect(apiClient.createEvent).toHaveBeenCalled();
    
    // Check if error toast was displayed
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
