import apiClient from '../client';

export const reportsService = {
  getEventReports: (eventId: string) => 
    apiClient.get(`/reports/event/${eventId}`),
    
  getUserReports: (userId: string) => 
    apiClient.get(`/reports/user/${userId}`),
    
  getReportById: (reportId: string) => 
    apiClient.get(`/reports/${reportId}`),
    
  submitReport: (eventId: string, reportData: any) => 
    apiClient.post(`/reports/event/${eventId}`, reportData)
};
