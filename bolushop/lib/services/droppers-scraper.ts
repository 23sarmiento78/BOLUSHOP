const DROPPERS_SEARCH_URL = 'https://droppers.com.ar/catalogsearch/result/';

const BROWSER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'es-AR,es;q=0.9',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

export interface DroppersAvailabilityResult {
    available: boolean;
    matchedBy: 'slug' | 'name' | 'none';
    resultCount: number;
}

function countProductItems(html: string): number {
    return (html.match(/product-item-info/g) || []).length;
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
): Promise<DroppersAvailabilityResult> {
    const queries: { term: string; type: 'slug' | 'name' }[] = [];

    if (slug?.trim()) {
        queries.push({ term: slug.trim(), type: 'slug' });
    }
    if (name?.trim()) {
        queries.push({ term: name.trim(), type: 'name' });
    }

    for (const { term, type } of queries) {
        const html = await fetchSearchHtml(term);
        const resultCount = countProductItems(html);

        if (resultCount === 0) continue;

        if (slug && html.includes(slug)) {
            return { available: !isOutOfStockPage(html), matchedBy: 'slug', resultCount };
        }

        const nameSnippet = name.trim().toLowerCase().slice(0, 40);
        if (nameSnippet && html.toLowerCase().includes(nameSnippet)) {
            return { available: !isOutOfStockPage(html), matchedBy: 'name', resultCount };
        }

        if (type === 'slug' && resultCount > 0) {
            return { available: !isOutOfStockPage(html), matchedBy: 'slug', resultCount };
        }
    }

    return { available: false, matchedBy: 'none', resultCount: 0 };
}
