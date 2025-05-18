"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Clock, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { featuredEvents } from '@/lib/mock-data';

const FeaturedEvents = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('featured-events');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const nextSlide = () => {
    setActiveIndex((current) => (current === featuredEvents.length - 1 ? 0 : current + 1));
  };

  const prevSlide = () => {
    setActiveIndex((current) => (current === 0 ? featuredEvents.length - 1 : current - 1));
  };

  return (
    <section 
      id="featured-events" 
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className={cn(
            "transition-all duration-1000 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <h2 className="text-3xl font-bold mb-2">Featured Cleanup Events</h2>
            <p className="text-muted-foreground max-w-2xl">
              Join these upcoming events happening in your area and make a positive impact on your local environment.
            </p>
          </div>
          <div className={cn(
            "flex gap-2 transition-all duration-1000 delay-300 transform mt-4 md:mt-0",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevSlide}
              className="hover:bg-green-100 dark:hover:bg-green-900/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextSlide}
              className="hover:bg-green-100 dark:hover:bg-green-900/20"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button variant="default" className="ml-2 bg-green-500 hover:bg-green-600 text-white">
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {featuredEvents.map((event, index) => (
              <div key={event.id} className="w-full flex-shrink-0 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {event.locations.map((location, locIndex) => (
                    <Card key={locIndex} className={cn(
                      "group hover:shadow-lg transition-all duration-300 overflow-hidden",
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                      "transition-all duration-1000",
                      { "delay-500": locIndex === 0, "delay-700": locIndex === 1, "delay-900": locIndex === 2 }
                    )}>
                      <div 
                        className="h-48 bg-cover bg-center relative group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url(${location.image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-green-500 hover:bg-green-600">{location.category}</Badge>
                        </div>
                      </div>
                      <CardHeader className="relative pt-6">
                        <h3 className="text-xl font-bold group-hover:text-green-500 transition-colors duration-300">
                          {location.title}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm mt-2">
                          <MapPin className="h-4 w-4 mr-1 text-green-500" />
                          <span>{location.area}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-3 text-sm">
                          <div className="flex items-start">
                            <CalendarDays className="h-4 w-4 mr-2 text-green-500 mt-1" />
                            <div>
                              <div className="font-medium">Date & Time</div>
                              <div className="text-muted-foreground">{location.date} • {location.time}</div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Clock className="h-4 w-4 mr-2 text-green-500 mt-1" />
                            <div>
                              <div className="font-medium">Duration</div>
                              <div className="text-muted-foreground">{location.duration}</div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Users className="h-4 w-4 mr-2 text-green-500 mt-1" />
                            <div>
                              <div className="font-medium">Participants</div>
                              <div className="text-muted-foreground">{location.signedUp} signed up ({location.capacity - location.signedUp} spots left)</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                          <Link href={`/events/${event.id}/${locIndex}`} className="w-full">
                            Register Now
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          {featuredEvents.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={cn(
                "w-2 h-2 rounded-full p-0 mx-1", 
                { 
                  "bg-green-500": index === activeIndex,
                  "bg-muted": index !== activeIndex 
                }
              )}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;