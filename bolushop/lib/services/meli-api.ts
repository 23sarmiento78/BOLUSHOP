import { getMeliAccessToken } from '@/lib/services/meli-tokens';
import type { MeliItemDetails, MeliPublishResult, MeliSearchResponse, MeliSearchResult } from '@/lib/types/meli-scout';

const MELI_PRODUCTS_SEARCH_URL = 'https://api.mercadolibre.com/products/search';
const MELI_ITEMS_URL = 'https://api.mercadolibre.com/items';
const MELI_PRODUCTS_URL = 'https://api.mercadolibre.com/products';

interface CatalogProductPicture {
    url?: string;
}

interface CatalogProductResult {
    id: string;
    name: string;
    domain_id?: string;
    pictures?: CatalogProductPicture[];
}

interface CatalogSearchResponse {
    keywords?: string;
    paging?: { total: number };
    results?: CatalogProductResult[];
}

function mapCatalogProduct(product: CatalogProductResult): MeliSearchResult {
    return {
        id: product.id,
        title: product.name,
        price: 0,
        thumbnail: product.pictures?.[0]?.url ?? '',
        permalink: `https://www.mercadolibre.com.ar/p/${product.id}`,
        sold_quantity: 0,
    };
}

async function searchViaCatalogApi(
    query: string,
    limit: number,
    accessToken: string,
): Promise<MeliSearchResponse> {
    const params = new URLSearchParams({
        site_id: 'MLA',
        status: 'active',
        q: query.trim(),
        limit: String(limit),
    });

    const response = await fetch(`${MELI_PRODUCTS_SEARCH_URL}?${params.toString()}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error de búsqueda en catálogo Meli (${response.status}): ${errorText}`);
    }

    const data: CatalogSearchResponse = await response.json();

    return {
        query: data.keywords ?? query,
        total: data.paging?.total ?? 0,
        results: (data.results ?? []).map(mapCatalogProduct),
    };
}

async function resolveCategoryFromProduct(
    productId: string,
    accessToken: string,
): Promise<string | null> {
    const productRes = await fetch(`${MELI_PRODUCTS_URL}/${productId}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!productRes.ok) return null;

    const product = await productRes.json();
    const domainId = product.domain_id as string | undefined;
    if (!domainId) return null;

    const domainRes = await fetch(
        `https://api.mercadolibre.com/domains/${domainId}/categories`,
        {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    if (!domainRes.ok) return null;

    const categories = await domainRes.json();
    return categories?.[0]?.category_id ?? null;
}

export async function searchMeliProducts(query: string, limit = 20): Promise<MeliSearchResponse> {
    const accessToken = await getMeliAccessToken();
    return searchViaCatalogApi(query, limit, accessToken);
}

export async function fetchMeliItemDetails(itemId: string, accessToken?: string): Promise<MeliItemDetails> {
    const token = accessToken ?? await getMeliAccessToken();

    const itemResponse = await fetch(`${MELI_ITEMS_URL}/${itemId}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (itemResponse.ok) {
        const data = await itemResponse.json();
        return {
            category_id: data.category_id,
            condition: data.condition ?? 'new',
            listing_type_id: data.listing_type_id ?? 'gold_special',
            currency_id: data.currency_id ?? 'ARS',
            pictures: data.pictures ?? [],
        };
    }

    const categoryId = await resolveCategoryFromProduct(itemId, token);
    if (!categoryId) {
        throw new Error(`No se pudo obtener categoría para el producto ${itemId}`);
    }

    const productRes = await fetch(`${MELI_PRODUCTS_URL}/${itemId}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const product = productRes.ok ? await productRes.json() : null;

    return {
        category_id: categoryId,
        condition: 'new',
        listing_type_id: 'gold_special',
        currency_id: 'ARS',
        pictures: (product?.pictures ?? []).map((p: { url: string }) => ({ url: p.url })),
    };
}

export async function publishMeliDraft(
    accessToken: string,
    params: {
        seoTitle: string;
        seoDescription: string;
        price: number;
        sourceItemId: string;
        thumbnail?: string | null;
        asPaused?: boolean;
    },
): Promise<MeliPublishResult> {
    const source = await fetchMeliItemDetails(params.sourceItemId, accessToken);

    const pictures: { source: string }[] = [];
    if (params.thumbnail) {
        pictures.push({ source: params.thumbnail });
    }
    for (const pic of source.pictures.slice(0, 10)) {
        const url = pic.secure_url || pic.url;
        if (url && !pictures.some((p) => p.source === url)) {
            pictures.push({ source: url });
        }
    }

    const price = params.price > 0 ? params.price : 1000;

    const itemPayload: Record<string, unknown> = {
        title: params.seoTitle.slice(0, 60),
        category_id: source.category_id,
        price,
        currency_id: source.currency_id,
        available_quantity: 1,
        buying_mode: 'buy_it_now',
        listing_type_id: source.listing_type_id,
        condition: source.condition,
        pictures,
    };

    if (params.asPaused !== false) {
        itemPayload.status = 'paused';
    }

    const createResponse = await fetch(MELI_ITEMS_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(itemPayload),
    });

    if (!createResponse.ok) {
        const errorText = await createResponse.text();
        throw new Error(`Error al crear ítem en Meli: ${errorText}`);
    }

    const created = await createResponse.json();

    const descResponse = await fetch(`${MELI_ITEMS_URL}/${created.id}/description`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ plain_text: params.seoDescription }),
    });

    if (!descResponse.ok) {
        const errorText = await descResponse.text();
        throw new Error(`Ítem creado (${created.id}) pero falló la descripción: ${errorText}`);
    }

    return {
        item_id: created.id,
        permalink: created.permalink,
        status: created.status ?? 'paused',
    };
}
