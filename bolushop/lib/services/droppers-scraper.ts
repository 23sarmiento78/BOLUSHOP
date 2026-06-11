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

function isDroppersProductUrl(url: string): boolean {
    if (!url) return false;

    try {
        const absoluteUrl = toAbsoluteUrl(url);
        const parsed = new URL(absoluteUrl);
        if (parsed.hostname !== 'droppers.com.ar') return false;
        if (parsed.pathname.startsWith('/catalog/')) return true;

        const segments = parsed.pathname.split('/').filter(Boolean);
        if (segments.length !== 1) return false;

        return /[a-z0-9]+-[a-z0-9]+(?:-[a-z0-9]+)*\.html$/i.test(segments[0]);
    } catch {
        return false;
    }
}

export function encodeDroppersQuery(query: string): string {
    const pieces = query.trim().split(/\s+/).filter(Boolean);
    return pieces.map((piece) => encodeURIComponent(piece)).join('+');
}

export interface DroppersSearchResult {
    productUrl?: string;
    imageUrl?: string;
    title?: string;
    price?: string;
}

function extractFieldFromBlock(block: string, regexes: RegExp[]): string | undefined {
    for (const regex of regexes) {
        const match = regex.exec(block);
        if (match && match[1]) {
            return match[1].trim();
        }
    }
    return undefined;
}

function dedupeSearchResults(results: DroppersSearchResult[]): DroppersSearchResult[] {
    const seen = new Set<string>();
    const deduped: DroppersSearchResult[] = [];

    for (const result of results) {
        if (!result.productUrl) continue;
        if (seen.has(result.productUrl)) continue;
        seen.add(result.productUrl);
        deduped.push(result);
    }

    return deduped;
}

