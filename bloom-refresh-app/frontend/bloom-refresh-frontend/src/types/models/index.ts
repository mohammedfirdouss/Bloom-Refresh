// For domain models (e.g., Event, User)

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'volunteer' | 'organizer';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizerId: string;
}