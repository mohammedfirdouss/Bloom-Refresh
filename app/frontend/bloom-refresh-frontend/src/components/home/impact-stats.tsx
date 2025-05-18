"use client"

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const ImpactStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedData, setAnimatedData] = useState({
    cleanups: 0,
    volunteers: 0,
    waste: 0,
    locations: 0
  });
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const animationDuration = 2000; // 2 seconds
  
  const finalData = {
    cleanups: 1250,
    volunteers: 12500,
    waste: 450,
    locations: 780
  };
  
  const wasteTypeData = [
    { name: 'Plastic', value: 42 },
    { name: 'Paper', value: 18 },
    { name: 'Glass', value: 15 },
    { name: 'Metal', value: 12 },
    { name: 'Other', value: 13 }
  ];
  
  const monthlyData = [
    { name: 'Jan', waste: 32, volunteers: 180 },
    { name: 'Feb', waste: 38, volunteers: 220 },
    { name: 'Mar', waste: 45, volunteers: 250 },
    { name: 'Apr', waste: 42, volunteers: 290 },
    { name: 'May', waste: 55, volunteers: 350 },
    { name: 'Jun', waste: 67, volunteers: 420 },
    { name: 'Jul', waste: 63, volunteers: 460 },
    { name: 'Aug', waste: 58, volunteers: 440 },
    { name: 'Sep', waste: 50, volunteers: 380 },
    { name: 'Oct', waste: 42, volunteers: 320 },
    { name: 'Nov', waste: 38, volunteers: 280 },
    { name: 'Dec', waste: 35, volunteers: 240 }
  ];
  
  const COLORS = ['#4ADE80', '#38BDF8', '#F97316', '#A855F7', '#94A3B8'];
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          startCountAnimation();
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('impact-stats');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);
  
  const startCountAnimation = () => {
    startTimeRef.current = Date.now();
    animateCount();
  };
  
  const animateCount = () => {
    if (!startTimeRef.current) return;
    
    const elapsed = Date.now() - startTimeRef.current;
    const progress = Math.min(elapsed / animationDuration, 1);
    
    // Easing function for smoother animation
    const easedProgress = easeOutCubic(progress);
    
    setAnimatedData({
      cleanups: Math.floor(easedProgress * finalData.cleanups),
      volunteers: Math.floor(easedProgress * finalData.volunteers),
      waste: Math.floor(easedProgress * finalData.waste),
      locations: Math.floor(easedProgress * finalData.locations)
    });
    
    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animateCount);
    }
  };
  
  // Easing function for smoother animation
  const easeOutCubic = (x: number): number => {
    return 1 - Math.pow(1 - x, 3);
  };

  return (
    <section 
      id="impact-stats" 
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className={cn(
          "text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 transform",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <h2 className="text-3xl font-bold mb-4">Our Environmental Impact</h2>
          <p className="text-muted-foreground">
            See how our community's efforts are making a difference across the country. Every cleanup event contributes to these growing numbers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Cleanups Completed", value: animatedData.cleanups, suffix: "" },
            { label: "Volunteers Participated", value: animatedData.volunteers, suffix: "+" },
            { label: "Tons of Waste Collected", value: animatedData.waste, suffix: "" },
            { label: "Locations Improved", value: animatedData.locations, suffix: "" }
          ].map((stat, index) => (
            <div
              key={index}
              className={cn(
                "bg-card p-6 rounded-lg text-center transition-all duration-1000 transform",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                { "delay-100": index === 0, "delay-300": index === 1, "delay-500": index === 2, "delay-700": index === 3 }
              )}
            >
              <h3 className="text-muted-foreground font-medium mb-3">{stat.label}</h3>
              <div className="text-4xl font-bold text-green-500">
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={cn(
            "bg-card p-6 rounded-lg transition-all duration-1000 transform",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10",
            "delay-800"
          )}>
            <h3 className="text-xl font-bold mb-6 text-center">Types of Waste Collected</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wasteTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {wasteTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className={cn(
            "bg-card p-6 rounded-lg transition-all duration-1000 transform",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10",
            "delay-900"
          )}>
            <h3 className="text-xl font-bold mb-6 text-center">Monthly Impact</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#4ADE80" />
                  <YAxis yAxisId="right" orientation="right" stroke="#38BDF8" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="waste" name="Waste (tons)" fill="#4ADE80" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="volunteers" name="Volunteers" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;