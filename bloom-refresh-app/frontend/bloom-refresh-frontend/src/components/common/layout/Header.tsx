import React from "react";
import { useAuthStore } from '@/stores/auth/store';
import { Box, Flex, HStack, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, Spacer, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function Header() {
  const { user, isAuthenticated, logoutUser } = useAuthStore();

  return (
    <Box as="header" px={4} py={2} bg="white" boxShadow="sm">
      <Flex align="center">
        <HStack as={Link} href="/" spacing={2} fontWeight="bold" fontSize="xl">
          <Text>Bloom Refresh</Text>
        </HStack>
        <Spacer />
        {isAuthenticated && user ? (
          <Menu>
            <MenuButton as={Button} variant="ghost" p={0} borderRadius="full">
              <Avatar name={user.username} size="sm" />
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} href="/dashboard/profile">Profile</MenuItem>
              <MenuItem as={Link} href="/dashboard">Dashboard</MenuItem>
              <MenuItem onClick={logoutUser}>Logout</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <HStack spacing={4}>
            <Button as={Link} href="/auth/login" variant="outline">Log In</Button>
            <Button as={Link} href="/auth/signup" colorScheme="green">Sign Up</Button>
          </HStack>
        )}
      </Flex>
    </Box>
  );
}
