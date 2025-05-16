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
    const baseUrl = getApiBaseUrl();
    const token = useAuthStore.getState().token;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: response.statusText };
        }
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }
      if (response.status === 204) {
        return null; // No content
      }
      return await response.json();
    } catch (error) {
      console.error(`API Error calling ${endpoint}:`, error);
      throw error; 
    }
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
