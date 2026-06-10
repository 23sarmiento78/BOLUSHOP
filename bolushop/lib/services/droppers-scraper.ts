const DROPPERS_SEARCH_URL = 'https://droppers.com.ar/catalogsearch/result/';
const DROPPERS_BASE_URL = 'https://droppers.com.ar';

const BROWSER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'es-AR,es;q=0.9',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

export interface DroppersAvailabilityResult {
    available: boolean;
    matchedBy: 'sku' | 'slug' | 'name' | 'none';
    resultCount: number;
}

function countProductItems(html: string): number {
    const matches = html.match(/product-item-info/gi) || [];
    return matches.length;
}

function toAbsoluteUrl(src: string): string {
    if (!src) return src;
    if (src.startsWith('//')) return 'https:' + src;
    if (src.startsWith('/')) return DROPPERS_BASE_URL + src;
    return src;
}

interface DroppersSearchResult {
    productUrl?: string;
    imageUrl?: string;
    title?: string;
}

function extractProductResults(html: string): DroppersSearchResult[] {
    const results: DroppersSearchResult[] = [];
    const itemRegex = /<a[^>]+href=["']([^"']*\/catalog\/[^"']+)["'][^>]*>[\s\S]*?<img[^>]+(?:data-src|data-original|data-lazy-src|src)=["']([^"']+)["'][\s\S]*?<\/a>/gi;
    let match;

    while ((match = itemRegex.exec(html)) !== null) {
        const url = toAbsoluteUrl(match[1]);
        const image = toAbsoluteUrl(match[2]);
        if (url && image) {
            results.push({ productUrl: url, imageUrl: image });
        }
    }

    if (results.length > 0) {
        return results;
    }

    const fallbackLinkRegex = /<a[^>]+href=["']([^"']*\/catalog\/[^"']+)["'][^>]*>[\s\S]*?<\/a>/gi;
    while ((match = fallbackLinkRegex.exec(html)) !== null) {
        const url = toAbsoluteUrl(match[1]);
        results.push({ productUrl: url });
    }

    return results;
}