function extractProductResults(html: string): DroppersSearchResult[] {
    const results: DroppersSearchResult[] = [];
    const blockRegex = /<(?:div|li|article)[^>]+class=["'][^"']*(?:product-item-info|product-item|product-card|catalog-product)[^"']*["'][^>]*>[\s\S]*?<\/(?:div|li|article)>/gi;
    let blockMatch;

    while ((blockMatch = blockRegex.exec(html)) !== null) {
        const block = blockMatch[0];
        const urlMatch = /href=["']([^"']+)["']/i.exec(block);
        if (!urlMatch) continue;

        const productUrl = toAbsoluteUrl(urlMatch[1]);
        if (!isDroppersProductUrl(productUrl)) continue;
        const imageMatch = /<img[^>]+(?:data-src|data-original|data-lazy-src|src)=["']([^"']+)["']/i.exec(block);
        const imageUrl = imageMatch ? toAbsoluteUrl(imageMatch[1]) : undefined;
        const title = extractFieldFromBlock(block, [
            /class=["'][^"']*product-item-name[^"']*["'][^>]*>([^<]+)<\/\w+/i,
            /class=["'][^"']*product-name[^"']*["'][^>]*>([^<]+)<\/\w+/i,
            /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i,
            /alt=["']([^"']+)["']/i,
        ]);
        const price = extractFieldFromBlock(block, [
            /class=["'][^"']*price[^"']*["'][^>]*>([^<]+)<\/\w+/i,
            /class=["'][^"']*precio[^"']*["'][^>]*>([^<]+)<\/\w+/i,
        ]);

        results.push({ productUrl, imageUrl, title, price });
    }

    if (results.length > 0) {
        return dedupeSearchResults(results);
    }

    const itemRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>[\s\S]*?<img[^>]+(?:alt=["']([^"']*)["'][^>]*?)?(?:data-src|data-original|data-lazy-src|src)=["']([^"']+)["'][\s\S]*?<\/a>/gi;
    let match;

    while ((match = itemRegex.exec(html)) !== null) {
        const url = toAbsoluteUrl(match[1]);
        if (!isDroppersProductUrl(url)) continue;
        const image = toAbsoluteUrl(match[3]);
        const title = match[2]?.trim();
        if (url && image) {
            results.push({ productUrl: url, imageUrl: image, title });
        }
    }

    if (results.length > 0) {
        return dedupeSearchResults(results);
    }

    const fallbackLinkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi;
    while ((match = fallbackLinkRegex.exec(html)) !== null) {
        const url = toAbsoluteUrl(match[1]);
        if (!isDroppersProductUrl(url)) continue;
        results.push({ productUrl: url });
    }

    return dedupeSearchResults(results);
}

function extractImagesFromHtml(html: string): string[] {
    const images: string[] = [];
    // Prioritize images inside product card blocks to avoid logos and global images
    const productBlockRegex = /<(?:div|li|article)[^>]+class=["'][^"']*(?:product-item-info|product-image-container|product-image-wrapper|product-item-photo)[^"']*["'][^>]*>[\s\S]*?<\/(?:div|li|article)>/gi;
    let blockMatch;
    while ((blockMatch = productBlockRegex.exec(html)) !== null) {
        const block = blockMatch[0];
        const imgRegex = /<img[^>]+(?:data-src|data-original|data-lazy-src|src)=["']([^"']+)["']/gi;
        let m;
        while ((m = imgRegex.exec(block)) !== null) {
            let src = m[1];
            src = src.split('?')[0];
            if (!src) continue;
            if (src.includes('logo') || src.includes('/stores/') || src.includes('/static/')) continue;
            src = toAbsoluteUrl(src);
            if (!images.includes(src)) images.push(src);
        }
        if (images.length > 0) return images.slice(0, 5);
    }

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

            if (src && !src.includes('placeholder') && !src.includes('data:') && !src.includes('icon') && !src.includes('/stores/') && !src.includes('/static/')) {
                src = toAbsoluteUrl(src);
                if (!images.includes(src) && src.length > 0) {
                    images.push(src);
                }
            }
        }
    }

    return images.slice(0, 5);
}

function extractImagesFromDetailHtml(html: string, maxImages = 5): string[] {
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
            if (
                src &&
                !src.includes('placeholder') &&
                !src.includes('data:') &&
                !src.includes('logo') &&
                !src.includes('/stores/') &&
                !src.includes('/static/') &&
                !images.includes(src)
            ) {
                images.push(src);
            }
        }
    }

    return maxImages > 0 ? images.slice(0, maxImages) : images;
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
    const encodedQuery = encodeDroppersQuery(query);
    const url = `${DROPPERS_SEARCH_URL}?q=${encodedQuery}`;
    const response = await fetch(url, { headers: BROWSER_HEADERS, next: { revalidate: 0 } });

    if (!response.ok) {
        throw new Error(`Dropers respondió ${response.status} para "${query}"`);
    }

    return response.text();
}

export async function searchDroppersProducts(query: string): Promise<DroppersSearchResult[]> {
    const normalized = query?.trim();
    if (!normalized) return [];

    const candidates = [normalized];
    const cleaned = normalized.replace(/#/g, ' ').replace(/ /g, ' ').trim();
    if (cleaned !== normalized) {
        candidates.push(cleaned);
    }

    const tokens = cleaned.split(/\s+/).filter(Boolean);
    if (tokens.length > 1) {
        const sku = tokens[0];
        const rest = tokens.slice(1).join(' ');
        if (rest && rest !== normalized) candidates.push(rest);
        if (sku && sku !== normalized) candidates.push(sku);
        if (tokens.length > 2) {
            const lastWords = tokens.slice(-2).join(' ');
            if (lastWords !== normalized) candidates.push(lastWords);
        }
    }

    const uniqueCandidates = Array.from(new Set(candidates));

    for (const candidate of uniqueCandidates) {
        const html = await fetchSearchHtml(candidate);
        const results = extractProductResults(html);
        if (results.length > 0) {
            return results.slice(0, 12);
        }
    }

    return [];
}

export async function fetchDroppersProductDetailImages(productUrl: string, maxImages = 5): Promise<string[]> {
    if (!productUrl?.trim()) return [];
    try {
        const response = await fetch(productUrl, { headers: BROWSER_HEADERS, next: { revalidate: 0 } });
        if (!response.ok) return [];
        const html = await response.text();
        const images = extractImagesFromDetailHtml(html, maxImages);
        if (images.length > 0) return images;
        return extractImagesFromHtml(html);
    } catch (error) {
        console.warn(`Error fetching detail page ${productUrl}:`, error);
        return [];
    }
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