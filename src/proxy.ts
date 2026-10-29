import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'fireworks_admin_session';

// Next.js 16+: renamed from `middleware` → `proxy`
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes (except login page and API login endpoint)
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/api/admin/login')
  ) {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      // No session cookie → redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Basic validation: try to decode the base64 token
    try {
      const json = Buffer.from(sessionCookie, 'base64').toString('utf-8');
      const data = JSON.parse(json);
      if (data?.role !== 'administrator') {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only run proxy on admin routes (excluding API routes which handle their own auth)
  matcher: ['/admin/:path*'],
};
