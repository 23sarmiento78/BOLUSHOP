import { NextRequest, NextResponse } from 'next/server';
import { searchDroppersProducts } from '@/lib/services/droppers-scraper';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const q = searchParams.get('q');

        if (!q || q.trim().length === 0) {
            return NextResponse.json({ error: 'Se requiere el parámetro q' }, { status: 400 });
        }

        const results = await searchDroppersProducts(q.trim());

        return NextResponse.json({ success: true, query: q.trim(), results });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error interno';
        console.error('search-droppers error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
