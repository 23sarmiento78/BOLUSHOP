
const headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'Accept-Language': 'es-AR,es;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
};

const url = 'https://meli.la/1ehxTY6';

async function test() {
    try {
        console.log('--- Analizando URL:', url);
        const expandRes = await fetch(url, { headers, redirect: 'follow' });
        const finalUrl = expandRes.url;
        const htmlText = await expandRes.text();

        const fs = require('fs');
        fs.writeFileSync('debug_ml.html', htmlText);
        console.log('HTML guardado en debug_ml.html');

        // PRECIO - Método C: Scraper de Clases CSS
        const fractionMatches = htmlText.match(/andes-money-amount__fraction">([^<]+)<\/span>/gi);
        console.log('Fraction Matches Encontrados:', fractionMatches);

        if (fractionMatches && fractionMatches.length > 0) {
            const firstPrice = fractionMatches[0].match(/>([^<]+)</);
            console.log('Match del primer precio:', firstPrice);
        }

        // JSON-LD
        const jsonLdMatch = htmlText.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
        if (jsonLdMatch) {
            console.log('JSON-LD encontrado (primeros 200 chars):', jsonLdMatch[1].slice(0, 200));
        } else {
            console.log('JSON-LD NO ENCONTRADO');
        }

        const priceMeta = htmlText.match(/<meta\s+itemprop="price"\s+content="([\d.]+)"/i);
        console.log('Price Meta Match:', priceMeta);

    } catch (e) {
        console.error('Error:', e);
    }
}

test();
