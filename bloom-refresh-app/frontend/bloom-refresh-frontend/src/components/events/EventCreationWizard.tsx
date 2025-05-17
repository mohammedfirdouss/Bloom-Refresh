
CLIENT_ALIAS_0:
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner'; // Updated to use sonner

// Define the schema for event creation form validation
const eventSchema = yup.object().shape({
  eventName: yup.string().required('Event name is required').min(3, 'Event name must be at least 3 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  date: yup.string().required('Date is required').matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: yup.string().required('Time is required').matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format'),
  location: yup.string().required('Location is required'),
  category: yup.string().required('Category is required'),
  requiredVolunteers: yup.number().positive('Number of volunteers must be positive').integer().typeError('Must be a number').required('Required volunteers is required'),
  photoUrl: yup.string().url('Must be a valid URL').optional().nullable(),
});

interface EventFormInputs {
  eventName: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  requiredVolunteers: number;
  photoUrl?: string;
}

const EventCreationWizard = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EventFormInputs>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
        eventName: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        location: '',
        category: '',
        requiredVolunteers: 10,
        photoUrl: '',
    }
  });

  const createEventMutation = useMutation({
    mutationFn: (newEvent: EventFormInputs) => {
        return apiClient.createEvent(newEvent);
    },
    onSuccess: (data) => {
      toast.success("Event Created!", {
        description: `Successfully created event: ${data.name || data.eventName}`,
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      reset();
    },
    onError: (error: any) => {
      console.error('Event creation error:', error);
      toast.error("Error Creating Event", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  const onSubmit = (data: EventFormInputs) => {
    createEventMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create a New Community Event</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
          <Input id="eventName" {...register('eventName')} placeholder="e.g., Spring Park Cleanup" />
          {errors.eventName && <p className="text-xs text-red-600 mt-1">{errors.eventName.message}</p>}
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <Input id="category" {...register('category')} placeholder="e.g., Cleanup, Planting, Workshop" />
          {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea 
            id="description" 
            {...register('description')} 
            rows={4} 
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Detailed description of the event, what to bring, etc."
        />
        {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <Input id="date" type="date" {...register('date')} />
          {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date.message}</p>}
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <Input id="time" type="time" {...register('time')} />
          {errors.time && <p className="text-xs text-red-600 mt-1">{errors.time.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <Input id="location" {...register('location')} placeholder="e.g., Central Park, Main Street Entrance" />
        {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="requiredVolunteers" className="block text-sm font-medium text-gray-700 mb-1">Required Volunteers</label>
          <Input id="requiredVolunteers" type="number" {...register('requiredVolunteers')} />
          {errors.requiredVolunteers && <p className="text-xs text-red-600 mt-1">{errors.requiredVolunteers.message}</p>}
        </div>
        <div>
          <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-1">Event Image URL (Optional)</label>
          <Input id="photoUrl" {...register('photoUrl')} placeholder="https://example.com/image.jpg" />
          {errors.photoUrl && <p className="text-xs text-red-600 mt-1">{errors.photoUrl.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full py-2.5" disabled={isSubmitting || createEventMutation.isPending}>
        {isSubmitting || createEventMutation.isPending ? 'Creating Event...' : 'Create Event'}
      </Button>
    </form>
  );
};

export default EventCreationWizard;

