import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');

    if (!url) {
        return new NextResponse('URL is required', { status: 400 });
    }

    try {
        // Fetch con headers de navegador para evitar bloqueos anti-hotlink (ej: Dropers)
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
                'Referer': 'https://bolushop.com/',
            }
        });

        if (!response.ok) {
            console.error(`[proxy-image] Error fetching ${url}: ${response.status}`);
            return new NextResponse('Error fetching image', { status: response.status });
        }

        const buffer = await response.arrayBuffer();

        // Forzar content-type como imagen si la respuesta es ambigua
        let contentType = response.headers.get('content-type') || 'image/jpeg';
        if (!contentType.startsWith('image/')) {
            contentType = 'image/jpeg'; // fallback seguro
        }

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600', // 1 hora de caché (temporal)
                'Access-Control-Allow-Origin': '*', // CORS abierto para que Meta pueda acceder
            },
        });
    } catch (error) {
        console.error('[proxy-image] Unexpected error:', error);
        return new NextResponse('Error fetching image', { status: 500 });
    }
}
