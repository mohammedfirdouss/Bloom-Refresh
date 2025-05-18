import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventEditForm from '../EventEditForm';

const mockEvent = {
  title: 'Test Event',
  description: 'Test Description',
  date: '2024-03-20',
  status: 'upcoming',
  image: 'https://example.com/image.jpg'
};

const mockOnSuccess = jest.fn();

describe('EventEditForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial event data', () => {
    render(<EventEditForm event={mockEvent} onSuccess={mockOnSuccess} />);
    
    expect(screen.getByDisplayValue('Test Event')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-03-20')).toBeInTheDocument();
    expect(screen.getByDisplayValue('upcoming')).toBeInTheDocument();
    expect(screen.getByAltText('Event')).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('handles form submission with image upload', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
    
    render(<EventEditForm event={mockEvent} onSuccess={mockOnSuccess} />);
    
    const fileInput = screen.getByLabelText(/event image/i);
    await userEvent.upload(fileInput, file);
    
    const submitButton = screen.getByText(/save changes/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('shows error alert when image upload fails', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    // Mock the uploadImageToCloudinary function to fail
    jest.mock('../EventEditForm', () => ({
      uploadImageToCloudinary: jest.fn().mockRejectedValue(new Error('Upload failed'))
    }));

    render(<EventEditForm event={mockEvent} onSuccess={mockOnSuccess} />);
    
    const fileInput = screen.getByLabelText(/event image/i);
    await userEvent.upload(fileInput, file);
    
    const submitButton = screen.getByText(/save changes/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Image upload failed');
    });
  });
}); 