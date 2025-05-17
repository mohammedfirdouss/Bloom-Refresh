"use client";
import React from "react";
import { ChakraProvider } from '@chakra-ui/react';
import createCache from '@emotion/cache';

const cache = createCache({ key: 'css' });

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={cache}>{children}</ChakraProvider>;
}
