import React from 'react';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-4">Authentication</h1>
      <div className="space-x-4">
        <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
        <Link href="/auth/signup" className="text-blue-600 hover:underline">Sign Up</Link>
      </div>
    </div>
  );
} 