import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth/store';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { Button, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Stat, StatLabel, StatNumber, SimpleGrid } from '@chakra-ui/react';
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

  // Fetch all users
  const { data: users = [], isLoading: loadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => apiClient.get('/users'),
    enabled: !!isAuthenticated && user?.role === 'admin',
  });

  // Fetch all events
  const { data: events = [], isLoading: loadingEvents, refetch: refetchEvents } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => apiClient.get('/events'),
    enabled: !!isAuthenticated && user?.role === 'admin',
  });

  // Analytics
  const totalUsers = users.length;
  const totalEvents = events.length;
  const pendingEvents = events.filter((e: any) => e.status === 'pending').length;
  const approvedEvents = events.filter((e: any) => e.status === 'approved').length;
  const completedEvents = events.filter((e: any) => e.status === 'completed').length;
  const organizers = users.filter((u: any) => u.role === 'organizer').length;
  const volunteers = users.filter((u: any) => u.role === 'volunteer').length;
  const admins = users.filter((u: any) => u.role === 'admin').length;

  // Moderation actions
  const handleApproveEvent = async (id: string) => {
    // TODO: Call API to approve event
    toast.success('Event approved!');
    refetchEvents();
  };
  const handleRejectEvent = async (id: string) => {
    // TODO: Call API to reject event
    toast.success('Event rejected!');
    refetchEvents();
  };
  const handleDeleteEvent = async (id: string) => {
    // TODO: Call API to delete event
    toast.success('Event deleted!');
    refetchEvents();
  };
  const handleChangeUserRole = async (id: string, role: string) => {
    // TODO: Call API to change user role
    toast.success('User role updated!');
    refetchUsers();
  };
  const handleDeactivateUser = async (id: string) => {
    // TODO: Call API to deactivate user
    toast.success('User deactivated!');
    refetchUsers();
  };
  const handleDeleteUser = async (id: string) => {
    // TODO: Call API to delete user
    toast.success('User deleted!');
    refetchUsers();
  };

  return (
    <Box maxW="7xl" mx="auto" mt={10} p={8}>
      <Heading size="lg" mb={6}>Admin Panel</Heading>
      {/* Analytics */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
        <Stat>
          <StatLabel>Total Users</StatLabel>
          <StatNumber>{totalUsers}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Events</StatLabel>
          <StatNumber>{totalEvents}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Pending Events</StatLabel>
          <StatNumber>{pendingEvents}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Approved Events</StatLabel>
          <StatNumber>{approvedEvents}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Completed Events</StatLabel>
          <StatNumber>{completedEvents}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Organizers</StatLabel>
          <StatNumber>{organizers}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Volunteers</StatLabel>
          <StatNumber>{volunteers}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Admins</StatLabel>
          <StatNumber>{admins}</StatNumber>
        </Stat>
      </SimpleGrid>

      {/* User Management */}
      <Heading size="md" mb={4}>User Management</Heading>
      {loadingUsers ? <Text>Loading users...</Text> : (
        <Box overflowX="auto" mb={10}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((u: any) => (
                <Tr key={u.id}>
                  <Td>{u.id}</Td>
                  <Td>{u.username}</Td>
                  <Td>{u.email}</Td>
                  <Td>{u.role}</Td>
                  <Td>
                    <Button size="sm" mr={2} onClick={() => handleChangeUserRole(u.id, u.role === 'volunteer' ? 'organizer' : 'volunteer')}>Change Role</Button>
                    <Button size="sm" mr={2} onClick={() => handleDeactivateUser(u.id)}>Deactivate</Button>
                    <Button size="sm" style={{ background: '#f56565', color: 'white' }} onClick={() => handleDeleteUser(u.id)}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Event Management */}
      <Heading size="md" mb={4}>Event Management</Heading>
      {loadingEvents ? <Text>Loading events...</Text> : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Organizer</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events.map((e: any) => (
                <Tr key={e.id}>
                  <Td>{e.id}</Td>
                  <Td>{e.name}</Td>
                  <Td>{e.date}</Td>
                  <Td>{e.status}</Td>
                  <Td>{e.organizerName || e.organizerId}</Td>
                  <Td>
                    {e.status === 'pending' && <Button size="sm" mr={2} onClick={() => handleApproveEvent(e.id)}>Approve</Button>}
                    {e.status === 'pending' && <Button size="sm" mr={2} style={{ background: '#f56565', color: 'white' }} onClick={() => handleRejectEvent(e.id)}>Reject</Button>}
                    <Button size="sm" style={{ background: '#f56565', color: 'white' }} onClick={() => handleDeleteEvent(e.id)}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
} 