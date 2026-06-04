import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/db';

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(_req: NextRequest, { params }: Params) {
    const { id: orderId } = await params;

    try {
        const order = await getOrderById(orderId);
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Order Fetch Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
