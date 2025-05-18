import { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Button } from '@chakra-ui/react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    // TODO: Call API to verify email with token
    setTimeout(() => setStatus('success'), 1500); // Simulate API
  }, [token]);

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="md" bg="white" textAlign="center">
      <Heading size="lg" mb={4}>Verify Email</Heading>
      {status === 'verifying' && <Spinner size="lg" />}
      {status === 'success' && (
        <>
          <Text color="green.600" mb={4}>Your email has been verified! You can now log in.</Text>
          <Button colorScheme="green" onClick={() => router.push('/auth/login')}>Go to Login</Button>
        </>
      )}
      {status === 'error' && <Text color="red.500">Invalid or missing verification token.</Text>}
    </Box>
  );
} 