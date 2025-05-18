
'use client';

import React from 'react';
import { Box, Container, Flex, Button, Text } from '@chakra-ui/react';
import { useAuthStore } from '@/stores/auth/store';
import Link from 'next/link';

export default function Header() {
  const { user, isAuthenticated, logoutUser } = useAuthStore();

  return (
    <Box as="header" px={4} py={2} bg="white" boxShadow="sm">
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Link href="/">
            <Text fontSize="xl" fontWeight="bold">Bloom Refresh</Text>
          </Link>
          
          <Flex gap={4} align="center">
            {isAuthenticated ? (
              <>
                <Text>Hi, {user?.name}</Text>
                <Button onClick={logoutUser}>Logout</Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button colorScheme="blue">Sign Up</Button>
                </Link>
              </>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
