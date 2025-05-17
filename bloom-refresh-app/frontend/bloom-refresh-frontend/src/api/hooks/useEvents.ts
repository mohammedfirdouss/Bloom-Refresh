import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsService, Event, EventFilters, CreateEventParams } from '../services/events';

// Query keys
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: EventFilters) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
};

// Hooks
export const useEvents = (filters?: EventFilters) => {
  return useQuery({
    queryKey: eventKeys.list(filters || {}),
    queryFn: () => eventsService.getAll(filters),
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsService.getById(id),
    enabled: !!id, // Only run query if id exists
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newEvent: CreateEventParams) => eventsService.create(newEvent),
    onSuccess: () => {
      // Invalidate events list to refetch
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

export const useUpdateEvent = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (eventData: Partial<CreateEventParams>) => 
      eventsService.update(id, eventData),
    onSuccess: (updatedEvent) => {
      // Update specific event in cache and invalidate lists
      queryClient.setQueryData(eventKeys.detail(id), updatedEvent);
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventsService.delete,
    onSuccess: (_, deletedEventId) => {
      // Invalidate lists and remove specific event
      queryClient.removeQueries({ queryKey: eventKeys.detail(deletedEventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

export const useEventRsvp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, rsvpData = {} }: { eventId: string, rsvpData?: any }) => 
      eventsService.rsvp(eventId, rsvpData),
    onSuccess: (_, { eventId }) => {
      // Invalidate specific event to refetch RSVP status
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
    },
  });
};

export const useEventCancelRsvp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventsService.cancelRsvp,
    onSuccess: (_, eventId) => {
      // Invalidate specific event to refetch RSVP status
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
    },
  });
};
