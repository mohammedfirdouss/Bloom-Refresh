import { useState } from 'react';
import { Box, Heading, Text, Input, Button, FormControl, FormLabel, VStack, useToast } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);
  const toast = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: 'Passwords do not match', status: 'error' });
      return;
    }
    // TODO: Call API to reset password with token
    setSuccess(true);
    toast({ title: 'Password reset successful!', status: 'success' });
  };

  if (!token) {
    return <Box p={8}><Text color="red.500">Invalid or missing reset token.</Text></Box>;
  }

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="md" bg="white">
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">Reset Password</Heading>
        {success ? (
          <Text color="green.600">Your password has been reset. You can now log in.</Text>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormControl mb={4} isRequired>
              <FormLabel>New Password</FormLabel>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
            </FormControl>
            <Button colorScheme="green" type="submit" width="full">Reset Password</Button>
          </form>
        )}
      </VStack>
    </Box>
  );
} 