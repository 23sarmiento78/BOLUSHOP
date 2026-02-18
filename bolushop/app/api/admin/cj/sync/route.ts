import { NextRequest, NextResponse } from 'next/server';
import { getCJAccessToken, getCJProductBySku, getCJShippingCost } from '@/lib/cj-api';

const CJ_API_KEY = "CJ5154015@api@5e2fc402b2d149b2819c791352586477";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sku = searchParams.get('sku');

    if (!sku) {
        return NextResponse.json({ error: 'SKU is required' }, { status: 400 });
    }

    try {
        const token = await getCJAccessToken(CJ_API_KEY);
        if (!token) {
            return NextResponse.json({ error: 'Failed to authenticate with CJ' }, { status: 500 });
        }

        const product = await getCJProductBySku(sku, token);
        if (!product) {
            return NextResponse.json({ error: 'Product not found in CJ' }, { status: 404 });
        }

        // Get shipping estimate to AR (Argentina)
        const shipping = await getCJShippingCost({
            startCountryCode: 'CN', // Usually China
            endCountryCode: 'AR',
            productWeight: product.productWeight || 0.5 // Default 0.5kg if not specified
        }, token);

        return NextResponse.json({
            ...product,
            shippingEstimate: shipping
        });
    } catch (error) {
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}
