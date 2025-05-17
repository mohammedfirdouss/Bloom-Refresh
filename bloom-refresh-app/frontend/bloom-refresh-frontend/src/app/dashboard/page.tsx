'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

const DashboardPage = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  React.useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-gray-600">Please log in to access your dashboard.</p>
      </div>
    );
  }

  // Determine if user is an organizer (this logic would depend on your user model)
  // For now, we'll assume a simple role property on the user object
  const isOrganizer = user?.role === 'organizer';

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Volunteer Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">View your upcoming events, past participation, and submitted reports.</p>
            <Button 
              onClick={() => router.push('/dashboard/volunteer')}
              className="w-full"
            >
              Go to Volunteer Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card className={`hover:shadow-lg transition-shadow ${!isOrganizer ? 'opacity-70' : ''}`}>
          <CardHeader>
            <CardTitle>Organizer Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">Manage your created events, track RSVPs, and view submitted reports.</p>
            <Button 
              onClick={() => router.push('/dashboard/organizer')}
              className="w-full"
              disabled={!isOrganizer}
            >
              {isOrganizer ? 'Go to Organizer Dashboard' : 'Organizer Access Required'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          onClick={() => router.push('/events/create')}
          variant="outline"
          className="mr-4"
        >
          Create New Event
        </Button>
        <Button 
          onClick={() => router.push('/events/browse')}
          variant="outline"
        >
          Browse Events
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
