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
                const altMatch = htmlText.match(/"product_id":"(MLA\d+)"/i) || htmlText.match(/MLA-?\d+/i);
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
            // Los patrones suelen ser D_NQ_NP_...-O.webp o -F.webp
            const imgRegex = /https:\/\/http2\.mlstatic\.com\/D_NQ_NP_[0-9A-Z_-]+-(?:O|F)\.webp/gi;
            const foundImgs = Array.from(new Set(htmlText.match(imgRegex) || []));

            if (foundImgs.length > 0) {
                pictures = foundImgs.slice(0, 10); // Límite de 10 imágenes
                image = pictures[0];
            } else {
                // Fallback a OpenGraph si el regex de galería falla
                const ogImg = htmlText.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
                if (ogImg) {
                    image = ogImg[1];
                    pictures = [image];
                }
            }

            // 3. Extraer Precio (Probamos varios métodos por orden de confiabilidad)
            // Método A: JSON-LD (Schema.org)
            const jsonLdMatch = htmlText.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
            if (jsonLdMatch) {
                try {
                    const json = JSON.parse(jsonLdMatch[1]);
                    // Puede venir como un objeto directo o un array con el producto
                    const productObj = Array.isArray(json) ? json.find(i => i['@type'] === 'Product') : (json['@type'] === 'Product' ? json : null);
                    if (productObj?.offers?.price) {
                        price = parseFloat(productObj.offers.price);
                    }
                } catch (e) { }
            }

            // Método B: Meta itemprop (Muy común)
            if (price === 0) {
                const priceMeta = htmlText.match(/<meta\s+itemprop="price"\s+content="([\d.]+)"/i);
                if (priceMeta) price = parseFloat(priceMeta[1]);
            }

            // Método C: Scraper de Clases CSS (Fallback final)
            if (price === 0) {
                const fractionMatch = htmlText.match(/andes-money-amount__fraction">([^<]+)<\/span>/i);
                if (fractionMatch) {
                    price = parseFloat(fractionMatch[1].replace(/\./g, '').replace(/,/g, '.'));
                }
            }

            // 4. Condición (Nuevo o Usado)
            if (htmlText.includes('item-condition="used"') || htmlText.includes('>Usado<')) {
                isNew = 'used';
            }

        } catch (e) {
            console.error("Error scrapeando HTML de ML:", e);
        }

        // Si falló el Scraper o no sacó el título, hagamos fallback a la API (aunque podría dar 403)
        if (!title || !image) {
            try {
                const mlResponse = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
                if (mlResponse.ok) {
                    const mlData = await mlResponse.json();
                    title = mlData.title;
                    image = mlData.pictures[0]?.secure_url || mlData.pictures[0]?.url;
                    pictures = mlData.pictures.map((p: any) => p.secure_url || p.url);
                    price = mlData.price;
                    isNew = mlData.condition;
                }
            } catch (e) { }
        }

        if (!title) {
            return NextResponse.json({ error: 'Las capas de seguridad de Mercado Libre impidieron leer el producto. Intenta abrir el link, copiarlo tal cual de tu navegador y pegarlo nuevamente.' }, { status: 400 });
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
