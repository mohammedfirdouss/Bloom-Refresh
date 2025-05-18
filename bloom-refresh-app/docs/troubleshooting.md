# Troubleshooting & FAQ

## Common Issues

### 1. Tests Fail Locally
- Ensure you have run `npm install` and all dependencies are up to date.
- Check that your Node.js version matches `.nvmrc` or `package.json` engines.

### 2. API Calls Fail
- Check your `.env.local` for correct API URLs and credentials.
- Ensure the backend is running and accessible.

### 3. Image Uploads Fail
- Verify your S3 credentials in `.env.local`.
- Check network tab for error details.

### 4. E2E Tests Flaky
- Make sure the dev server is running before running Playwright tests.
- Increase timeouts if running on a slow machine.

## Why This Approach?
A living FAQ saves time for everyone and helps new team members get productive faster. 