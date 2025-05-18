# Authentication & Profile

## Overview
Authentication is handled using a combination of Next.js pages, Zustand for state management, and secure session handling. The approach prioritizes security (httpOnly cookies for JWTs), user experience (clear flows for login, signup, password reset, and email verification), and maintainability.

## Key Files
- `src/app/auth/login/page.tsx` — Login page
- `src/app/auth/signup/page.tsx` — Signup page (with email verification)
- `src/app/auth/forgot-password/page.tsx` — Request password reset
- `src/app/auth/reset-password/page.tsx` — Set new password
- `src/app/auth/verify-email/page.tsx` — Email verification
- `src/app/dashboard/profile/page.tsx` — User profile page
- `src/stores/auth/store.ts` — Zustand store for auth state

## Engineering Decisions
- **Zustand for Auth State:**
  Zustand is lightweight and easy to persist, making it ideal for managing user state (logged in/out, user info) without the boilerplate of Redux.
- **httpOnly Cookies for JWT:**
  Storing JWTs in httpOnly cookies (set by the backend) prevents XSS attacks and is the industry standard for session security. The frontend never directly accesses the token.
- **Separation of Flows:**
  Each auth flow (login, signup, reset, verify) is a separate page/component, making the codebase modular and easy to test.
- **Profile Management:**
  The profile page allows users to view and update their info. This is separated from the dashboard for clarity and future extensibility.

## Why This Approach?
As a cloud engineer, I value security and clarity. Using httpOnly cookies and modular flows ensures the app is both safe and easy to maintain. Zustand keeps global state simple, and Next.js routing keeps flows clear and testable. 