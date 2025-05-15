import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6 text-gray-700">Welcome to your dashboard. Use the links below to navigate:</p>
      <div className="space-x-4">
        <Link href="/events" className="text-blue-600 hover:underline">Events</Link>
        <Link href="/reports" className="text-blue-600 hover:underline">Reports</Link>
        <Link href="/auth" className="text-blue-600 hover:underline">Auth</Link>
      </div>
    </div>
  );
} 