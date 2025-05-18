# Versioning & Release Process

## Versioning
- Follows [Semantic Versioning](https://semver.org/): MAJOR.MINOR.PATCH
- All releases are tagged in Git.

## Release Steps
1. Ensure all tests and CI pass.
2. Update the version in `package.json`.
3. Add a changelog entry describing the release.
4. Tag the release in Git and push to `main`.
5. Deploy via Vercel or your chosen platform.

## Why This Approach?
Semantic versioning and clear release steps make it easy to track changes, roll back if needed, and communicate updates to stakeholders. 