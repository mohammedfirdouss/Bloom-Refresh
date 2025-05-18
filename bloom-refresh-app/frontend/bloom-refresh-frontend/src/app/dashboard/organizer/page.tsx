'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores/auth/store';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { toast } from 'sonner';
import { Box } from '@chakra-ui/react';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  category: string;
  currentVolunteers: number;
  requiredVolunteers: number;
  photoUrl?: string;
}

interface Report {
  id: string;
  eventId: string;
  eventName: string;
  submittedDate: string;
  metrics: {
    volunteersAttended: number;
    itemsCollected?: number;
    areaCleanedSqFt?: number;
    treesPlanted?: number;
  };
  photoUrls?: string[];
}

const EventCard = ({ event, onEdit, onDelete }: { event: Event, onEdit: (id: string) => void, onDelete: (event: Event) => void }) => (
  <Card className="h-full flex flex-col">
    <CardHeader>
      <CardTitle className="text-xl">{event.name}</CardTitle>
      <CardDescription>
        {new Date(event.date).toLocaleDateString()} at {event.time}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-sm text-gray-500 mb-2">Location: {event.location}</p>
      <p className="text-sm text-gray-500 mb-2">Category: {event.category}</p>
      <div className="mt-2">
        <p className="text-sm font-medium">RSVPs: {event.currentVolunteers}/{event.requiredVolunteers}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-green-600 h-2 rounded-full" 
            style={{ width: `${Math.min((event.currentVolunteers / event.requiredVolunteers) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex gap-2">
      <Link href={`/events/${event.id}`} className="flex-1">
        <Button variant="outline" className="w-full">View</Button>
      </Link>
      <Button variant="outline" className="flex-1" onClick={() => onEdit(event.id)}>Edit</Button>
      <Button style={{ background: '#f56565', color: 'white' }} variant="outline" className="flex-1" onClick={() => onDelete(event)}>Delete</Button>
    </CardFooter>
  </Card>
);

const ReportCard = ({ report }: { report: Report }) => (
  <Card className="h-full flex flex-col">
    <CardHeader>
      <CardTitle className="text-xl">{report.eventName}</CardTitle>
      <CardDescription>
        Submitted on {new Date(report.submittedDate).toLocaleDateString()}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Volunteers: {report.metrics.volunteersAttended}</p>
        {report.metrics.itemsCollected && (
          <p className="text-sm text-gray-500">Items Collected: {report.metrics.itemsCollected}</p>
        )}
        {report.metrics.areaCleanedSqFt && (
          <p className="text-sm text-gray-500">Area Cleaned: {report.metrics.areaCleanedSqFt} sq ft</p>
        )}
        {report.metrics.treesPlanted && (
          <p className="text-sm text-gray-500">Trees Planted: {report.metrics.treesPlanted}</p>
        )}
      </div>
    </CardContent>
    <CardFooter>
      <Link href={`/reports/${report.id}`} className="w-full">
        <Button variant="outline" className="w-full">View Full Report</Button>
      </Link>
    </CardFooter>
  </Card>
);

const OrganizerDashboardPage = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState('active');
  const [deleteEvent, setDeleteEvent] = useState<Event | null>(null);
  const cancelRef = useRef(null);

  React.useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
    
    // Check if user is an organizer
    if (isAuthenticated && user && user.role !== 'organizer') {
      toast.error('Access Denied', { 
        description: 'You need organizer privileges to access this dashboard' 
      });
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, user]);

  // Fetch organizer's active events
  const { 
    data: activeEvents, 
    isLoading: isLoadingActive,
    error: activeError
  } = useQuery<Event[]>({
    queryKey: ['organizer-events', 'active', user?.id],
    queryFn: () => apiClient.get("/events?organizerId=" + user?.id + "&status=active"),
    enabled: !!isAuthenticated && !!user?.id && user?.role === 'organizer',
  });

  // Fetch organizer's past events
  const { 
    data: pastEvents, 
    isLoading: isLoadingPast,
    error: pastError
  } = useQuery<Event[]>({
    queryKey: ['organizer-events', 'past', user?.id],
    queryFn: () => apiClient.get("/events?organizerId=" + user?.id + "&status=past"),
    enabled: !!isAuthenticated && !!user?.id && user?.role === 'organizer' && activeTab === 'past',
  });

  // Fetch reports for organizer's events
  const { 
    data: eventReports, 
    isLoading: isLoadingReports,
    error: reportsError
  } = useQuery<Report[]>({
    queryKey: ['organizer-reports', user?.id],
    queryFn: () => apiClient.get("/reports?organizerId=" + user?.id),
    enabled: !!isAuthenticated && !!user?.id && user?.role === 'organizer' && activeTab === 'reports',
  });

  if (!isAuthenticated || (user && user.role !== 'organizer')) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-gray-600">Please log in with an organizer account to access this dashboard.</p>
      </div>
    );
  }

  const handleError = (error: any) => {
    toast.error('Error loading data', { 
      description: error?.message || 'An unexpected error occurred' 
    });
  };

  if (activeError) handleError(activeError);
  if (pastError) handleError(pastError);
  if (reportsError) handleError(reportsError);

  // Add this function to handle delete
  const handleDelete = async () => {
    if (!deleteEvent) return;
    try {
      // TODO: Call API to delete event
      toast.success('Event deleted!');
      setDeleteEvent(null);
      // Optionally refetch events here
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
        <Button onClick={() => router.push('/events/create')}>
          Create New Event
        </Button>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="reports">Event Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {isLoadingActive ? (
            <p className="text-center py-8 text-gray-500">Loading your active events...</p>
          ) : activeEvents && activeEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEvents.map(event => (
                <EventCard key={event.id} event={event} onEdit={id => router.push(`/events/edit?id=${id}`)} onDelete={setDeleteEvent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Active Events</h3>
              <p className="text-gray-500 mb-6">You haven't created any upcoming events yet.</p>
              <Button onClick={() => router.push('/events/create')}>
                Create an Event
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {isLoadingPast ? (
            <p className="text-center py-8 text-gray-500">Loading your past events...</p>
          ) : pastEvents && pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map(event => (
                <EventCard key={event.id} event={event} onEdit={id => router.push(`/events/edit?id=${id}`)} onDelete={setDeleteEvent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Past Events</h3>
              <p className="text-gray-500">You haven't organized any events that have concluded yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports">
          {isLoadingReports ? (
            <p className="text-center py-8 text-gray-500">Loading event reports...</p>
          ) : eventReports && eventReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventReports.map(report => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Reports Available</h3>
              <p className="text-gray-500">There are no reports submitted for your events yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Custom Delete Confirmation Dialog */}
      {!!deleteEvent && (
        <Box position="fixed" top={0} left={0} w="100vw" h="100vh" bg="blackAlpha.600" zIndex={1000} display="flex" alignItems="center" justifyContent="center">
          <Box bg="white" p={6} borderRadius="md" boxShadow="lg" minW="320px">
            <h2 className="text-lg font-bold mb-4">Delete Event</h2>
            <p className="mb-6">Are you sure you want to delete the event "{deleteEvent?.name}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setDeleteEvent(null)}>
                Cancel
              </Button>
              <Button style={{ background: '#f56565', color: 'white' }} onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default OrganizerDashboardPage;
