import apiClient from '../client';

// Types
export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: {
    lat: number;
    lng: number;
  };
  category: string;
  organizer_id: string;
}

export interface CreateEventParams {
  name: string;
  description: string;
  date: string;
  location: {
    lat: number;
    lng: number;
  };
  category: string;
}

export interface EventFilters {
  category?: string;
  date?: string;
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
}

// Event service 
export const eventsService = {
  getAll: async (filters?: EventFilters) => {
    const queryParams = new URLSearchParams();
    
    if (filters?.category) {
      queryParams.append('category', filters.category);
    }
    
    if (filters?.date) {
      queryParams.append('date', filters.date);
    }
    
    if (filters?.location) {
      queryParams.append('lat', filters.location.lat.toString());
      queryParams.append('lng', filters.location.lng.toString());
      queryParams.append('radius', filters.location.radius.toString());
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<{ events: Event[] }>(`/events${queryString}`);
  },
  
  getById: async (id: string) => {
    return apiClient.get<Event>(`/events/${id}`);
  },
  
  create: async (eventData: CreateEventParams) => {
    return apiClient.post<Event>('/events', eventData);
  },
  
  update: async (id: string, eventData: Partial<CreateEventParams>) => {
    return apiClient.put<Event>(`/events/${id}`, eventData);
  },
  
  delete: async (id: string) => {
    return apiClient.delete(`/events/${id}`);
  },
  
  rsvp: async (eventId: string, rsvpData = {}) => {
    return apiClient.post(`/events/${eventId}/rsvp`, rsvpData);
  },
  
  cancelRsvp: async (eventId: string) => {
    return apiClient.delete(`/events/${eventId}/rsvp`);
  },
  
  getRsvpStatus: async (eventId: string) => {
    return apiClient.get(`/events/${eventId}/rsvp/status`);
  }
};
