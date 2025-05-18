'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { toast } from 'sonner';
import Link from 'next/link';

// Define the schema for report submission form validation
const reportSchema = yup.object().shape({
  volunteersAttended: yup
    .number()
    .required('Number of volunteers is required')
    .positive('Must be a positive number')
    .integer('Must be a whole number'),
  itemsCollected: yup
    .number()
    .nullable()
    .transform((value: unknown) => (isNaN(Number(value)) ? null : value))
    .positive('Must be a positive number')
    .integer('Must be a whole number'),
  areaCleanedSqFt: yup
    .number()
    .nullable()
    .transform((value: unknown) => (isNaN(Number(value)) ? null : value))
    .positive('Must be a positive number'),
  treesPlanted: yup
    .number()
    .nullable()
    .transform((value: unknown) => (isNaN(Number(value)) ? null : value))
    .positive('Must be a positive number')
    .integer('Must be a whole number'),
  photoUrl1: yup
    .string()
    .nullable()
    .url('Must be a valid URL'),
  photoUrl2: yup
    .string()
    .nullable()
    .url('Must be a valid URL'),
  photoUrl3: yup
    .string()
    .nullable()
    .url('Must be a valid URL'),
  notes: yup
    .string()
    .nullable()
    .max(1000, 'Notes must be less than 1000 characters'),
});

interface ReportFormInputs {
  volunteersAttended: number;
  itemsCollected?: number | null;
  areaCleanedSqFt?: number | null;
  treesPlanted?: number | null;
  photoUrl1?: string | null;
  photoUrl2?: string | null;
  photoUrl3?: string | null;
  notes?: string | null;
}

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  category: string;
  organizer: string;
}

