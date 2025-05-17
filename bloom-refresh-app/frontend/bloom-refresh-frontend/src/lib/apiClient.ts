import { useAuthStore } from "@/stores/authStore";

const getApiBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.warn("API URL not configured. Using default: http://localhost:5001/api");
    return "http://localhost:5001/api"; // Default for local backend services
  }
  return apiUrl;
};

const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    // Mock data for testing without backend
    console.log(`Mock API call to: ${endpoint}`, options);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock responses based on endpoint
    if (endpoint.includes('/auth/login')) {
      return { token: 'mock-token', user: { id: '1', email: 'test@example.com' } };
    }
    
    if (endpoint.includes('/events')) {
      return {
        events: [
          {
            id: '1',
            name: 'Beach Cleanup',
            eventName: 'Beach Cleanup',
            description: 'Help clean up the local beach',
            date: '2024-04-01',
            location: { lat: 40.7128, lng: -74.0060 },
            category: 'cleanup'
          },
          {
            id: '2',
            name: 'Tree Planting',
            eventName: 'Tree Planting',
            description: 'Plant trees in the community park',
            date: '2024-04-15',
            location: { lat: 40.7589, lng: -73.9851 },
            category: 'planting'
          },
          {
            id: '3',
            name: 'Community Garden',
            eventName: 'Community Garden',
            description: 'Help maintain our community garden',
            date: '2024-04-20',
            location: { lat: 40.7829, lng: -73.9654 },
            category: 'gardening'
          }
        ]
      };
    }

    // Default mock response
    return { message: 'Mock response' };
  },

  // Auth Service
  async signup(data: any) {
    return this.request("/auth/signup", { method: "POST", body: JSON.stringify(data) });
  },

  async login(credentials: any) {
    return this.request("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
  },

  async refreshToken() {
    return this.request("/auth/refresh", { method: "POST" });
  },

  // User Service
  async getUserProfile(userId: string) {
    return this.request(`/users/${userId}`, { method: "GET" });
  },
  async updateUserProfile(userId: string, data: any) {
    return this.request(`/users/${userId}`, { method: "PUT", body: JSON.stringify(data) });
  },

  // Event Service
  async createEvent(data: any) {
    return this.request("/events", { method: "POST", body: JSON.stringify(data) });
  },
  async getEvents(queryParams: string = "") {
    return this.request(`/events${queryParams}`, { method: "GET" }); // e.g. queryParams = "?category=cleanup&date=2024-12-31"
  },
  async getEventById(eventId: string) {
    return this.request(`/events/${eventId}`, { method: "GET" });
  },
  async updateEvent(eventId: string, data: any) {
    return this.request(`/events/${eventId}`, { method: "PUT", body: JSON.stringify(data) });
  },
  async deleteEvent(eventId: string) {
    return this.request(`/events/${eventId}`, { method: "DELETE" });
  },
  async rsvpToEvent(eventId: string, rsvpData: any = {}) { // rsvpData could be empty or contain specific user info if needed by backend
    return this.request(`/events/${eventId}/rsvp`, { method: "POST", body: JSON.stringify(rsvpData) });
  },
  async withdrawRsvp(eventId: string) {
    return this.request(`/events/${eventId}/rsvp`, { method: "DELETE" });
  },
  async checkRsvpStatus(eventId: string) {
    return this.request(`/events/${eventId}/rsvp/status`, { method: "GET" });
  },

  // Reporting Service
  async submitReport(eventId: string, reportData: any) {
    return this.request(`/events/${eventId}/report`, { method: "POST", body: JSON.stringify(reportData) });
  },
  async getReportById(reportId: string) {
    return this.request(`/reports/${reportId}`, { method: "GET" });
  },
  async getEventReports(eventId: string) {
    return this.request(`/events/${eventId}/reports`, { method: "GET" });
  },
  async getUserReports(userId: string) {
    return this.request(`/users/${userId}/reports`, { method: "GET" });
  },

};

export default apiClient;
