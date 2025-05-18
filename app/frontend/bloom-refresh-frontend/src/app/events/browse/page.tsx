'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  requiredVolunteers?: number;
  photoUrl?: string;
  mapCoordinates?: { lat: number; lng: number };
}

const DEFAULT_CENTER: [number, number] = [34.0522, -118.2437];

const BrowseEventsPage = () => {
  const [dateFilter, setDateFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (dateFilter) params.append('date', dateFilter);
    if (locationFilter) params.append('location', locationFilter);
    if (categoryFilter) params.append('category', categoryFilter);
    return params.toString() ? `?${params.toString()}` : '';
  };

  const { data: events, isLoading, error, refetch } = useQuery<Event[], Error>({
    queryKey: ['events', dateFilter, locationFilter, categoryFilter],
    queryFn: () => apiClient.get("/events" + buildQueryString()),
    enabled: false, // Disable automatic fetching
  });

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  // Compute map center: center on first event with coordinates, else default
  const mapCenter = useMemo(() => {
    if (events && events.length > 0) {
      const firstWithCoords = events.find(ev => ev.mapCoordinates);
      if (firstWithCoords && firstWithCoords.mapCoordinates) {
        return [firstWithCoords.mapCoordinates.lat, firstWithCoords.mapCoordinates.lng] as [number, number];
      }
    }
    return DEFAULT_CENTER;
  }, [events]);

  // Gather all event markers
  const eventMarkers = useMemo(() => {
    if (!events) return [];
    return events.filter(ev => ev.mapCoordinates).map(ev => ({
      id: ev.id,
      name: ev.name,
      position: [ev.mapCoordinates!.lat, ev.mapCoordinates!.lng] as [number, number],
    }));
  }, [events]);

  return (
    <div className="container mx-auto py-10 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Browse Community Events</h1>
        <p className="mt-4 text-lg text-gray-600">Find and join events happening near you.</p>
      </header>
      <form onSubmit={handleFilterSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Filter Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <div>
            <label htmlFor="filter-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <Input type="date" id="filter-date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          </div>
          <div>
            <label htmlFor="filter-location" className="block text-sm font-medium text-gray-700 mb-1">Location/Keyword</label>
            <Input type="text" id="filter-location" placeholder="e.g., Park, Downtown" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} />
          </div>
          <div>
            <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="filter-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Cleanup">Cleanup</SelectItem>
                <SelectItem value="Planting">Planting</SelectItem>
                <SelectItem value="Restoration">Restoration</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6 text-right">
          <Button type="submit" size="lg">Apply Filters</Button>
        </div>
      </form>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Event Locations</h2>
        <div className="w-full h-[350px] rounded-lg overflow-hidden border">
          {/* Markers for each event will be added in a future enhancement (clustered markers, popups, etc.) */}
        </div>
      </div>
      {isLoading && <p className="text-center text-gray-500 py-5">Loading events...</p>}
      {error && <p className="text-center text-red-500 py-5">Error loading events: {error.message}</p>}
      {!isLoading && !error && events && events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map(event => (
            <div key={event.id} className="p-4 border rounded shadow-sm bg-white">
              <div className="font-semibold text-lg mb-1">{event.name}</div>
              <div className="text-gray-600 mb-1">{event.location}</div>
              <div className="text-gray-500 text-sm mb-2">{event.date} {event.time}</div>
              <div className="mb-2">{event.description.slice(0, 80)}{event.description.length > 80 ? '...' : ''}</div>
              <a href={`/events/${event.id}`} className="text-blue-600 hover:underline">View Details</a>
            </div>
          ))}
        </div>
      ) : null}
      {!isLoading && !error && (!events || events.length === 0) && (
        <p className="text-center text-gray-500 py-5">No events found for the selected filters.</p>
      )}
    </div>
  );
};

export default BrowseEventsPage; 