import { NextRequest, NextResponse } from 'next/server';
import { optimizeProductSeo } from '@/lib/services/gemini-seo';
import type { MeliProductInput } from '@/lib/types/meli-scout';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const product = body.product as MeliProductInput | undefined;

        if (!product?.id || !product?.title) {
            return NextResponse.json(
                { error: 'Se requiere product con id y title' },
                { status: 400 },
            );
        }

        const seo = await optimizeProductSeo(product);

        return NextResponse.json({
            success: true,
            product,
            seo,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error interno';
        console.error('Meli optimize error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
