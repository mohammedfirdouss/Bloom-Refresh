import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock Cloudinary upload function
jest.mock('./src/features/events/components/EventEditForm', () => ({
  uploadImageToCloudinary: jest.fn().mockResolvedValue('https://example.com/uploaded.jpg'),
})); 