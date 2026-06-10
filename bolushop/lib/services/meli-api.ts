import type { MeliItemDetails, MeliPublishResult, MeliSearchResponse, MeliSearchResult } from '@/lib/types/meli-scout';

const MLA_SEARCH_URL = 'https://api.mercadolibre.com/sites/MLA/search';
const MELI_ITEMS_URL = 'https://api.mercadolibre.com/items';

interface MeliRawSearchItem {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
    permalink: string;
    sold_quantity?: number;
}

interface MeliRawSearchResponse {
    query: string;
    paging: { total: number };
    results: MeliRawSearchItem[];
}

function mapSearchItem(item: MeliRawSearchItem): MeliSearchResult {
    return {
        id: item.id,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
        permalink: item.permalink,
        sold_quantity: item.sold_quantity ?? 0,
    };
}

export async function searchMeliProducts(query: string, limit = 20): Promise<MeliSearchResponse> {
    const params = new URLSearchParams({
        q: query.trim(),
        sort: 'sold_quantity_desc',
        limit: String(limit),
    });

    const response = await fetch(`${MLA_SEARCH_URL}?${params.toString()}`, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 0 },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error de Mercado Libre (${response.status}): ${errorText}`);
    }

    const data: MeliRawSearchResponse = await response.json();

    return {
        query: data.query ?? query,
        total: data.paging?.total ?? 0,
        results: (data.results ?? []).map(mapSearchItem),
    };
}

export async function fetchMeliItemDetails(itemId: string): Promise<MeliItemDetails> {
    const response = await fetch(`${MELI_ITEMS_URL}/${itemId}`, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 0 },
    });

    if (!response.ok) {
        throw new Error(`No se pudo obtener datos del ítem ${itemId} en Meli`);
    }

    const data = await response.json();

    return {
        category_id: data.category_id,
        condition: data.condition ?? 'new',
        listing_type_id: data.listing_type_id ?? 'gold_special',
        currency_id: data.currency_id ?? 'ARS',
        pictures: data.pictures ?? [],
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
    const source = await fetchMeliItemDetails(params.sourceItemId);

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

    const itemPayload: Record<string, unknown> = {
        title: params.seoTitle.slice(0, 60),
        category_id: source.category_id,
        price: params.price,
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
