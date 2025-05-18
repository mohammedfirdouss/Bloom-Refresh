"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const PARALLAX_FACTOR = 0.2;

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background with parallax effect */}
      <div 
        className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3738535/pexels-photo-3738535.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center"
        style={{ 
          transform: `translateY(${scrollY * PARALLAX_FACTOR}px)`,
          backgroundPosition: `center ${50 + scrollY * 0.05}%`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background/95"></div>
      </div>
      
      <div className="container relative mx-auto px-4 pt-32 pb-32 md:pt-40 md:pb-40 z-10">
        <div className="max-w-3xl">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-up [--animate-delay:200ms]"
            style={{animationDuration: '1s', animationFillMode: 'both'}}
          >
            Make Your Community
            <span className="block text-green-400"> Bloom Again</span>
          </h1>
          
          <p 
            className="text-lg md:text-xl text-white/90 mb-8 animate-fade-up [--animate-delay:400ms]"
            style={{animationDuration: '1s', animationFillMode: 'both'}}
          >
            Join local cleanup events, connect with like-minded volunteers, and help 
            restore natural spaces in your neighborhood. Together, we can make a difference.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 animate-fade-up [--animate-delay:600ms]"
            style={{animationDuration: '1s', animationFillMode: 'both'}}
          >
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
              <Link href="/events" className="flex items-center gap-2">
                Find Events Near You
                <MapPin className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/organize" className="flex items-center gap-2">
                Organize a Cleanup
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 animate-fade-up [--animate-delay:800ms]"
            style={{animationDuration: '1s', animationFillMode: 'both'}}
          >
            <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors duration-300">
              <Calendar className="w-8 h-8 text-green-400 mb-2" />
              <div className="text-2xl font-bold text-white mb-1">250+</div>
              <div className="text-white/80 text-center">Events This Month</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors duration-300">
              <Users className="w-8 h-8 text-green-400 mb-2" />
              <div className="text-2xl font-bold text-white mb-1">12,000+</div>
              <div className="text-white/80 text-center">Active Volunteers</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors duration-300">
              <div className="w-8 h-8 text-green-400 mb-2 font-bold text-3xl">#</div>
              <div className="text-2xl font-bold text-white mb-1">450 tons</div>
              <div className="text-white/80 text-center">Waste Collected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;