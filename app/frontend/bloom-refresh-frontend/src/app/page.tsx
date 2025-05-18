'use client';
import { useEffect, useState } from "react";
import { Box, Container, Heading, Text, SimpleGrid, Button, Flex, Link as ChakraLink } from "@chakra-ui/react";
import { useAuthStore } from "@/stores/auth/store";
import apiClient from "@/api/client";
import { EventsList } from "@/features/events/components";
import Hero from '@/components/home/hero';
import FeaturedEvents from '@/components/home/featured-events';
import HowItWorks from '@/components/home/how-it-works';
import ImpactStats from '@/components/home/impact-stats';
import CallToAction from '@/components/home/call-to-action';
import Link from "next/link";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          const { featuredEvents } = await import('@/lib/mock-data');
          setEvents(featuredEvents.flatMap(e => e.locations));
        } else {
          const response = await apiClient.get('/events/featured');
          setEvents(response.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Hero />
      <FeaturedEvents />
      <HowItWorks />
      <ImpactStats />
      <CallToAction />
    </div>
  );
}
