import { NextRequest, NextResponse } from 'next/server';
import { publishMeliDraft } from '@/lib/services/meli-api';
import { getMeliAccessToken } from '@/lib/services/meli-tokens';
import { getOptimizedProductById, markOptimizedProductPublished } from '@/lib/services/optimized-products';

export async function POST(request: NextRequest) {
    try {
        const { optimizedProductId, asPaused = true } = await request.json();

        if (!optimizedProductId) {
            return NextResponse.json(
                { error: 'optimizedProductId requerido' },
                { status: 400 },
            );
        }

        const product = await getOptimizedProductById(optimizedProductId);
        if (!product) {
            return NextResponse.json({ error: 'Producto optimizado no encontrado' }, { status: 404 });
        }

        if (product.status === 'published' && product.published_meli_item_id) {
            return NextResponse.json({
                success: true,
                alreadyPublished: true,
                item_id: product.published_meli_item_id,
                permalink: product.published_permalink,
            });
        }

        const accessToken = await getMeliAccessToken();

        const result = await publishMeliDraft(accessToken, {
            seoTitle: product.seo_title,
            seoDescription: product.seo_description,
            price: product.original_price ?? 0,
            sourceItemId: product.ml_item_id,
            thumbnail: product.thumbnail,
            asPaused,
        });

        const updated = await markOptimizedProductPublished(
            product.id,
            result.item_id,
            result.permalink,
        );

        return NextResponse.json({
            success: true,
            message: asPaused
                ? 'Borrador publicado en Meli (estado: pausado). Activá la publicación desde tu panel de Meli.'
                : 'Producto publicado en Mercado Libre.',
            item_id: result.item_id,
            permalink: result.permalink,
            status: result.status,
            product: updated,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error interno';
        console.error('Meli publish error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
