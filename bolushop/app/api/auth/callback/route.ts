import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

const MELI_REDIRECT_URI = 'https://bolushop.com/api/auth/callback';
const MELI_TOKEN_URL = 'https://api.mercadolibre.com/oauth/token';
const SUCCESS_REDIRECT = 'https://bolushop.com/admin';

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

        const tokenResponse = await fetch(MELI_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                redirect_uri: MELI_REDIRECT_URI,
            }),
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Meli token error:', errorText);
            return NextResponse.json({ error: 'Failed to obtain tokens from Mercado Libre', details: errorText }, { status: 500 });
        }

        const tokenData = await tokenResponse.json();

        const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

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
            return NextResponse.json({ error: 'Failed to save tokens', details: dbError.message }, { status: 500 });
        }

        return NextResponse.redirect(SUCCESS_REDIRECT);

    } catch (error: any) {
        console.error('Callback error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
