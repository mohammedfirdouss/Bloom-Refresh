import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import EventMap from '@/components/events/EventMap';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer?: string;
  category: string;
  requiredVolunteers: number;
  currentVolunteers?: number;
  photoUrl?: string;
  mapCoordinates?: { lat: number; lng: number };
}

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const queryClient = useQueryClient();

  // Fetch event details
  const { data: event, isLoading, error } = useQuery<Event>({
    queryKey: ['event', eventId],
    queryFn: () => apiClient.getEventById(eventId),
    enabled: !!eventId,
  });

  // RSVP status
  const { data: userRsvpStatus, isLoading: isLoadingRsvp } = useQuery({
    queryKey: ['rsvp', eventId],
    queryFn: () => apiClient.checkRsvpStatus(eventId),
    enabled: !!eventId,
  });

  // RSVP mutation
  const rsvpMutation = useMutation({
    mutationFn: () => apiClient.rsvpToEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['rsvp', eventId] });
    },
  });

  // Withdraw RSVP mutation
  const withdrawRsvpMutation = useMutation({
    mutationFn: () => apiClient.withdrawRsvp(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['rsvp', eventId] });
    },
  });

  const handleRSVP = () => {
    rsvpMutation.mutate();
  };

  const handleWithdrawRSVP = () => {
    withdrawRsvpMutation.mutate();
  };

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4 text-center"><p className="text-gray-600">Loading event details...</p></div>;
  }

  if (error || !event) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold">Event Not Found</h1>
        <p className="text-gray-600 mt-2">{error ? `Error: ${(error as Error).message}` : "Sorry, we couldn't find the event you're looking for."}</p>
        <a href="/events/browse" className="mt-4 inline-block text-blue-600 hover:underline">Browse all events</a>
      </div>
    );
  }

  const volunteerProgressPercent = event.currentVolunteers && event.requiredVolunteers
    ? Math.min(Math.round((event.currentVolunteers / event.requiredVolunteers) * 100), 100)
    : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6">
        {event.photoUrl && (
          <img src={event.photoUrl} alt={event.name} className="w-full h-64 object-cover rounded-t-lg mb-4" />
        )}
        <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
        <div className="text-lg text-gray-600 mb-2">{event.organizer && <>Organized by: {event.organizer}</>}</div>
        <div className="mb-4">{event.description}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="mb-1"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p className="mb-1"><strong>Time:</strong> {event.time}</p>
          </div>
          <div>
            <p className="mb-1"><strong>Location:</strong> {event.location}</p>
            <p className="mb-1"><strong>Category:</strong> {event.category}</p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Volunteers</h3>
          <p className="mb-2">{event.currentVolunteers || 0} / {event.requiredVolunteers} volunteers signed up</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${volunteerProgressPercent}%` }}></div>
          </div>
        </div>
        {event.mapCoordinates && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Event Location</h3>
            <div className="h-64 rounded-md overflow-hidden border">
              <EventMap
                center={[event.mapCoordinates.lat, event.mapCoordinates.lng]}
                marker={[event.mapCoordinates.lat, event.mapCoordinates.lng]}
                selectable={false}
                height="100%"
              />
            </div>
          </div>
        )}
        <div className="flex justify-end mt-6">
          {isLoadingRsvp ? (
            <Button disabled>Checking RSVP status...</Button>
          ) : userRsvpStatus?.hasRsvped ? (
            <Button onClick={handleWithdrawRSVP} variant="destructive" size="lg" disabled={withdrawRsvpMutation.isPending}>
              {withdrawRsvpMutation.isPending ? 'Processing...' : 'Withdraw RSVP'}
            </Button>
          ) : (
            <Button onClick={handleRSVP} size="lg" disabled={rsvpMutation.isPending}>
              {rsvpMutation.isPending ? 'Processing...' : 'RSVP for this Event'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage; 