# Event Management

## Overview
Event management is designed for clarity, extensibility, and real-world workflows. Organizers can create, edit, and delete events; admins can approve or reject them. Event images are uploaded to S3, and event status is tracked for lifecycle management.

## Key Files
- `src/app/events/create/page.tsx` — Event creation page
- `src/app/events/edit/[id]/page.tsx` — Event editing page
- `src/features/events/components/EventEditForm.tsx` — Reusable event form (handles image upload, status)
- `src/app/dashboard/organizer/page.tsx` — Organizer dashboard (edit/delete actions)
- `src/app/dashboard/admin/page.tsx` — Admin dashboard (event approval)
- `src/lib/mock-data.ts` — Mock event data for development

## Engineering Decisions
- **Separation of Concerns:**
  Event creation/editing is handled by a dedicated form component, making it easy to reuse and test.
- **Image Uploads:**
  S3 is used for image uploads because it is reliable, easy to integrate, and provides CDN delivery. The upload logic is isolated in the form for clarity.
- **Status Tracking:**
  Events have a `status` field (upcoming, ongoing, completed, pending, rejected) to support real-world workflows and admin approval.
- **Role-based Access:**
  Only organizers can edit/delete their events; only admins can approve/reject. This is enforced in both UI and API calls.

## Why This Approach?
As a developer, I want to make it easy for future engineers to extend event logic (e.g., add more statuses, workflows, or integrations). By isolating logic and using clear role checks, the codebase remains robust and easy to audit. 