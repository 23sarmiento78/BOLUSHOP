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

        // Emulate a standard mobile browser so ML sends us the standard HTML quickly without blocking
        const headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'Accept-Language': 'es-AR,es;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
        };

        // Si es un link acortado como meli.la, sigamos la redirección
        if (url.includes('meli.la')) {
            try {
                const expandRes = await fetch(url, { headers, redirect: 'follow' });
                finalUrl = expandRes.url;
                htmlText = await expandRes.text();
            } catch (e) {
                console.warn("Fallo al expandir link corto");
            }
        }

        // Buscar el ID primero en la URL
        let match = finalUrl.match(/MLA-?\d+/i);

        // Si no está en la URL (pasa con algunos shortlinks), buscar en la etiqueta oficial og:url
        if (!match && htmlText) {
            const ogUrl = htmlText.match(/<meta\s+property="og:url"\s+content="([^"]+)"/i);
            if (ogUrl) {
                match = ogUrl[1].match(/MLA-?\d+/i);
            }
            // Si seguimos sin suerte, usamos el site_name que a veces lleva el ID
            if (!match) {
                // Caso catálogo o producto_id en el script o ID en metadatos de landing
                const altMatch =
                    htmlText.match(/"product_id":"(MLA\d+)"/i) ||
                    htmlText.match(/"id":"(MLA\d+)"/i) ||
                    htmlText.match(/MLA-?\d+/i);
                match = altMatch;
            }
        }

        if (!match) {
            return NextResponse.json({ error: 'No se pudo detectar un ID válido de ML en el link. Intenta usar el link largo de computadora.' }, { status: 400 });
        }

        const itemId = match[0].replace('-', '').toUpperCase();

        // SCRAPER MODE: Intentamos descargar la página pública y leer las etiquetas META (Evita Bloqueos 403)
        let title = '';
        let image = '';
        let pictures: string[] = [];
        let price = 0;
        let isNew = 'new';

        try {
            // Si no descargamos HTML en el paso del acortador, descarguemos ahora
            if (!htmlText) {
                const pageRes = await fetch(finalUrl, { headers });
                htmlText = await pageRes.text();
            }

            // 1. Extraer Título (OpenGraph es lo más confiable)
            const titleMatch = htmlText.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
            if (titleMatch) title = titleMatch[1].replace(/ - Envío gratis|\$ [\d.]+/gi, '').split('|')[0].trim();

            // 2. Extraer Imágenes (Buscamos todas las imágenes de alta calidad del CDN de ML)
            // Patrones: D_NQ_NP_...-O.webp, -O.jpg, -F.webp, -F.jpg
            const imgRegex = /https:\/\/http2\.mlstatic\.com\/D_NQ_NP_[0-9A-Z_-]+-(?:O|F)\.(?:webp|jpg)/gi;
            const foundImgs = Array.from(new Set(htmlText.match(imgRegex) || []));

            if (foundImgs.length > 0) {
                // Priorizar las mejores calidades y limpiar URLs duplicadas
                pictures = foundImgs.slice(0, 10);
                image = pictures[0];
            } else {
                // Fallback a OpenGraph
                const ogImg = htmlText.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
                if (ogImg) {
                    image = ogImg[1];
                    pictures = [image];
                }
            }

            // 3. Extraer Precio (Lógica de prioridad: JSON-LD > Meta Itemprop > CSS Class)

            // Método A: JSON-LD (Schema.org) - Es lo que usa Google para ver precios de oferta
            const jsonLdMatch = htmlText.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
            if (jsonLdMatch) {
                try {
                    const json = JSON.parse(jsonLdMatch[1]);
                    const productObj = Array.isArray(json) ? json.find(i => i['@type'] === 'Product') : (json['@type'] === 'Product' ? json : null);
                    if (productObj?.offers?.price) {
                        price = parseFloat(productObj.offers.price);
                    }
                } catch (e) { }
            }

            // Método B: Meta itemprop (Muy común en ML)
            if (price === 0) {
                const priceMeta = htmlText.match(/<meta\s+itemprop="price"\s+content="([\d.]+)"/i);
                if (priceMeta) price = parseFloat(priceMeta[1]);
            }

            // Método C: Scraper de Clases CSS (Fallback final para ofertas dinámicas)
            if (price === 0) {
                // Buscamos la clase fraction que contiene el número grande
                const fractionMatches = htmlText.match(/andes-money-amount__fraction">([^<]+)<\/span>/gi);
                if (fractionMatches && fractionMatches.length > 0) {
                    // Tomamos el primero que suele ser el precio actual (el más grande arriba)
                    const firstPrice = fractionMatches[0].match(/>([^<]+)</);
                    if (firstPrice) {
                        price = parseFloat(firstPrice[1].replace(/\./g, '').replace(/,/g, '.'));
                    }
                }
            }

            // Método D: Búsqueda en JSON de Landing Pages de Afiliados (Caso meli.la)
            if (price === 0) {
                const landingPriceMatch = htmlText.match(/\"current_price\":\{\"value\":(\d+)/i);
                if (landingPriceMatch) {
                    price = parseFloat(landingPriceMatch[1]);
                }
            }

            // 4. Condición
            if (htmlText.includes('item-condition="used"') || htmlText.includes('>Usado<')) {
                isNew = 'used';
            }

        } catch (e) {
            console.error("Error scrapeando HTML de ML:", e);
        }

        // Si falló el Scraper o no sacó el título, hagamos fallback a la API pública
        if (!title || !image || price === 0) {
            try {
                const mlResponse = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
                if (mlResponse.ok) {
                    const mlData = await mlResponse.json();
                    if (!title) title = mlData.title;
                    if (!image) image = mlData.pictures[0]?.secure_url || mlData.pictures[0]?.url;
                    if (pictures.length === 0) pictures = mlData.pictures.map((p: any) => p.secure_url || p.url);
                    if (price === 0) price = mlData.price;
                    isNew = mlData.condition;
                }
            } catch (e) { }
        }

        if (!title) {
            return NextResponse.json({ error: 'Las capas de seguridad de Mercado Libre impidieron leer el producto. Intenta con el link largo de computadora.' }, { status: 400 });
        }

        const result = {
            id: itemId,
            title: title || 'Producto Importado',
            price: price || 0,
            currency: 'ARS',
            condition: isNew,
            pictures: pictures.length > 0 ? pictures : [image],
            permalink: finalUrl
        };

        return NextResponse.json({ success: true, data: result });
    } catch (e: any) {
        console.error('Error fetching ML data:', e);
        return NextResponse.json({ error: 'Error interno conectando con ML' }, { status: 500 });
    }
}
