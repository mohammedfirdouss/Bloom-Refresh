import React from "react";
import { useAuthStore } from '@/stores/auth/store';
import { Box, Flex, Button, Avatar, Menu, Spacer, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function Header() {
  const { user, isAuthenticated, logoutUser } = useAuthStore();

  return (
    <Box as="header" px={4} py={2} bg="white" boxShadow="sm">
      <Flex align="center">
        <Link href="/" passHref>
          <Flex as="a" align="center" gap={2} fontWeight="bold" fontSize="xl">
            <Text>Bloom Refresh</Text>
          </Flex>
        </Link>
        <Spacer />
        {isAuthenticated && user ? (
          <Menu>
            <Menu.Button as={Button} variant="ghost" p={0} borderRadius="full">
              <Avatar name={user.username} size="sm" />
            </Menu.Button>
            <Menu.List>
              <Link href="/dashboard/profile" passHref>
                <Menu.Item>Profile</Menu.Item>
              </Link>
              <Link href="/dashboard" passHref>
                <Menu.Item>Dashboard</Menu.Item>
              </Link>
              <Menu.Item onClick={logoutUser}>Logout</Menu.Item>
            </Menu.List>
          </Menu>
        ) : (
          <Flex gap={4}>
            <Link href="/auth/login" passHref>
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/auth/signup" passHref>
              <Button colorScheme="green">Sign Up</Button>
            </Link>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
