import React from "react";

// Dummy data for now
const events = [
  { id: "1", title: "Park Cleanup", date: "2024-07-01" },
  { id: "2", title: "Beach Sweep", date: "2024-07-10" },
];

export const EventsList: React.FC = () => (
  <ul>
    {events.map(event => (
      <li key={event.id}>
        <strong>{event.title}</strong> — {event.date}
      </li>
    ))}
  </ul>
);
