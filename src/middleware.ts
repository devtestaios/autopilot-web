import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/simple-login',
  '/signup',
  '/auth/callback',
  '/auth/meta/callback',
  '/auth/instagram/callback',
  '/pricing',
  '/enterprise-contact',
  '/home',
  '/landing',
  '/api/auth',
  '/adminlogin',
];

// Define routes that require admin access
const ADMIN_ROUTES = [
  '/admin',
  '/adminlogin',
];

// Define protected routes (require authentication)
const PROTECTED_ROUTES = [
  '/dashboard',
  '/campaigns',
  '/performance',
  '/reports',
  '/ai',
  '/analytics',
  '/settings',
  '/platforms',
  '/marketing',
  '/leads',
  '/content-suite',
  '/predictive-analytics',
  '/recommendation-engine',
  '/performance-advisor',
  '/onboarding',
  '/social-media',
  '/email-marketing',
  '/automation',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return res;
  }

  // Check if route is admin route
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));

  // Everything else requires authentication (default protected)
  const isProtectedRoute = !PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));

  // Admin routes require authentication AND admin role
  if (isAdminRoute) {
    // Admin routes use separate authentication system via /adminlogin
    // Redirect to /adminlogin if accessing /admin without auth
    if (pathname.startsWith('/admin') && !session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/adminlogin';
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If accessing /adminlogin, allow it (no further checks)
    if (pathname.startsWith('/adminlogin')) {
      return res;
    }

    // For /admin route with session, check role
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      // Only allow super_admin, admin, or agency_owner
      if (!profile || !['super_admin', 'admin', 'agency_owner'].includes(profile.role)) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to dashboard if accessing login while authenticated
  if ((pathname === '/login' || pathname === '/simple-login' || pathname === '/signup') && session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that handle their own auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
