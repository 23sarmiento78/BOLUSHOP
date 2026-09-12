import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-auth';

export async function middleware(request: NextRequest) {
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

    // Protect both admin pages and admin API routes with the same signed session.
    const isAdminPage = pathname.startsWith('/admin');
    const isAdminApi = pathname.startsWith('/api/admin');
    if (isAdminPage || isAdminApi) {
        if (pathname === '/admin/login') return NextResponse.next();

        const valid = await verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
        if (!valid) {
            if (isAdminApi) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*', '/productos'],
};
