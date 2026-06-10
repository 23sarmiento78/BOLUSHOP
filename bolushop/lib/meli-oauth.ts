export const MELI_TOKEN_URL = 'https://api.mercadolibre.com/oauth/token';
export const MELI_AUTH_URL = 'https://auth.mercadolibre.com.ar/authorization';

function getSiteBaseUrl(): string {
    return (
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        'https://bolushop.com'
    ).replace(/\/$/, '');
}

export function getMeliRedirectUri(): string {
    if (process.env.MELI_REDIRECT_URI) {
        return process.env.MELI_REDIRECT_URI;
    }
    return `${getSiteBaseUrl()}/api/auth/callback`;
}

export function getMeliAdminReturnUrl(query?: Record<string, string>): string {
    const url = new URL('/admin/mercado-libre', getSiteBaseUrl());
    if (query) {
        Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));
    }
    return url.toString();
}

export function buildMeliAuthorizationUrl(): string {
    const clientId = process.env.NEXT_PUBLIC_MELI_CLIENT_ID;
    if (!clientId) return '';

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: getMeliRedirectUri(),
    });

    return `${MELI_AUTH_URL}?${params.toString()}`;
}
