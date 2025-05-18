# Mock Data & Utilities

## Overview
Mock data is used for local development, testing, and Storybook. Utility functions are kept in `src/lib/` for easy reuse and clarity.

## Key Files
- `src/lib/mock-data.ts` — Featured events and sample data
- `src/lib/utils.ts` — Utility functions
- `src/lib/tokenRefresh.ts` — Token refresh logic

## Engineering Decisions
- **Mock Data for Dev/Test:**
  Using mock data allows for rapid UI development and reliable tests, even when the backend is unavailable or unstable.
- **Centralized Utilities:**
  All helpers are in one place, making them easy to find and update. This reduces duplication and bugs.

## Why This Approach?
As a developer, I want to minimize friction for myself and others. Mock data and utilities make onboarding, testing, and iteration much faster and more reliable. 