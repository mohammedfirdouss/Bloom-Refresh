'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth/store';
import { toast } from 'sonner';
import { Box, Text, Button } from '@chakra-ui/react';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  role: yup.string().oneOf(['volunteer', 'organizer'], 'Invalid role').required('Role is required'),
})
  .noUnknown('Unknown field in signup payload')
  .required()
  .strict();

type SignupFormData = yup.InferType<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const { signupUser, isLoading, error } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: yupResolver(schema)
  });
  const [showVerify, setShowVerify] = useState(false);
  const [email, setEmail] = useState('');

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signupUser(data);
      toast.success('Account created successfully!');
      router.push('/auth/login');
      setShowVerify(true);
      setEmail(data.email);
    } catch (err) {
      // prefer error coming directly from the thrown value or store *after* update
      const storeError = typeof err === 'string' ? err : (err as Error)?.message;
      toast.error(storeError || 'Signup failed. Please try again.');
    }
  };

  const handleResend = () => {
    // TODO: Call API to resend verification email
    alert('Verification email resent!');
  };

  if (showVerify) {
    return (
      <Box p={8}>
        <Text>A verification email has been sent to {email}. Please check your inbox.</Text>
        <Button mt={4} onClick={handleResend}>Resend Verification Email</Button>
      </Box>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              {...register('username')}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              {...register('role')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select a role</option>
              <option value="volunteer">Volunteer</option>
              <option value="organizer">Organizer</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
} 