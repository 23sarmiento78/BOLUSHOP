const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' };
const slug = 'metegol-de-madera-y-metal';
const name = 'Metegol de madera y metal';

const res = await fetch(`https://droppers.com.ar/catalogsearch/result/?q=${encodeURIComponent(name)}`, { headers });
const html = await res.text();
console.log('slug in html', html.includes(slug));
console.log('name in html', html.toLowerCase().includes(name.toLowerCase()));

// try slug as search
const res2 = await fetch(`https://droppers.com.ar/catalogsearch/result/?q=${encodeURIComponent(slug)}`, { headers });
const html2 = await res2.text();
console.log('slug search items', (html2.match(/product-item-info/g)||[]).length, 'slug in', html2.includes(slug));
