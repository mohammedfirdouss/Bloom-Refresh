import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/events/create',
  '/profile',
  '/reports',
];

 // Import configuration from external file
 import { PROTECTED_PATHS, AUTH_PATHS } from '@/config/routes';



export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-storage')?.value;
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtectedPath = PROTECTED_PATHS.some((path: string) => pathname.startsWith(path));
  const isAuthPath = AUTH_PATHS.some((path: string) => pathname.startsWith(path));

  // If path is protected and no token exists, redirect to login
  if (isProtectedPath && !token) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 