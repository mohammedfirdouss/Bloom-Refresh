'use client';
import { useEffect, useState } from "react";
import { Box, Container, Heading, Text, SimpleGrid, Button, Flex, Link as ChakraLink, useToast } from "@chakra-ui/react";
import { useAuthStore } from "@/stores/auth/store";
import apiClient from "@/api/client";
import { EventsList } from "@/features/events/components";
import Hero from "@/components/home/Hero";
import CallToAction from "@/components/home/CallToAction";
import HowItWorks from "@/components/home/HowItWorks";
import ImpactStats from "@/components/home/ImpactStats";
import Link from "next/link";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuthStore();
  const toast = useToast();

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
        toast({
          title: 'Error',
          description: 'Failed to load featured events',
          status: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  return (
    <Box>
      <Hero />

      
      
      <Container maxW="container.xl" py={8} px={4}>
        <Box mb={6} textAlign="center">
          {isAuthenticated ? (
            <Text color="green.700">Logged in as {user?.username}</Text>
          ) : (
            <Text color="gray.600">You are not logged in.</Text>
          )}
          <Button mt={4} colorScheme="green" onClick={() => toast({ title: 'This is a toast!', description: 'Chakra UI toasts are easy.', status: 'success' })}>
            Show Toast
          </Button>
        </Box>

        <Heading as="h2" size="xl" mb={4}>Featured Events</Heading>
        {loading ? (
          <Text>Loading events...</Text>
        ) : events.length === 0 ? (
          <Text>No featured events found.</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
            {events.map((event) => (
              <Box 
                key={event.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p={4}
                bg="white"
                shadow="md"
              >
                <Heading size="md" mb={2}>{event.name || event.eventName}</Heading>
                <Text mb={2} color="gray.700">{event.description}</Text>
                <Text mb={4} fontSize="sm" color="gray.500">{event.date}</Text>
                <ChakraLink as={Link} href={`/events/${event.id}`} _hover={{ textDecoration: 'none' }}>
                  <Button 
                    colorScheme="green"
                    width="full"
                  >
                    View Event
                  </Button>
                </ChakraLink>
              </Box>
            ))}
          </SimpleGrid>
        )}

        <Flex justify="center" gap={4} mb={8}>
          <ChakraLink as={Link} href="/events/browse" _hover={{ textDecoration: 'none' }}>
            <Button variant="outline">
              Browse All Events
            </Button>
          </ChakraLink>
          <ChakraLink as={Link} href="/events/create" _hover={{ textDecoration: 'none' }}>
            <Button variant="outline">
              Create New Event
            </Button>
          </ChakraLink>
        </Flex>

        <Heading as="h2" size="xl" mb={4}>Upcoming Events</Heading>
        <EventsList />
      </Container>

      <ImpactStats />
      <HowItWorks />
      <CallToAction />
    </Box>
  );
}
