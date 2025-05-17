'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient from '@/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Define the schema for event creation form validation
const eventSchema = yup.object().shape({
  eventName: yup.string().required('Event name is required').min(3, 'Event name must be at least 3 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  date: yup.string().required('Date is required').matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Date must be in YYYY-MM-DD format'),
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

type Step = 1 | 2 | 3;

const DEFAULT_CENTER: [number, number] = [34.0522, -118.2437]; // Los Angeles as default

const EventCreationWizard = () => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>(1);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
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
    },
  });

  const createEventMutation = useMutation({
    mutationFn: (newEvent: any) => {
      return apiClient.createEvent(newEvent);
    },
    onSuccess: (data) => {
      toast.success('Event Created!', {
        description: `Successfully created event: ${data.name || data.eventName}`,
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      reset();
      setStep(1);
      setSelectedCoords(null);
    },
    onError: (error: any) => {
      console.error('Event creation error:', error);
      toast.error('Error Creating Event', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });

  const onSubmit = (data: EventFormInputs) => {
    if (!selectedCoords) {
      toast.error('Please select a location on the map.');
      setStep(2);
      return;
    }
    createEventMutation.mutate({
      ...data,
      mapCoordinates: { lat: selectedCoords[0], lng: selectedCoords[1] },
    });
  };

  // Step 1: Basic Info
  const renderStep1 = () => (
    <div className="space-y-6">
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
      <div className="flex justify-end gap-2">
        <Button type="button" onClick={() => setStep(2)}>
          Next: Location
        </Button>
      </div>
    </div>
  );

  // Step 2: Location Selection
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location Description</label>
        <Input id="location" {...register('location')} placeholder="e.g., Central Park, Main Street Entrance" />
        {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Location on Map</label>
        {!selectedCoords && <p className="text-xs text-red-600 mt-2">Click on the map to select a location.</p>}
      </div>
      <div className="flex justify-between gap-2">
        <Button type="button" variant="secondary" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button type="button" onClick={() => setStep(3)} disabled={!selectedCoords}>
          Next: Review
        </Button>
      </div>
    </div>
  );

  // Step 3: Review & Submit
  const renderStep3 = () => {
    const values = getValues();
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-2">Review Event Details</h3>
        <ul className="space-y-2">
          <li><b>Name:</b> {values.eventName}</li>
          <li><b>Description:</b> {values.description}</li>
          <li><b>Date:</b> {values.date}</li>
          <li><b>Time:</b> {values.time}</li>
          <li><b>Category:</b> {values.category}</li>
          <li><b>Required Volunteers:</b> {values.requiredVolunteers}</li>
          <li><b>Location:</b> {values.location}</li>
          <li><b>Coordinates:</b> {selectedCoords ? `${selectedCoords[0]}, ${selectedCoords[1]}` : 'Not selected'}</li>
          {values.photoUrl && <li><b>Image:</b> <a href={values.photoUrl} target="_blank" rel="noopener noreferrer">{values.photoUrl}</a></li>}
        </ul>
        <div className="flex justify-between gap-2">
          <Button type="button" variant="secondary" onClick={() => setStep(2)}>
            Back
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting || createEventMutation.isPending}>
            {isSubmitting || createEventMutation.isPending ? 'Creating Event...' : 'Create Event'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <form className="space-y-6 p-6 bg-white rounded-lg shadow-xl" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create a New Community Event</h2>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </form>
  );
};

export default EventCreationWizard;

