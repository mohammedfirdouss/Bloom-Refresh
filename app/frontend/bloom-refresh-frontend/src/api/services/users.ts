import apiClient from '../client';

export const usersService = {
  getUserProfile: (userId: string) => 
    apiClient.get(`/users/${userId}`),
    
  getCurrentUser: () => 
    apiClient.get('/users/me'),
    
  updateUserProfile: (userId: string, data: any) => 
    apiClient.put(`/users/${userId}`, data),
    
  getUsers: (filters?: any) => 
    apiClient.get('/users', { params: filters })
};
