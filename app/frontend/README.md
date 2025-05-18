# Bloom Refresh Frontend

This folder contains the frontend application for Bloom Refresh, built with Next.js (React + TypeScript) and styled using Tailwind CSS.

## Setup Instructions

1. **Prerequisites:**
   - Node.js (v14 or later)
   - npm or yarn

2. **Initialize the Next.js Project:**
   Run the following command in your terminal to create a new Next.js project with TypeScript and Tailwind CSS:

   ```bash
   npx create-next-app@latest bloom-refresh-frontend --typescript --tailwind
   ```

3. **Navigate to the Project Directory:**
   ```bash
   cd bloom-refresh-frontend
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Documentation

- **Project Structure:**
  - `/pages`: Contains the pages of the application.
  - `/components`: Reusable React components.
  - `/styles`: Global styles and Tailwind CSS configuration.
  - `/public`: Static assets like images and fonts.

- **Tailwind CSS:**
  - Tailwind CSS is configured for styling. Custom configurations can be found in `tailwind.config.js`.

- **TypeScript:**
  - TypeScript is used for type safety. Type definitions can be found in the respective component files.

- **API Integration:**
  - The frontend will interact with the backend API endpoints. Ensure the backend server is running for full functionality.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
