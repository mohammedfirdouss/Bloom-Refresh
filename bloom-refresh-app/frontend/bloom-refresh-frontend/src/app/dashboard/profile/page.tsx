import { useAuthStore } from '@/stores/auth/store';
import { Box, Heading, Text, Avatar, Button, Input, FormControl, FormLabel, VStack, useToast } from '@chakra-ui/react';
import { useState } from 'react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const toast = useToast();

  // Placeholder for update logic
  const handleUpdate = () => {
    toast({ title: 'Profile updated!', status: 'success' });
  };

  if (!user) {
    return (
      <Box p={8}>
        <Heading size="lg">Profile</Heading>
        <Text mt={4}>You must be logged in to view your profile.</Text>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="md" bg="white">
      <VStack spacing={6} align="stretch">
        <Avatar name={user.username} size="xl" alignSelf="center" />
        <Heading size="lg" textAlign="center">Profile</Heading>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input value={username} onChange={e => setUsername(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input value={email} onChange={e => setEmail(e.target.value)} />
        </FormControl>
        <Button colorScheme="green" onClick={handleUpdate}>Update Profile</Button>
      </VStack>
    </Box>
  );
} 