'use client';

import { Box, Container, Heading, Text, Button, Flex, Icon, Link as ChakraLink } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const CallToAction = () => {
  return (
    <Box 
  bg="green.50" 
  py={20}
  bgGradient="linear(to-b, green.50, white)"
  borderTopWidth="1px"
  borderColor="green.100"
>
      <Container maxW="container.xl">
        <Flex 
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap={8}
        >
          <Box flex={1}>
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Heading 
                size="2xl" 
                mb={4}
                bgGradient="linear(to-r, green.600, green.400)"
                bgClip="text"
              >
                Ready to Make a Difference?
              </Heading>
              <Text fontSize="xl" color="gray.600" mb={6}>
                Join our community of volunteers and help create a cleaner, greener future. 
                Every small action counts towards a bigger impact.
              </Text>
            </MotionBox>
          </Box>

          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
              <ChakraLink as={Link} href="/events/browse" _hover={{ textDecoration: 'none' }}>
                <Button
                  size="lg"
                  colorScheme="green"
                  width="full"
                >
                  Find Events <Icon as={ArrowRight} ml={2} />
                </Button>
              </ChakraLink>
              <ChakraLink as={Link} href="/organize" _hover={{ textDecoration: 'none' }}>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="green"
                  width="full"
                >
                  Organize Event
                </Button>
              </ChakraLink>
            </Flex>
          </MotionBox>
        </Flex>
      </Container>
    </Box>
  );
};

export default CallToAction; 