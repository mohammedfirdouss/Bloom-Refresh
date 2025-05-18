"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const CallToAction = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('cta-section');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <section 
      id="cta-section" 
      className="py-20 bg-green-50 dark:bg-green-900/10"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={cn(
              "lg:col-span-2 transition-all duration-1000 transform",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl">
                Whether you want to join an existing cleanup event or organize your own, Bloom Refresh makes it easy to contribute to a cleaner, healthier environment.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Find Events Near You</h3>
                    <p className="text-muted-foreground text-sm">
                      Use our interactive map to discover cleanup events in your community.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Create Your Own Event</h3>
                    <p className="text-muted-foreground text-sm">
                      Organize a cleanup in an area that needs attention and invite others to join.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Connect with Volunteers</h3>
                    <p className="text-muted-foreground text-sm">
                      Join a community of like-minded individuals committed to environmental stewardship.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                  <Link href="/events" className="flex items-center gap-2">
                    Find Events
                    <MapPin className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/10">
                  <Link href="/organize" className="flex items-center gap-2">
                    Organize Cleanup
                    <Calendar className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className={cn(
              "relative overflow-hidden rounded-lg h-[300px] lg:h-auto transition-all duration-1000 transform",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
              "delay-300"
            )}>
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.pexels.com/photos/6647115/pexels-photo-6647115.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="font-bold text-xl mb-2">Join Our Community</div>
                <p className="mb-4">Be part of the movement to create cleaner, healthier communities.</p>
                <Button variant="default" size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;