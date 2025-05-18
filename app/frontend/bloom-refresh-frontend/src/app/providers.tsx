
"use client";

import { ChakraProvider, createSystem, defaultBaseConfig } from "@chakra-ui/react";
import { ReactNode } from "react";
import { customConfig } from "./theme";

const customSystem = createSystem(defaultBaseConfig, customConfig);

export function Providers({ children }: { children: ReactNode }) {
  return <ChakraProvider value={customSystem}>{children}</ChakraProvider>;
}
