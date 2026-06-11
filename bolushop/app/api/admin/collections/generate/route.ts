import { NextResponse } from 'next/server';
import { getAllCollections, getAllProducts } from '@/lib/db';
import { generateCollectionProposals } from '@/lib/services/gemini-collections';
import { GeminiQuotaError } from '@/lib/services/gemini-product';

export const maxDuration = 120;

export async function POST() {
    try {
        const [products, collections] = await Promise.all([
            getAllProducts(),
            getAllCollections(),
        ]);

        const proposals = await generateCollectionProposals(products, collections);

        return NextResponse.json({ success: true, proposals });
    } catch (error: unknown) {
        if (error instanceof GeminiQuotaError) {
            return NextResponse.json({ success: false, error: error.message }, { status: 429 });
        }

        const message = error instanceof Error ? error.message : 'Error interno';
        console.error('Generate collections error:', error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
