import React from 'react';

export default function EventsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      <ul className="space-y-4">
        <li className="p-4 border rounded shadow-sm bg-white">
          <div className="font-semibold">Beach Cleanup</div>
          <div className="text-gray-600">Santa Monica Beach, July 15, 2025</div>
        </li>
        <li className="p-4 border rounded shadow-sm bg-white">
          <div className="font-semibold">Park Restoration</div>
          <div className="text-gray-600">Central Park, August 2, 2025</div>
        </li>
      </ul>
    </div>
  );
} 