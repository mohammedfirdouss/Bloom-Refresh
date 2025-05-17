'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores/auth/store';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { toast } from 'sonner';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  category: string;
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

const EventCard = ({ event }: { event: Event }) => (
  <Card className="h-full flex flex-col">
    <CardHeader>
      <CardTitle className="text-xl">{event.name}</CardTitle>
      <CardDescription>
        {new Date(event.date).toLocaleDateString()} at {event.time}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-sm text-gray-500 mb-2">Location: {event.location}</p>
      <p className="text-sm text-gray-500">Category: {event.category}</p>
    </CardContent>
    <CardFooter>
      <Link href={`/events/${event.id}`} className="w-full">
        <Button variant="outline" className="w-full">View Details</Button>
      </Link>
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

const VolunteerDashboardPage = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState('upcoming');

  React.useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Fetch user's upcoming events (RSVPs)
  const { 
    data: upcomingEvents, 
    isLoading: isLoadingUpcoming,
    error: upcomingError
  } = useQuery<Event[]>({
    queryKey: ['user-events', 'upcoming', user?.id],
    queryFn: () => apiClient.getUserEvents('upcoming'),
    enabled: !!isAuthenticated && !!user?.id,
  });

  // Fetch user's past events
  const { 
    data: pastEvents, 
    isLoading: isLoadingPast,
    error: pastError
  } = useQuery<Event[]>({
    queryKey: ['user-events', 'past', user?.id],
    queryFn: () => apiClient.getUserEvents('past'),
    enabled: !!isAuthenticated && !!user?.id && activeTab === 'past',
  });

  // Fetch user's submitted reports
  const { 
    data: userReports, 
    isLoading: isLoadingReports,
    error: reportsError
  } = useQuery<Report[]>({
    queryKey: ['user-reports', user?.id],
    queryFn: () => apiClient.getUserReports(user?.id as string),
    enabled: !!isAuthenticated && !!user?.id && activeTab === 'reports',
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-gray-600">Please log in to access your volunteer dashboard.</p>
      </div>
    );
  }

  const handleError = (error: any) => {
    toast.error('Error loading data', { 
      description: error?.message || 'An unexpected error occurred' 
    });
  };

  if (upcomingError) handleError(upcomingError);
  if (pastError) handleError(pastError);
  if (reportsError) handleError(reportsError);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Volunteer Dashboard</h1>
        <Button onClick={() => router.push('/events/browse')}>
          Find New Events
        </Button>
      </div>

      <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="reports">My Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {isLoadingUpcoming ? (
            <p className="text-center py-8 text-gray-500">Loading your upcoming events...</p>
          ) : upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Upcoming Events</h3>
              <p className="text-gray-500 mb-6">You haven't signed up for any events yet.</p>
              <Button onClick={() => router.push('/events/browse')}>
                Browse Events
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
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Past Events</h3>
              <p className="text-gray-500">You haven't participated in any events yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports">
          {isLoadingReports ? (
            <p className="text-center py-8 text-gray-500">Loading your submitted reports...</p>
          ) : userReports && userReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userReports.map(report => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Reports Submitted</h3>
              <p className="text-gray-500 mb-6">You haven't submitted any event reports yet.</p>
              <p className="text-gray-500">After participating in an event, you can submit a report with metrics and photos.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VolunteerDashboardPage;
