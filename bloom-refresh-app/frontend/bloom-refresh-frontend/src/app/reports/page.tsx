import React from 'react';

export default function ReportsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <ul className="space-y-4">
        <li className="p-4 border rounded shadow-sm bg-white">
          <div className="font-semibold">Beach Cleanup Report</div>
          <div className="text-gray-600">10 bags collected, July 15, 2025</div>
        </li>
        <li className="p-4 border rounded shadow-sm bg-white">
          <div className="font-semibold">Park Restoration Report</div>
          <div className="text-gray-600">5 trees planted, August 2, 2025</div>
        </li>
      </ul>
    </div>
  );
} 