'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth/store";
import apiClient from "@/api/client";
import dynamic from "next/dynamic";
import { EventsList } from "@/features/events/components";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    apiClient.getEvents("?featured=true&limit=3").then((data) => {
      setEvents(data.events || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Bloom Refresh</h1>
      <div className="mb-6 text-center">
        {isAuthenticated ? (
          <span className="text-green-700">Logged in as {user?.username}</span>
        ) : (
          <span className="text-gray-600">You are not logged in.</span>
        )}
      </div>
      <h2 className="text-2xl font-semibold mb-4">Featured Events</h2>
      {loading ? (
        <div>Loading events...</div>
      ) : events.length === 0 ? (
        <div>No featured events found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.name || event.eventName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-gray-700">{event.description}</div>
                <div className="mb-2 text-sm text-gray-500">{event.date}</div>
                <Button asChild>
                  <a href={`/events/${event.id}`}>View Event</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">Event Map</h2>
      <div className="mb-8">
        {/* EventMap removed */}
      </div>
      <div className="flex justify-center gap-4">
        <Button asChild variant="outline">
          <a href="/events/browse">Browse All Events</a>
        </Button>
        <Button asChild variant="outline">
          <a href="/events/create">Create New Event</a>
        </Button>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
      <EventsList />
    </div>
  );
}
