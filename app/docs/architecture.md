# Architecture & Patterns

## Overview
The frontend is built with Next.js (App Router), Chakra UI, Zustand, and React Query. The codebase is modular, with a clear separation between features, UI components, state, and utilities.

## Key Patterns
- **App Directory Routing:** All routes and layouts are defined in `src/app/`, following Next.js best practices.
- **Feature Modules:** Each domain (events, users, etc.) has its own folder in `src/features/` for logic and UI.
- **State Management:** Zustand is used for global state (auth, filters), React Query for async data.
- **API Layer:** All API calls are centralized in `src/lib/` for maintainability and testability.
- **Testing:** Unit and E2E tests are colocated with the code they test.

## Why This Approach?
This structure makes it easy to onboard new engineers, scale the codebase, and maintain a high level of code quality. Each concern is isolated, and the use of modern React/Next.js patterns ensures long-term maintainability. 