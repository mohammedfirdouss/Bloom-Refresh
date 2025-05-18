'use client';

import { useState, useEffect } from 'react';
import { Box, Flex, Container, IconButton, Button, HStack, VStack, Drawer, DrawerContent, DrawerBody, useDisclosure, Spacer, Text } from '@chakra-ui/react';
import { Sun, Moon, Menu, X, Leaf } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { label: 'Find Events', href: '/events' },
  { label: 'About', href: '/about/mission' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Organize', href: '/organize' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/blog' },
  { label: 'Donate', href: '/donate' },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Sponsor', href: '/sponsor' },
  { label: 'Partners', href: '/partners' },
  { label: 'Resources', href: '/resources' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={50}
      bg="white"
      borderBottom="1px solid #e2e8f0"
      boxShadow={isScrolled ? 'sm' : 'none'}
      transition="all 0.2s"
      backdropFilter={isScrolled ? 'blur(8px)' : 'none'}
    >
      <Container maxW="container.xl" px={4} py={2}>
        <Flex align="center" justify="space-between">
          <Link href="/" passHref>
            <Flex align="center" fontWeight="bold" fontSize="xl" gap={2}>
              <Leaf size={28} color="#22c55e" />
              <Text>Bloom Refresh</Text>
            </Flex>
          </Link>
          <Spacer />
          {/* Desktop Nav */}
          <Flex direction="row" display={{ base: 'none', md: 'flex' }} gap={6}>
            {navLinks.map((link) => (
              <Link href={link.href} key={link.href} passHref>
                <Button variant="ghost">
                  {link.label}
                </Button>
              </Link>
            ))}
            <IconButton
              aria-label="Toggle color mode"
              variant="ghost"
            >
              <Moon />
            </IconButton>
            <Link href="/signup" passHref>
              <Button colorScheme="green" size="sm">
                Sign Up
              </Button>
            </Link>
            <Link href="/login" passHref>
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
          </Flex>
          {/* Mobile Nav */}
          <IconButton
            aria-label="Open menu"
            display={{ base: 'flex', md: 'none' }}
            onClick={() => setMobileMenuOpen(true)}
            variant="ghost"
          >
            <Menu />
          </IconButton>
        </Flex>
      </Container>
      {mobileMenuOpen && (
        <Box position="fixed" top={0} right={0} w="70vw" h="100vh" bg="white" zIndex={1000} p={4}>
          <IconButton aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} variant="ghost">
            <X />
          </IconButton>
          {navLinks.map((link) => (
            <Link href={link.href} key={link.href} passHref>
              <Button variant="ghost" w="full" justifyContent="flex-start" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Button>
            </Link>
          ))}
          <Button variant="ghost" w="full" justifyContent="flex-start">
            <Moon /> Toggle Theme
          </Button>
          <Link href="/signup" passHref>
            <Button colorScheme="green" w="full" onClick={() => setMobileMenuOpen(false)}>
              Sign Up
            </Button>
          </Link>
          <Link href="/login" passHref>
            <Button variant="outline" w="full" onClick={() => setMobileMenuOpen(false)}>
              Log In
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default Header;