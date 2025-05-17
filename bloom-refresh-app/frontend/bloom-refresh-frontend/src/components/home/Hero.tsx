"use client"

import { useEffect, useState } from 'react';
import { Box, Button, Container, Flex, Heading, Text, Icon } from '@chakra-ui/react';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PARALLAX_FACTOR = 0.2;

const MotionBox = motion.create(Box);

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
}

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box position="relative" w="full" overflow="hidden">
      {/* Background with parallax effect */}
      <Box 
        position="absolute"
        inset={0}
        bgImage="url('https://images.pexels.com/photos/3738535/pexels-photo-3738535.jpeg?auto=compress&cs=tinysrgb&w=1600')"
        bgSize="cover"
        style={{ 
          transform: `translateY(${scrollY * PARALLAX_FACTOR}px)`,
          backgroundPosition: `center ${50 + scrollY * 0.05}%`
        }}
      >
        <Box 
          position="absolute"
          inset={0}
          bgGradient="linear(to-b, blackAlpha.700, blackAlpha.500, blackAlpha.950)"
        />
      </Box>
      
      <Container maxW="container.xl" position="relative" px={4} py={{ base: 32, md: 40 }} zIndex={10}>
        <Box maxW="3xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Heading 
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              color="white"
              mb={6}
            >
              Make Your Community
              <Box as="span" display="block" color="green.400">Bloom Again</Box>
            </Heading>
          </MotionBox>
          
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Text 
              fontSize={{ base: "lg", md: "xl" }}
              color="whiteAlpha.900"
              mb={8}
            >
              Join local cleanup events, connect with like-minded volunteers, and help 
              restore natural spaces in your neighborhood. Together, we can make a difference.
            </Text>
          </MotionBox>
          
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Flex 
              direction={{ base: "column", sm: "row" }}
              gap={4}
            >
              <Link href="/events" passHref>
                <Button 
                  as="span"
                  size="lg"
                  colorScheme="green"
                >
                  <Icon as={MapPin} />
                  <Box w={2} as="span" />
                  Find Events Near You
                </Button>
              </Link>
              <Link href="/organize" passHref>
                <Button 
                  as="span"
                  size="lg"
                  variant="outline"
                  color="white"
                  borderColor="white"
                  _hover={{ bg: "whiteAlpha.100" }}
                >
                  <Icon as={ArrowRight} />
                  <Box w={2} as="span" />
                  Organize a Cleanup
                </Button>
              </Link>
            </Flex>
          </MotionBox>
          
          {/* Stats */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Flex 
              direction={{ base: "column", sm: "row" }}
              gap={8}
              mt={16}
            >
              <StatCard 
                icon={Calendar}
                value="250+"
                label="Events This Month"
              />
              <StatCard 
                icon={Users}
                value="12,000+"
                label="Active Volunteers"
              />
              <StatCard 
                icon={() => <Text fontSize="3xl" fontWeight="bold" color="green.400">#</Text>}
                value="450 tons"
                label="Waste Collected"
              />
            </Flex>
          </MotionBox>
        </Box>
      </Container>
    </Box>
  );
};

const StatCard = ({ icon: Icon, value, label }: StatCardProps) => (
  <Flex 
    direction="column"
    align="center"
    p={6}
    bg="whiteAlpha.100"
    backdropFilter="blur(8px)"
    borderRadius="lg"
    _hover={{ bg: "whiteAlpha.200" }}
    transition="all 0.3s"
    flex={1}
  >
    <Icon as={Icon} w={8} h={8} color="green.400" mb={2} />
    <Text fontSize="2xl" fontWeight="bold" color="white" mb={1}>{value}</Text>
    <Text color="whiteAlpha.800" textAlign="center">{label}</Text>
  </Flex>
);

export default Hero;