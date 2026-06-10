import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
        }

        const clientId = process.env.MELI_CLIENT_ID;
        const clientSecret = process.env.MELI_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Mercado Libre OAuth token endpoint
        const tokenResponse = await fetch('https://api.mercadolibre.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                redirect_uri: `${process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
            }),
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Meli token error:', errorText);
            return NextResponse.json({ error: 'Failed to obtain tokens from Mercado Libre' }, { status: 400 });
        }

        const tokenData = await tokenResponse.json();

        // Calculate expiration (tokens expire in 6 hours)
        const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();

        // Save to Supabase meli_auth table
        const { error: dbError } = await supabaseServer
            .from('meli_auth')
            .upsert({
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                expires_at: expiresAt,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });

        if (dbError) {
            console.error('Supabase save error:', dbError);
            return NextResponse.json({ error: 'Failed to save tokens' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Authentication successful',
            expires_at: expiresAt,
        });

    } catch (error: any) {
        console.error('Callback error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}