function extractImagesFromHtml(html: string): string[] {
    const images: string[] = [];
    const patterns = [
        /<img[^>]+data-src=["']([^"']+)["'][^>]*>/gi,
        /<img[^>]+data-original=["']([^"']+)["'][^>]*>/gi,
        /<img[^>]+data-lazy-src=["']([^"']+)["'][^>]*>/gi,
        /<img[^>]+srcset=["']([^"']+)["'][^>]*>/gi,
        /<img[^>]+src=["']([^"']+\.(jpg|jpeg|png|gif|webp))["'][^>]*>/gi,
        /style=["'][^"']*background-image:\s*url\(["']?([^"')]+)["']?\)[^"']*["'][^>]*>/gi,
    ];

    for (const regex of patterns) {
        let match;
        while ((match = regex.exec(html)) !== null) {
            let src = match[1];
            if (regex.source.includes('srcset') && src) {
                src = src.split(',')[0].trim().split(' ')[0];
            }

            if (src && !src.includes('placeholder') && !src.includes('data:') && !src.includes('logo') && !src.includes('icon')) {
                src = toAbsoluteUrl(src);
                if (!images.includes(src) && src.length > 0) {
                    images.push(src);
                }
            }
        }
    }

    return images.slice(0, 5);
}

function extractImagesFromDetailHtml(html: string): string[] {
    const images: string[] = [];
    const patterns = [
        /<img[^>]+class=["'][^"']*fotorama__img[^"']*["'][^>]+src=["']([^"']+)["'][^>]*>/gi,
        /<img[^>]+data-zoom-image=["']([^"']+)["'][^>]*>/gi,
        /<img[^>]+(?:data-src|data-original|data-lazy-src|src)=["']([^"']+\.(?:jpg|jpeg|png|gif|webp))["'][^>]*>/gi,
        /style=["'][^"']*background-image:\s*url\(["']?([^"')]+)["']?\)[^"']*["'][^>]*>/gi,
    ];

    for (const regex of patterns) {
        let match;
        while ((match = regex.exec(html)) !== null) {
            const src = toAbsoluteUrl(match[1]);
            if (src && !src.includes('placeholder') && !src.includes('data:') && !images.includes(src)) {
                images.push(src);
            }
        }
    }

    return images.slice(0, 5);
}

function isOutOfStockPage(html: string): boolean {
    const lower = html.toLowerCase();
    return (
        lower.includes('agotado') ||
        lower.includes('sin stock') ||
        lower.includes('out-of-stock') ||
        lower.includes('no está disponible')
    );
}

async function fetchSearchHtml(query: string): Promise<string> {
    const url = `${DROPPERS_SEARCH_URL}?q=${encodeURIComponent(query.trim())}`;
    const response = await fetch(url, { headers: BROWSER_HEADERS, next: { revalidate: 0 } });

    if (!response.ok) {
        throw new Error(`Dropers respondió ${response.status} para "${query}"`);
    }

    return response.text();
}

export async function checkDroppersAvailability(
    name: string,
    slug?: string,
    sku?: string,
): Promise<DroppersAvailabilityResult> {
    const queries: { term: string; type: 'sku' | 'slug' | 'name' }[] = [];

    if (sku?.trim() && name?.trim()) {
        queries.push({ term: `${sku.trim()} # ${name.trim()}`, type: 'sku' });
        queries.push({ term: `${sku.trim()} ${name.trim()}`, type: 'sku' });
    }
    if (slug?.trim()) {
        queries.push({ term: slug.trim(), type: 'slug' });
    }
    if (name?.trim()) {
        queries.push({ term: name.trim(), type: 'name' });
    }

    for (const { term, type } of queries) {
        try {
            const html = await fetchSearchHtml(term);
            const resultCount = countProductItems(html);

            if (resultCount === 0) continue;

            if (type === 'sku' && sku && html.toLowerCase().includes(sku.toLowerCase())) {
                return { available: !isOutOfStockPage(html), matchedBy: 'sku', resultCount };
            }

            if (slug && html.includes(slug)) {
                return { available: !isOutOfStockPage(html), matchedBy: 'slug', resultCount };
            }

            const nameSnippet = name.trim().toLowerCase().slice(0, 40);
            if (nameSnippet && html.toLowerCase().includes(nameSnippet)) {
                return { available: !isOutOfStockPage(html), matchedBy: 'name', resultCount };
            }

            if ((type === 'slug' || type === 'name' || type === 'sku') && resultCount > 0) {
                return { available: !isOutOfStockPage(html), matchedBy: type, resultCount };
            }
        } catch (error) {
            console.warn(`Dropers check error for "${term}":`, error);
        }
    }

    return { available: false, matchedBy: 'none', resultCount: 0 };
}

export interface DroppersProductImagesResult {
    url?: string;
    images: string[];
    error?: string;
}

async function fetchProductDetailImages(productUrl: string): Promise<string[]> {
    try {
        const response = await fetch(productUrl, { headers: BROWSER_HEADERS, next: { revalidate: 0 } });
        if (!response.ok) {
            return [];
        }
        const html = await response.text();
        return extractImagesFromDetailHtml(html);
    } catch (error) {
        console.warn(`Error fetching product detail page ${productUrl}:`, error);
        return [];
    }
}

export async function fetchDroppersProductImages(
    name: string,
    slug?: string,
    sku?: string,
): Promise<DroppersProductImagesResult> {
    const queries: { term: string; type: 'sku' | 'slug' | 'name' }[] = [];

    if (sku?.trim() && name?.trim()) {
        queries.push({ term: `${sku.trim()} # ${name.trim()}`, type: 'sku' });
        queries.push({ term: `${sku.trim()} ${name.trim()}`, type: 'sku' });
    }
    if (slug?.trim()) {
        queries.push({ term: slug.trim(), type: 'slug' });
    }
    if (name?.trim()) {
        queries.push({ term: name.trim(), type: 'name' });
    }

    for (const { term } of queries) {
        try {
            const html = await fetchSearchHtml(term);
            const resultCount = countProductItems(html);

            if (resultCount === 0) {
                continue;
            }

            const results = extractProductResults(html);
            if (results.length > 0) {
                const best = results[0];
                if (best.imageUrl) {
                    return { url: best.productUrl, images: [best.imageUrl] };
                }
                if (best.productUrl) {
                    const detailImages = await fetchProductDetailImages(best.productUrl);
                    if (detailImages.length > 0) {
                        return { url: best.productUrl, images: detailImages };
                    }
                }
            }

            const fallbackImages = extractImagesFromHtml(html);
            if (fallbackImages.length > 0) {
                const productLinkMatch = html.match(/<a[^>]+href=["']([^"']*\/catalog\/[^"']+)["'][^>]*>/i);
                const productUrl = productLinkMatch ? toAbsoluteUrl(productLinkMatch[1]) : undefined;
                return { url: productUrl, images: fallbackImages };
            }
        } catch (error) {
            console.warn(`Fetch error for "${term}":`, error);
        }
    }

    return { images: [] };
}