import { useState } from 'react';
import { Box, Heading, Text, Input, Button, FormControl, FormLabel, VStack, useToast } from '@chakra-ui/react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to send reset email
    setSent(true);
    toast({ title: 'Password reset email sent!', status: 'success' });
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="md" bg="white">
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">Forgot Password</Heading>
        {sent ? (
          <Text color="green.600">If an account with that email exists, a reset link has been sent.</Text>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormControl mb={4} isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </FormControl>
            <Button colorScheme="green" type="submit" width="full">Send Reset Link</Button>
          </form>
        )}
      </VStack>
    </Box>
  );
} 