import { NextRequest, NextResponse } from 'next/server';
import { fetchDroppersProductDetailImages } from '@/lib/services/droppers-scraper';

export async function GET(request: NextRequest) {
    try {
        const productUrl = request.nextUrl.searchParams.get('url');

        if (!productUrl?.trim()) {
            return NextResponse.json({ error: 'Se requiere el parámetro url' }, { status: 400 });
        }

        const images = await fetchDroppersProductDetailImages(productUrl.trim(), 30);

        return NextResponse.json({ success: true, images });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error interno';
        console.error('droppers-product-images error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
