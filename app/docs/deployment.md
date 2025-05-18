# Deployment & Hosting

## Recommended Approach
- **Vercel:** The project is optimized for Vercel, which provides zero-config Next.js hosting, preview deployments, and easy environment variable management.
- **Other Options:** Can also be deployed to AWS Amplify, Netlify, or any Node.js-compatible host.

## Steps
1. Push to the `main` branch (or open a PR).
2. Vercel (or your CI/CD) will build and deploy automatically.
3. Set environment variables in the Vercel dashboard or your host.

## Why This Approach?
Vercel is the default for Next.js and provides the best DX, but the codebase is portable to any modern cloud provider. 