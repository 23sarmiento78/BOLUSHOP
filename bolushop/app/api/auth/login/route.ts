import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, SESSION_TTL_SECONDS, createAdminSession } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD && ADMIN_EMAIL && ADMIN_PASSWORD) {
            const response = NextResponse.json({ success: true });
            const session = await createAdminSession(email);

            response.cookies.set(ADMIN_SESSION_COOKIE, session, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: SESSION_TTL_SECONDS,
                path: '/',
            });
            // Invalidate the legacy forgeable cookie if it exists.
            response.cookies.delete('admin_authenticated');

            return response;
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
