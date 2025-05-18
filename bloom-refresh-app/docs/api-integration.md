# API Integration & Data Flow

## Overview
All API calls are centralized in `src/lib/` and use fetch or a lightweight client. React Query is used for caching and async state.

## Key Patterns
- **Centralized API Logic:** All endpoints are defined in one place for maintainability.
- **React Query:** Handles caching, loading, and error states.
- **Error Handling:** All errors are surfaced to the user via toasts or error boundaries.

## Example
```ts
// src/lib/api.ts
export async function getEvents() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}
```

## Why This Approach?
Centralizing API logic and using React Query reduces bugs, makes testing easier, and keeps UI code clean. 