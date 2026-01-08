import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const order = await getOrderById(id);

        if (!order) {
            return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
        }

        // Devolvemos solo lo necesario para el cliente (limpio)
        return NextResponse.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
