import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL no proporcionada' }, { status: 400 });
        }

        let finalUrl = url;
        let htmlText = '';

        // ML bloquea bots básicos, necesitamos enviar un User-Agent
        const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };

        // Si es un link acortado como meli.la, sigamos la redirección o descarguemos su HTML
        if (url.includes('meli.la')) {
            try {
                const expandRes = await fetch(url, { headers, redirect: 'follow' });
                finalUrl = expandRes.url;
                htmlText = await expandRes.text();
            } catch (e) {
                console.warn("Fallo al intentar expandir el link corto de ML:", e);
            }
        }

        // Buscar el ID primero en la URL
        let match = finalUrl.match(/MLA-?\d+/i);

        // Si no está en la URL pero tenemos el HTML de la redirección, buscar ahí
        if (!match && htmlText) {
            match = htmlText.match(/MLA-?\d+/i);
        }

        if (!match) {
            return NextResponse.json({ error: 'No se pudo detectar un ID válido de Mercado Libre en el link. Si usaste un link corto, asegúrate de que esté activo.' }, { status: 400 });
        }

        // Format code correctly for the ML API (without dash)
        const itemId = match[0].replace('-', '').toUpperCase();

        // Fetch from Mercado Libre PUBLIC API
        const mlResponse = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
        if (!mlResponse.ok) {
            return NextResponse.json({ error: 'No se pudo obtener información del producto desde Mercado Libre. Verifica que el link sea correcto y el producto esté activo.' }, { status: 400 });
        }

        const mlData = await mlResponse.json();

        if (!mlData || !mlData.title) {
            return NextResponse.json({ error: 'Datos incompletos.' }, { status: 400 });
        }

        // Extract key info
        const result = {
            id: mlData.id,
            title: mlData.title,
            price: mlData.price,
            currency: mlData.currency_id,
            condition: mlData.condition,
            pictures: mlData.pictures.map((p: any) => p.secure_url || p.url), // Returns array of max-res URLs
            permalink: mlData.permalink, // Original link (just for reference)
            domainId: mlData.domain_id,
        };

        return NextResponse.json({ success: true, data: result });
    } catch (e: any) {
        console.error('Error fetching ML data:', e);
        return NextResponse.json({ error: 'Error interno del servidor intentando conectar con ML' }, { status: 500 });
    }
}
