'use client';

import { Box, Container, Heading, Text, SimpleGrid, Icon, Flex } from '@chakra-ui/react';
import { Users, Calendar, Leaf, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const stats = [
  {
    icon: Users,
    value: '12,000+',
    label: 'Active Volunteers',
    helpText: 'Growing community of environmental champions'
  },
  {
    icon: Calendar,
    value: '250+',
    label: 'Events This Month',
    helpText: 'Cleanup activities across the country'
  },
  {
    icon: Leaf,
    value: '450 tons',
    label: 'Waste Collected',
    helpText: 'Making our communities cleaner'
  },
  {
    icon: MapPin,
    value: '50+',
    label: 'Cities Covered',
    helpText: 'Expanding our impact nationwide'
  }
];

const ImpactStats = () => {
  return (
    <Box py={20} bg="green.50">
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
            Our Impact
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
            Together, we're making a real difference in our communities
          </Text>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8}>
          {stats.map((stat, index) => (
            <MotionBox
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Box
                px={6}
                py={8}
                bg="white"
                borderRadius="lg"
                shadow="md"
                textAlign="center"
                _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
                transition="all 0.3s"
              >
                <Flex justify="center" mb={4}>
                  <Box
                    p={3}
                    borderRadius="full"
                    bg="green.50"
                    color="green.500"
                  >
                    <Icon as={stat.icon} w={6} h={6} />
                  </Box>
                </Flex>
                <Heading fontSize="3xl" fontWeight="bold" color="green.600" mb={2}>
                  {stat.value}
                </Heading>
                <Text fontSize="lg" fontWeight="medium" mt={2}>
                  {stat.label}
                </Text>
                <Text color="gray.600" mt={1}>
                  {stat.helpText}
                </Text>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default ImpactStats; 