const SubmitReportPage = () => {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch event details
  const { 
    data: event, 
    isLoading: isLoadingEvent, 
    error: eventError 
  } = useQuery<Event>({
    queryKey: ['event', eventId],
    queryFn: () => apiClient.get("/events/" + eventId),
    enabled: !!eventId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReportFormInputs>({
    resolver: yupResolver<ReportFormInputs, any, any>(reportSchema),
    defaultValues: {
      volunteersAttended: undefined,
      itemsCollected: null,
      areaCleanedSqFt: null,
      treesPlanted: null,
      photoUrl1: null,
      photoUrl2: null,
      photoUrl3: null,
      notes: null,
    }
  });

  // Submit report mutation
  const submitReportMutation = useMutation({
    mutationFn: (reportData: ReportFormInputs) => {
      // Process photo URLs into an array, filtering out nulls
      const photoUrls = [reportData.photoUrl1, reportData.photoUrl2, reportData.photoUrl3]
        .filter(url => url !== null && url !== '') as string[];
      
      // Prepare metrics object
      const metrics = {
        volunteersAttended: reportData.volunteersAttended,
        ...(reportData.itemsCollected ? { itemsCollected: reportData.itemsCollected } : {}),
        ...(reportData.areaCleanedSqFt ? { areaCleanedSqFt: reportData.areaCleanedSqFt } : {}),
        ...(reportData.treesPlanted ? { treesPlanted: reportData.treesPlanted } : {}),
      };

      // Prepare final report data
      const finalReportData = {
        metrics,
        photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
        notes: reportData.notes || undefined,
      };

      return apiClient.post("/reports/" + eventId, finalReportData);
    },
    onSuccess: () => {
      toast.success('Report Submitted Successfully', {
        description: 'Thank you for contributing to our impact tracking!',
      });
      queryClient.invalidateQueries({ queryKey: ['user-reports'] });
      queryClient.invalidateQueries({ queryKey: ['organizer-reports'] });
      queryClient.invalidateQueries({ queryKey: ['impact-stats'] });
      
      // Redirect to dashboard after successful submission
      router.push('/dashboard/volunteer');
    },
    onError: (error: any) => {
      toast.error('Error Submitting Report', {
        description: error.message || 'An unexpected error occurred',
      });
    },
  });

  React.useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.error('Authentication Required', {
        description: 'Please log in to submit reports',
      });
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const onSubmit = (data: ReportFormInputs) => {
    submitReportMutation.mutate(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-gray-600">Please log in to submit a report.</p>
      </div>
    );
  }

  if (isLoadingEvent) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-gray-600">Loading event details...</p>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold">Event Not Found</h1>
        <p className="text-gray-600 mt-2">
          {eventError ? `Error: ${(eventError as Error).message}` : "Sorry, we couldn't find the event you're looking for."}
        </p>
        <Link href="/dashboard/volunteer" className="mt-4 inline-block text-blue-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Submit Event Report</CardTitle>
          <CardDescription>
            For: {event.name} on {new Date(event.date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Event Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="volunteersAttended" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Volunteers <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    id="volunteersAttended" 
                    type="number" 
                    {...register('volunteersAttended')} 
                  />
                  {errors.volunteersAttended && (
                    <p className="text-xs text-red-600 mt-1">{errors.volunteersAttended.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="itemsCollected" className="block text-sm font-medium text-gray-700 mb-1">
                    Items Collected (if applicable)
                  </label>
                  <Input 
                    id="itemsCollected" 
                    type="number" 
                    {...register('itemsCollected')} 
                  />
                  {errors.itemsCollected && (
                    <p className="text-xs text-red-600 mt-1">{errors.itemsCollected.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="areaCleanedSqFt" className="block text-sm font-medium text-gray-700 mb-1">
                    Area Cleaned (sq ft, if applicable)
                  </label>
                  <Input 
                    id="areaCleanedSqFt" 
                    type="number" 
                    step="0.01"
                    {...register('areaCleanedSqFt')} 
                  />
                  {errors.areaCleanedSqFt && (
                    <p className="text-xs text-red-600 mt-1">{errors.areaCleanedSqFt.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="treesPlanted" className="block text-sm font-medium text-gray-700 mb-1">
                    Trees Planted (if applicable)
                  </label>
                  <Input 
                    id="treesPlanted" 
                    type="number" 
                    {...register('treesPlanted')} 
                  />
                  {errors.treesPlanted && (
                    <p className="text-xs text-red-600 mt-1">{errors.treesPlanted.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Photo URLs</h3>
              <p className="text-sm text-gray-500 mb-4">
                Add links to photos from the event. These help showcase the impact and may be featured on the impact page.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="photoUrl1" className="block text-sm font-medium text-gray-700 mb-1">
                    Photo URL #1
                  </label>
                  <Input 
                    id="photoUrl1" 
                    type="url" 
                    placeholder="https://example.com/photo1.jpg" 
                    {...register('photoUrl1')} 
                  />
                  {errors.photoUrl1 && (
                    <p className="text-xs text-red-600 mt-1">{errors.photoUrl1.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="photoUrl2" className="block text-sm font-medium text-gray-700 mb-1">
                    Photo URL #2
                  </label>
                  <Input 
                    id="photoUrl2" 
                    type="url" 
                    placeholder="https://example.com/photo2.jpg" 
                    {...register('photoUrl2')} 
                  />
                  {errors.photoUrl2 && (
                    <p className="text-xs text-red-600 mt-1">{errors.photoUrl2.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="photoUrl3" className="block text-sm font-medium text-gray-700 mb-1">
                    Photo URL #3
                  </label>
                  <Input 
                    id="photoUrl3" 
                    type="url" 
                    placeholder="https://example.com/photo3.jpg" 
                    {...register('photoUrl3')} 
                  />
                  {errors.photoUrl3 && (
                    <p className="text-xs text-red-600 mt-1">{errors.photoUrl3.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea 
                id="notes" 
                rows={4} 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Any additional information about the event outcomes..."
                {...register('notes')} 
              />
              {errors.notes && (
                <p className="text-xs text-red-600 mt-1">{errors.notes.message}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || submitReportMutation.isPending}
              >
                {isSubmitting || submitReportMutation.isPending ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitReportPage;
