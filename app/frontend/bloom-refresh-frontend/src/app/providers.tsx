import { ChakraProvider } from '@chakra-ui/react';
import { theme as chakraTheme } from '@chakra-ui/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>;
}