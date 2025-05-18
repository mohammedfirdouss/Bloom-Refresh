"use client";

import { useEffect, useState } from "react";
import { Box, Button, Container, Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { ArrowRight, MapPin, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRouter } from "next/navigation";

const PARALLAX_FACTOR = 0.2;

const MotionBox = motion.create(Box);

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
}

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-green-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Join Local Cleanup Events
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Discover and participate in community cleanup events. Make a difference in your neighborhood.
            </p>
          </div>
          <div className="space-x-4">
            <Button 
              size="lg"
              onClick={() => router.push('/events')}
            >
              Find Events
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push('/auth/signup')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const StatCard = ({ icon, value, label }: StatCardProps) => (
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
    <Icon as={icon} w={8} h={8} color="green.400" mb={2} />
    <Text fontSize="2xl" fontWeight="bold" color="white" mb={1}>{value}</Text>
    <Text color="whiteAlpha.800" textAlign="center">{label}</Text>
  </Flex>
);