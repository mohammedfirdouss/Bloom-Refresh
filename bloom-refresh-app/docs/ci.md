# Continuous Integration (CI)

## Overview
CI is set up using GitHub Actions. Every push and pull request triggers linting, unit tests, and E2E tests. This ensures that only high-quality, working code is merged.

## Key Files
- `.github/workflows/frontend-ci.yml` — Main CI workflow
- `jest.config.js`, `jest.setup.js` — Unit test config
- `playwright.config.ts` — E2E test config

## Engineering Decisions
- **GitHub Actions:**
  Chosen for its tight integration with GitHub, ease of use, and free tier for open source. The workflow is simple and easy to extend.
- **Full Test Coverage:**
  Both unit and E2E tests run in CI, so regressions are caught at multiple levels.
- **Artifact Uploads:**
  Playwright reports are uploaded as artifacts for debugging failed runs.

## Why This Approach?
As a cloud engineer, I want to automate as much as possible. CI ensures that code is always in a deployable state, and that quality gates are enforced for every contributor. 