# Testing & Quality

## Overview
Testing is a first-class concern in this project. We use Jest and React Testing Library for unit/component tests, and Playwright for end-to-end (E2E) tests. This ensures both logic and user flows are robust, and that regressions are caught early.

## Key Files
- `src/features/events/components/__tests__/EventEditForm.test.tsx` — Example unit test for event form
- `e2e/event-creation.spec.ts` — Example E2E test for event creation
- `jest.config.js`, `jest.setup.js` — Jest configuration and setup
- `playwright.config.ts` — Playwright configuration

## Engineering Decisions
- **Jest + React Testing Library:**
  Chosen for their popularity, speed, and excellent support for React. Tests are colocated with components for discoverability.
- **Playwright for E2E:**
  Playwright is reliable, fast, and supports multiple browsers. E2E tests are placed in the `e2e/` folder and run in CI.
- **Mocking & Isolation:**
  Mocks are used for navigation, API, and image upload to ensure tests are deterministic and fast.
- **CI Integration:**
  All tests run on every push/PR via GitHub Actions, ensuring code quality is enforced automatically.

## Why This Approach?
As a cloud engineer, I want to catch issues before they reach production. Automated tests and CI are the best way to guarantee reliability, especially as the team or codebase grows. 