'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

interface ImpactStats {
  totalEvents: number;
  totalVolunteers: number;
  totalItemsCollected: number;
  totalAreaCleanedSqFt: number;
  totalTreesPlanted: number;
  recentPhotos: string[];
}

const ImpactPage = () => {
  // Fetch impact statistics
  const { 
    data: impactStats, 
    isLoading, 
    error 
  } = useQuery<ImpactStats>({
    queryKey: ['impact-stats'],
    queryFn: () => apiClient.getImpactStats(),
  });

  if (error) {
    toast.error('Error loading impact statistics', { 
      description: (error as Error).message || 'An unexpected error occurred' 
    });
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">Our Community Impact</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Together, we're making a difference in our communities. Here's what we've accomplished so far.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading impact statistics...</p>
        </div>
      ) : impactStats ? (
        <>
          {/* Impact Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-indigo-600">{impactStats.totalEvents}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 font-medium">Community Events</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-green-600">{impactStats.totalVolunteers}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 font-medium">Volunteers Engaged</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-amber-600">{impactStats.totalItemsCollected.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 font-medium">Items Collected</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-blue-600">{impactStats.totalTreesPlanted.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 font-medium">Trees Planted</p>
              </CardContent>
            </Card>
          </div>

          {/* Area Cleaned Highlight */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Total Area Cleaned</CardTitle>
              <CardDescription>Square feet of community space restored</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-teal-600">{impactStats.totalAreaCleanedSqFt.toLocaleString()}</span>
                    <span className="text-teal-600 ml-1">sq ft</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">That's approximately {(impactStats.totalAreaCleanedSqFt / 43560).toFixed(2)} acres!</span>
                  </div>
                </div>
                <div className="overflow-hidden h-4 mt-4 text-xs flex rounded bg-teal-200">
                  <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          {impactStats.recentPhotos && impactStats.recentPhotos.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Recent Event Photos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {impactStats.recentPhotos.map((photo, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md h-64">
                    <img 
                      src={photo} 
                      alt={`Community event photo ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Join Us in Making a Difference</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Every volunteer, every event, and every action contributes to our collective impact. 
              Find an upcoming event near you and be part of the change.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/events/browse" className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">
                Browse Events
              </a>
              <a href="/events/create" className="inline-block px-6 py-3 bg-white text-indigo-600 font-medium rounded-md border border-indigo-600 hover:bg-indigo-50">
                Create an Event
              </a>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Impact Data Available</h3>
          <p className="text-gray-500">
            We're still collecting data on our community impact. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default ImpactPage;
