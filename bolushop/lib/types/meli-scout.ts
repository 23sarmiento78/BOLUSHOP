export interface MeliSearchResult {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
    permalink: string;
    sold_quantity: number;
}

export interface MeliSearchResponse {
    query: string;
    total: number;
    results: MeliSearchResult[];
}

export interface MeliProductInput {
    id: string;
    title: string;
    price: number;
    thumbnail?: string;
    permalink?: string;
    sold_quantity?: number;
}

export interface GeminiSeoResult {
    seo_title: string;
    seo_description: string;
    adsense_keywords: string;
}

export interface OptimizedProduct {
    id: string;
    ml_item_id: string;
    original_title: string;
    original_price: number | null;
    thumbnail: string | null;
    permalink: string | null;
    sold_quantity: number | null;
    seo_title: string;
    seo_description: string;
    adsense_keywords: string | null;
    status: 'draft' | 'saved' | 'published';
    published_meli_item_id: string | null;
    published_permalink: string | null;
    created_at: string;
    updated_at: string;
}

export interface OptimizedProductInput {
    ml_item_id: string;
    original_title: string;
    original_price?: number;
    thumbnail?: string;
    permalink?: string;
    sold_quantity?: number;
    seo_title: string;
    seo_description: string;
    adsense_keywords?: string;
    status?: 'draft' | 'saved' | 'published';
}

export interface MeliPublishResult {
    item_id: string;
    permalink: string;
    status: string;
}

export interface MeliItemDetails {
    category_id: string;
    condition: string;
    listing_type_id: string;
    currency_id: string;
    pictures: { secure_url?: string; url?: string }[];
}
