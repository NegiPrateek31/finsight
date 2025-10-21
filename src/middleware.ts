/* eslint-disable no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

// Protected paths configuration
const PROTECTED_PATHS = {
  api: [
    '/api/posts',
    '/api/notifications',
    '/api/analytics',
    '/api/admin',
    '/api/upload'
  ],
  admin: ['/admin'],
  moderator: ['/reports', '/moderation']
}

// Function to check if path starts with any of the given prefixes
const pathStartsWith = (path: string, prefixes: string[]): boolean => {
  return prefixes.some(prefix => path.startsWith(prefix))
}

const middlewareHandler = async (req: NextRequest) => {
  // Debug: log cookies and nextauth token for troubleshooting
  if (process.env.NODE_ENV === 'development') {
    console.log('[middleware] cookie header:', req.headers.get('cookie'));
    console.log('[middleware] nextauth token:', (req as any).nextauth?.token);
  }
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname.startsWith('/auth');

  // Only redirect to home if already authenticated and on auth page
  if (isAuthPage) {
    return null;
  }

  // Require auth for landing page
  // withAuth will handle redirect if not authenticated

  // Check if the path needs authentication
  // withAuth will handle protected routes

  // Handle admin routes
  // If you need role-based access, check session in API route, not here

  // Handle moderator routes
  // If you need role-based access, check session in API route, not here

  // Handle API routes
  // If you need user info, get it from session in API route

  return NextResponse.next()
  return NextResponse.next();
}

// Wrap the middleware with withAuth to populate req.nextauth.token
export default withAuth(middlewareHandler, {
  callbacks: {
    authorized: ({ token }) => {
      // Allow requests if token exists
      return !!token
    },
  },
})

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api/auth/* (auth endpoints)
     * 2. /_next/* (Next.js internals)
     * 3. /_static (static files)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api/auth|_next|_static|_vercel|favicon.ico|sitemap.xml).*)',
  ],
}