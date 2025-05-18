"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';

export default function EventsMap() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading the map data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        {loading ? (
          <div className="w-full h-[600px]">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <div className="w-full h-[600px] relative">
            {/* This would be replaced with an actual map component */}
            <div 
              className="w-full h-full bg-cover bg-center opacity-90"
              style={{ backgroundImage: "url('https://images.pexels.com/photos/4346320/pexels-photo-4346320.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-background/30"></div>
              
              {/* Sample map pins */}
              <div className="absolute left-[25%] top-[30%] transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
                <div className="relative group">
                  <MapPin className="h-8 w-8 text-green-500 cursor-pointer" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-card p-2 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border">
                    <p className="font-medium">Central Park Cleanup</p>
                    <p className="text-xs text-muted-foreground">April 22, 10:00 AM</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute left-[40%] top-[50%] transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
                <div className="relative group">
                  <MapPin className="h-8 w-8 text-blue-500 cursor-pointer" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-card p-2 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border">
                    <p className="font-medium">Hudson River Restoration</p>
                    <p className="text-xs text-muted-foreground">May 15, 9:00 AM</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute left-[70%] top-[40%] transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
                <div className="relative group">
                  <MapPin className="h-8 w-8 text-orange-500 cursor-pointer" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-card p-2 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border">
                    <p className="font-medium">Brooklyn Bridge Park Cleanup</p>
                    <p className="text-xs text-muted-foreground">June 8, 8:30 AM</p>
                  </div>
                </div>
              </div>
              
              {/* Message showing that this is a prototype */}
              <div className="absolute bottom-4 left-4 right-4 bg-card/80 backdrop-blur-sm p-3 rounded-lg border text-center">
                <p className="text-sm">This is a prototype map view. In a real implementation, this would be an interactive map with actual event locations.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}