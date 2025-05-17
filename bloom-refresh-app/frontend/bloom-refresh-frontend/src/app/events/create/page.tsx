
import EventCreationWizard from "@/features/events/components/EventCreationWizard";
import React from "react";

const CreateEventPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Event</h1>
      <div className="max-w-2xl mx-auto">
        <EventCreationWizard />
      </div>
    </div>
  );
};

export default CreateEventPage;

