import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Heading, Spinner, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import EventEditForm from '@/features/events/components/EventEditForm';

export default function EditEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (!id) return;
    // TODO: Fetch event by ID from API
    // setEvent(fetchedEvent);
    setLoading(false);
  }, [id]);

  if (loading) return <Spinner />;
  if (!event) return <Box p={8}><Heading size="md">Event not found.</Heading></Box>;

  return (
    <Box maxW="2xl" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="md" bg="white">
      <Heading size="lg" mb={6}>Edit Event</Heading>
      <EventEditForm event={event} onSuccess={() => {
        toast({ title: 'Event updated!', status: 'success' });
        router.push('/dashboard/organizer');
      }} />
    </Box>
  );
} 