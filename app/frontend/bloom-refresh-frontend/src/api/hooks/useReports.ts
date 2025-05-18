import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsService } from '../services/reports';

// Query keys
export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (filters: any) => [...reportKeys.lists(), filters] as const,
  eventReports: (eventId: string) => [...reportKeys.lists(), { eventId }] as const,
  userReports: (userId: string) => [...reportKeys.lists(), { userId }] as const,
  details: () => [...reportKeys.all, 'detail'] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
};

// Hooks
export const useEventReports = (eventId: string) => {
  return useQuery({
    queryKey: reportKeys.eventReports(eventId),
    queryFn: () => reportsService.getEventReports(eventId),
    enabled: !!eventId,
  });
};

export const useUserReports = (userId: string) => {
  return useQuery({
    queryKey: reportKeys.userReports(userId),
    queryFn: () => reportsService.getUserReports(userId),
    enabled: !!userId,
  });
};

export const useReport = (reportId: string) => {
  return useQuery({
    queryKey: reportKeys.detail(reportId),
    queryFn: () => reportsService.getReportById(reportId),
    enabled: !!reportId,
  });
};

export const useSubmitReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, reportData }: { eventId: string, reportData: any }) => 
      reportsService.submitReport(eventId, reportData),
    onSuccess: (_, { eventId }) => {
      // Invalidate event reports to refetch
      queryClient.invalidateQueries({ queryKey: reportKeys.eventReports(eventId) });
    },
  });
};
