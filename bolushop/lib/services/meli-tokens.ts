import { supabaseServer } from '@/lib/supabase-server';
import { MELI_TOKEN_URL } from '@/lib/meli-oauth';

interface MeliAuthRow {
    id: number;
    access_token: string;
    refresh_token: string | null;
    expires_at: string;
}

async function refreshMeliToken(row: MeliAuthRow): Promise<string> {
    if (!row.refresh_token) {
        throw new Error('No hay refresh_token. Reconectá Mercado Libre en el admin.');
    }

    const clientId = process.env.MELI_CLIENT_ID;
    const clientSecret = process.env.MELI_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        throw new Error('Faltan credenciales MELI_CLIENT_ID / MELI_CLIENT_SECRET');
    }

    const response = await fetch(MELI_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: row.refresh_token,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al renovar token de Meli: ${errorText}`);
    }

    const tokenData = await response.json();
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

    const updateRow: Record<string, string> = {
        access_token: tokenData.access_token,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
    };
    if (tokenData.refresh_token) {
        updateRow.refresh_token = tokenData.refresh_token;
    }

    await supabaseServer.from('meli_auth').update(updateRow).eq('id', row.id);

    return tokenData.access_token;
}

export async function getMeliAccessToken(): Promise<string> {
    const { data, error } = await supabaseServer
        .from('meli_auth')
        .select('id, access_token, refresh_token, expires_at')
        .limit(1)
        .maybeSingle();

    if (error || !data) {
        throw new Error('No hay tokens de Mercado Libre. Conectá tu cuenta en Admin → Mercado Libre.');
    }

    const expiresAt = new Date(data.expires_at).getTime();
    const bufferMs = 5 * 60 * 1000;

    if (Date.now() >= expiresAt - bufferMs) {
        return refreshMeliToken(data as MeliAuthRow);
    }

    return data.access_token;
}
