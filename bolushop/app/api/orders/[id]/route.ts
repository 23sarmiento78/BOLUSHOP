import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/db';
import { toPublicOrder } from '@/lib/public-order';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const order = await getOrderById(id);

        if (!order) {
            return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
        }

        return NextResponse.json(toPublicOrder(order));
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
