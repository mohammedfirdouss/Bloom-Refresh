"use client"

import { useEffect, useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Trash2, 
  ShieldCheck,
  BarChart 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    icon: MapPin,
    title: "Find Events",
    description: "Discover cleanup events near you on our interactive map or browse through the event list.",
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    icon: Calendar,
    title: "Register",
    description: "Sign up for events that fit your schedule and interests, and receive reminder notifications.",
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/20"
  },
  {
    icon: Trash2,
    title: "Participate",
    description: "Join with others on the event day to collect trash and help clean your local environment.",
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-900/20"
  },
  {
    icon: BarChart,
    title: "Track Impact",
    description: "Record the types and amounts of waste collected to see your environmental contribution.",
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/20"
  }
];

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('how-it-works');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <section 
      id="how-it-works" 
      className="py-20 bg-muted/50"
    >
      <div className="container mx-auto px-4">
        <div className={cn(
          "text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 transform",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <h2 className="text-3xl font-bold mb-4">How Bloom Refresh Works</h2>
          <p className="text-muted-foreground">
            Join our community of environmental stewards in four simple steps and start making a difference today.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center text-center p-6 rounded-lg bg-card transition-all duration-1000 transform",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                { "delay-100": index === 0, "delay-300": index === 1, "delay-500": index === 2, "delay-700": index === 3 }
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-4",
                step.bgColor
              )}>
                <step.icon className={cn("w-8 h-8", step.color)} />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {/* Only add the connector for steps 0, 1, and 2 (not the last one) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-0 w-full" style={{ left: `${(index + 0.5) * 25}%` }}>
                  <div className={cn(
                    "w-1/4 h-0.5 bg-muted-foreground/30 transition-all duration-1000 transform",
                    isVisible ? "opacity-100" : "opacity-0",
                    { "delay-200": index === 0, "delay-400": index === 1, "delay-600": index === 2 }
                  )} />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className={cn(
          "mt-16 p-6 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 max-w-3xl mx-auto transition-all duration-1000 transform",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          "delay-900"
        )}>
          <div className="flex items-start gap-4">
            <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-3 mt-1">
              <ShieldCheck className="text-green-500 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Safety First</h3>
              <p className="text-muted-foreground">
                All our events follow strict safety guidelines. We provide essential information and recommendations to ensure a safe and enjoyable experience for all participants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;