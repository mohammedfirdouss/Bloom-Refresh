"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react';
import { featuredEvents } from '@/lib/mock-data';
import Link from 'next/link';

export default function EventsList() {
  // Flatten the events data for a simple list view
  const allEvents = featuredEvents.flatMap(event => 
    event.locations.map(location => ({
      id: event.id,
      ...location
    }))
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Upcoming Events</h2>
        <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600">
          View All
        </Button>
      </div>
      
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {allEvents.map((event, index) => (
          <Card key={index} className="group hover:shadow-md transition-shadow">
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium group-hover:text-green-500 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1 text-green-500" />
                    <span>{event.area}</span>
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">{event.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <CalendarDays className="h-3 w-3 mr-1 text-green-500" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1 text-green-500" />
                  <span>{event.signedUp}/{event.capacity}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-green-500 hover:text-green-600 p-0 h-auto"
              >
                <Link href={`/events/${event.id}`} className="flex items-center">
                  View Details
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}