import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { getMeliAdminReturnUrl, getMeliRedirectUri, MELI_TOKEN_URL } from '@/lib/meli-oauth';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const oauthError = searchParams.get('error');
        if (oauthError) {
            const description = searchParams.get('error_description') || oauthError;
            return NextResponse.redirect(getMeliAdminReturnUrl({ error: description }));
        }

        const code = searchParams.get('code');
        if (!code) {
            return NextResponse.redirect(
                getMeliAdminReturnUrl({ error: 'No se recibió el código de autorización de Mercado Libre' })
            );
        }

        const clientId = process.env.MELI_CLIENT_ID;
        const clientSecret = process.env.MELI_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const redirectUri = getMeliRedirectUri();

        const tokenResponse = await fetch(MELI_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri,
            }),
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Meli token error:', errorText);
            return NextResponse.redirect(
                getMeliAdminReturnUrl({ error: 'Error al obtener tokens de Mercado Libre' })
            );
        }

        const tokenData = await tokenResponse.json();
        const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

        const { error: dbError } = await supabaseServer
            .from('meli_auth')
            .upsert({
                id: 1,
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                expires_at: expiresAt,
                user_id: tokenData.user_id ?? null,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });

        if (dbError) {
            console.error('Supabase save error:', dbError);
            return NextResponse.redirect(
                getMeliAdminReturnUrl({ error: 'Error al guardar tokens en la base de datos' })
            );
        }

        return NextResponse.redirect(getMeliAdminReturnUrl({ connected: 'true' }));

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        console.error('Callback error:', error);
        return NextResponse.redirect(getMeliAdminReturnUrl({ error: message }));
    }
}
