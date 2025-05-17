import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/users';
import { useAuthStore } from '@/stores/auth/store';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: any) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
};

// Hooks
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => usersService.getUserProfile(userId),
    enabled: !!userId,
  });
};

export const useCurrentUser = () => {
  const userId = useAuthStore.getState().user?.id;
  
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => usersService.getCurrentUser(),
    enabled: !!userId,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => 
      usersService.updateUserProfile(userId, data),
    onSuccess: (updatedUser: any, { userId }) => {
      // Update user in cache
      queryClient.setQueryData(userKeys.detail(userId), updatedUser);
      queryClient.setQueryData(userKeys.profile(), updatedUser);
    },
  });
};

export const useUsers = (filters?: any) => {
  return useQuery({
    queryKey: userKeys.list(filters || {}),
    queryFn: () => usersService.getUsers(filters),
  });
};
