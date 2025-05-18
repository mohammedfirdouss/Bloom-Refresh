import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth/store';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { Button, Box, Heading, Text } from '@chakra-ui/react';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    if (isAuthenticated && user && user.role !== 'admin') {
      toast.error('Access Denied', { description: 'Admin access required.' });
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const { data: pendingEvents, isLoading, refetch } = useQuery({
    queryKey: ['admin-pending-events'],
    queryFn: () => apiClient.get('/events?status=pending'),
    enabled: !!isAuthenticated && user?.role === 'admin',
  });

  const handleApprove = async (id: string) => {
    // TODO: Call API to approve event
    toast.success('Event approved!');
    refetch();
  };
  const handleReject = async (id: string) => {
    // TODO: Call API to reject event
    toast.success('Event rejected!');
    refetch();
  };

  return (
    <Box maxW="4xl" mx="auto" mt={10} p={8}>
      <Heading size="lg" mb={6}>Admin Dashboard: Pending Events</Heading>
      {isLoading ? (
        <Text>Loading pending events...</Text>
      ) : pendingEvents && pendingEvents.length > 0 ? (
        pendingEvents.map((event: any) => (
          <Box key={event.id} p={4} mb={4} borderWidth={1} borderRadius="md" bg="white" boxShadow="sm">
            <Heading size="md">{event.name}</Heading>
            <Text>Date: {event.date}</Text>
            <Text>Location: {event.location}</Text>
            <Text>Status: {event.status}</Text>
            <Box mt={2} display="flex" gap={2}>
              <Button colorScheme="green" onClick={() => handleApprove(event.id)}>Approve</Button>
              <Button style={{ background: '#f56565', color: 'white' }} onClick={() => handleReject(event.id)}>Reject</Button>
            </Box>
          </Box>
        ))
      ) : (
        <Text>No pending events.</Text>
      )}
    </Box>
  );
} 