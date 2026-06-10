import { supabaseServer } from '@/lib/supabase-server';
import type { OptimizedProduct, OptimizedProductInput } from '@/lib/types/meli-scout';

function mapRow(row: Record<string, unknown>): OptimizedProduct {
    return {
        id: String(row.id),
        ml_item_id: String(row.ml_item_id),
        original_title: String(row.original_title),
        original_price: row.original_price != null ? Number(row.original_price) : null,
        thumbnail: row.thumbnail != null ? String(row.thumbnail) : null,
        permalink: row.permalink != null ? String(row.permalink) : null,
        sold_quantity: row.sold_quantity != null ? Number(row.sold_quantity) : null,
        seo_title: String(row.seo_title),
        seo_description: String(row.seo_description),
        adsense_keywords: row.adsense_keywords != null ? String(row.adsense_keywords) : null,
        status: (row.status as OptimizedProduct['status']) ?? 'saved',
        published_meli_item_id: row.published_meli_item_id != null ? String(row.published_meli_item_id) : null,
        published_permalink: row.published_permalink != null ? String(row.published_permalink) : null,
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
    };
}

export async function listOptimizedProducts(): Promise<OptimizedProduct[]> {
    const { data, error } = await supabaseServer
        .from('optimized_products')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRow);
}

export async function saveOptimizedProduct(input: OptimizedProductInput): Promise<OptimizedProduct> {
    const payload = {
        ml_item_id: input.ml_item_id,
        original_title: input.original_title,
        original_price: input.original_price ?? null,
        thumbnail: input.thumbnail ?? null,
        permalink: input.permalink ?? null,
        sold_quantity: input.sold_quantity ?? null,
        seo_title: input.seo_title,
        seo_description: input.seo_description,
        adsense_keywords: input.adsense_keywords ?? null,
        status: input.status ?? 'saved',
        updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabaseServer
        .from('optimized_products')
        .select('id')
        .eq('ml_item_id', input.ml_item_id)
        .maybeSingle();

    if (existing?.id) {
        const { data, error } = await supabaseServer
            .from('optimized_products')
            .update(payload)
            .eq('id', existing.id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return mapRow(data);
    }

    const { data, error } = await supabaseServer
        .from('optimized_products')
        .insert(payload)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapRow(data);
}

export async function getOptimizedProductById(id: string): Promise<OptimizedProduct | null> {
    const { data, error } = await supabaseServer
        .from('optimized_products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? mapRow(data) : null;
}

export async function markOptimizedProductPublished(
    id: string,
    meliItemId: string,
    permalink: string,
): Promise<OptimizedProduct> {
    const { data, error } = await supabaseServer
        .from('optimized_products')
        .update({
            status: 'published',
            published_meli_item_id: meliItemId,
            published_permalink: permalink,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapRow(data);
}

export async function deleteOptimizedProduct(id: string): Promise<void> {
    const { error } = await supabaseServer
        .from('optimized_products')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}
