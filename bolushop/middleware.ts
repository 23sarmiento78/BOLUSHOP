import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // Redirect legacy category URLs to clean /categoria/[slug] routes
    if (pathname === '/productos') {
        const categoria = searchParams.get('categoria');
        const hasOtherFilters = searchParams.get('coleccion') || searchParams.get('seccion');
        if (categoria && !hasOtherFilters) {
            const url = request.nextUrl.clone();
            url.pathname = `/categoria/${encodeURIComponent(categoria)}`;
            url.search = '';
            return NextResponse.redirect(url, 301);
        }
    }

    // Only protect /admin routes
    if (pathname.startsWith('/admin')) {

        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        // Check for auth cookie
        const authCookie = request.cookies.get('admin_authenticated');

        if (!authCookie || authCookie.value !== 'true') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/productos'],
};
