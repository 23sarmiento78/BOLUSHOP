import { NextRequest, NextResponse } from 'next/server';
import { searchMeliProducts } from '@/lib/services/meli-api';

export async function GET(request: NextRequest) {
    try {
        const query = request.nextUrl.searchParams.get('query');

        if (!query?.trim()) {
            return NextResponse.json({ error: 'Parámetro query requerido' }, { status: 400 });
        }

        const data = await searchMeliProducts(query.trim());

        return NextResponse.json({ success: true, ...data });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error interno';
        console.error('Meli search error:', error);
        const status = message.includes('No hay tokens') || message.includes('Reconectá')
            ? 401
            : 500;
        return NextResponse.json({ error: message }, { status });
    }
}
