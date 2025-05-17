'use client';

import { Box, Container, Heading, Text, SimpleGrid, Icon, Flex } from '@chakra-ui/react';
import { Search, Calendar, Users, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const steps = [
  {
    icon: Search,
    title: 'Find Events',
    description: 'Browse through our curated list of cleanup events in your area. Filter by date, location, or type of activity.'
  },
  {
    icon: Calendar,
    title: 'Join & Register',
    description: 'Select an event that interests you and register to participate. Get all the details about timing, location, and requirements.'
  },
  {
    icon: Users,
    title: 'Connect & Collaborate',
    description: 'Meet like-minded volunteers, share experiences, and work together to make a positive impact in your community.'
  },
  {
    icon: Leaf,
    title: 'Make an Impact',
    description: 'Contribute to a cleaner environment while building lasting connections and creating meaningful change.'
  }
];

const HowItWorks = () => {
  return (
    <Box py={20} bg="gray.50">
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          textAlign="center"
          mb={12}
        >
          <Heading 
            size="2xl" 
            mb={4}
            bgGradient="linear(to-r, green.600, green.400)"
            bgClip="text"
          >
            How It Works
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
            Join our community and make a difference in just a few simple steps
          </Text>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8}>
          {steps.map((step, index) => (
            <MotionBox
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Flex
                direction="column"
                align="center"
                textAlign="center"
                p={6}
                bg="white"
                borderRadius="lg"
                shadow="md"
                height="full"
                _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
                transition="all 0.3s"
              >
                <Box
                  p={4}
                  borderRadius="full"
                  bg="green.50"
                  color="green.500"
                  mb={4}
                >
                  <Icon as={step.icon} w={8} h={8} />
                </Box>
                <Heading size="md" mb={3}>
                  {step.title}
                </Heading>
                <Text color="gray.600">
                  {step.description}
                </Text>
              </Flex>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default HowItWorks; 