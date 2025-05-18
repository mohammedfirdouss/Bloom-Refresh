# Bloom Refresh Frontend Documentation

This documentation covers the architecture, features, engineering decisions, and practical guides for the `bloom-refresh-frontend` project. It is written for developers, cloud engineers, and contributors who want to understand, extend, or operate the codebase.

## Structure

- `src/app/` — Next.js app directory (routing, pages, layouts)
- `src/features/` — Feature modules (events, users, etc.)
- `src/components/` — Shared UI/layout components
- `src/stores/` — Zustand state management
- `src/lib/` — Utilities, mock data, and API helpers
- `e2e/` — Playwright end-to-end tests
- `.github/workflows/` — CI configuration

## Documentation Index

- [Architecture & Patterns](./architecture.md): High-level structure, patterns, and rationale
- [Local Development & Environment](./environment.md): Setup, environment variables, and local dev tips
- [Deployment & Hosting](./deployment.md): How to deploy and recommended platforms
- [Accessibility & Theming](./accessibility-theming.md): Accessibility and theming practices
- [Authentication & Profile](./auth.md): Auth flows, state, and security
- [Event Management](./events.md): Event CRUD, approval, and image upload
- [API Integration & Data Flow](./api-integration.md): API patterns and data handling
- [Mock Data & Utilities](./mock-data.md): Using and extending mock data/utilities
- [Testing & Quality](./testing.md): Unit/E2E testing, coverage, and CI
- [Continuous Integration](./ci.md): GitHub Actions and automation
- [Contributing](./contributing.md): How to contribute, code style, and PR process
- [Troubleshooting & FAQ](./troubleshooting.md): Common issues and solutions
- [Versioning & Release Process](./versioning-release.md): Release workflow and semantic versioning

Each section references the relevant files and explains the engineering rationale behind the implementation choices. Use this as your entry point for any technical or operational question about the frontend. 