import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

const REFRESH_INTERVAL = 4 * 60 * 1000; // 4 minutes

export const useTokenRefresh = () => {
  const { token, refreshToken } = useAuthStore();
 const [refreshError, setRefreshError] = useState<Error | null>(null);

  useEffect(() => {
    if (!token) return;

    // Initial check
   refreshToken().catch(err => setRefreshError(err));

    // Set up interval for periodic checks
    const intervalId = setInterval(() => {
     refreshToken().catch(err => setRefreshError(err));
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [token, refreshToken]);

 // Optionally expose the error state if needed by consumers
 return { refreshError };
};