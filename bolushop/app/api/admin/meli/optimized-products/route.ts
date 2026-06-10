import { NextRequest, NextResponse } from 'next/server';
import {
    deleteOptimizedProduct,
    getOptimizedProductById,
    listOptimizedProducts,
    saveOptimizedProduct,
} from '@/lib/services/optimized-products';
import type { OptimizedProductInput } from '@/lib/types/meli-scout';

export async function GET(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (id) {
            const product = await getOptimizedProductById(id);
            if (!product) {
                return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
            }
            return NextResponse.json({ success: true, product });
        }

        const products = await listOptimizedProducts();
        return NextResponse.json({ success: true, products });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error interno';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as OptimizedProductInput;

        if (!body.ml_item_id || !body.seo_title || !body.seo_description) {
            return NextResponse.json(
                { error: 'ml_item_id, seo_title y seo_description son requeridos' },
                { status: 400 },
            );
        }

        const product = await saveOptimizedProduct({
            ...body,
            status: body.status ?? 'saved',
        });

        return NextResponse.json({ success: true, product });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error interno';
        console.error('Save optimized product error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Parámetro id requerido' }, { status: 400 });
        }

        await deleteOptimizedProduct(id);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error interno';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
