import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/callback',
  '/auth/verify-email',
  '/auth/reset-password',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Add security headers
  const headers = res.headers;
  headers.set('X-DNS-Prefetch-Control', 'on');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Different CSP for development and production
  if (process.env.NODE_ENV === 'development') {
    headers.set(
      'Content-Security-Policy',
      `default-src 'self'; ` +
        `script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; ` +
        `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ` +
        `img-src 'self' data: https: blob:; ` +
        `font-src 'self' https://fonts.gstatic.com; ` +
        `connect-src 'self' https://*.supabase.co wss://*.supabase.co http://localhost:* ws://localhost:*; ` +
        `frame-ancestors 'none'; ` +
        `form-action 'self';`
    );
  } else {
    headers.set(
      'Content-Security-Policy',
      `default-src 'self'; ` +
        `script-src 'self' 'unsafe-inline' https:; ` +
        `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ` +
        `img-src 'self' data: https:; ` +
        `font-src 'self' https://fonts.gstatic.com; ` +
        `connect-src 'self' https://*.supabase.co wss://*.supabase.co; ` +
        `frame-ancestors 'none'; ` +
        `form-action 'self';`
    );
  }

  try {
    // Refresh session if it exists
    const { data: { session } } = await supabase.auth.getSession();

    // Get the current URL
    const url = new URL(req.url);
    const path = url.pathname;

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

    // If accessing a protected route without a session
    if (!isPublicRoute && !session) {
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('next', path);
      return NextResponse.redirect(redirectUrl);
    }

    // If accessing auth routes with a session
    if (session && (path === '/auth/login' || path === '/')) {
      // Get the intended destination
      const redirectTo = url.searchParams.get('next') || '/dashboard';
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    return res;
  } catch (error) {
    // If there's an error checking the session, redirect to login
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
