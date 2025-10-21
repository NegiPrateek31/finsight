// negiprateek31/finsight/finsight-1382f5b01244365c9a92f06365cf1e52dc019117/src/middleware.ts

import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

// Protected paths configuration (no longer used in middleware, but kept for reference)
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
  // const { pathname } = req.nextUrl; // Original code path is removed
  // const isAuthPage = pathname.startsWith('/auth'); // Original code path is removed

  // Original check for isAuthPage is redundant if matcher is correct.
  // if (isAuthPage) {
  //   return null;
  // }
  
  // withAuth handles the core authentication logic.
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
     * FIX: The previous matcher was including /auth/signin.
     * We need to explicitly exclude /auth/ and related files.
     * The regex below matches everything EXCEPT paths that begin with:
     * 1. /api/auth (NextAuth API routes)
     * 2. /auth (Sign in/Sign up pages) <-- ADDED EXCLUSION
     * 3. /_next/* (Next.js internals)
     * 4. /_static (static files)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api/auth|auth|_next|_static|_vercel|favicon.ico|sitemap.xml).*)',
  ],
}