import apiClient from '../api/client';
import { useAuthStore } from '@/stores/auth/store';

const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export const refreshTokenIfNeeded = async (): Promise<string | null> => {
  const { token, setToken } = useAuthStore.getState();
  
  if (!token) return null;

  try {
    // Get token expiration from JWT
   // More robust JWT payload extraction with error checking
   const parts = token.split('.');
   if (parts.length !== 3) {
     throw new Error('Invalid token format');
   }
   
   // Base64 decode and parse with error handling
   let payload;
   try {
     // Handle base64url format by replacing chars and adding padding
     const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
     const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
     payload = JSON.parse(atob(padded));
   } catch (e) {
     throw new Error('Invalid token payload');
   }
   
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();

    // If token is about to expire (within REFRESH_THRESHOLD)
    if (expirationTime - currentTime < REFRESH_THRESHOLD) {
      const response = await apiClient.refreshToken();
      if (response?.access_token) {
        setToken(response.access_token);
        return response.access_token;
      }
     throw new Error('Refresh response did not contain a valid token');
    }
    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};