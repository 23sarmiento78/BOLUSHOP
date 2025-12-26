import { NextRequest, NextResponse } from 'next/server';
import { updateOrder, getAllOrders } from '@/lib/db';
import { sendRefundRequestEmail } from '@/lib/email';

export async function GET() {
    try {
        const orders = getAllOrders();
        return NextResponse.json({ orders });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId, action, status } = body;

        const orders = getAllOrders();
        const order = orders.find((o: any) => o.id === orderId);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (action === 'cancel') {
            updateOrder(orderId, { status: 'cancelled' });
            const email = order.payer?.email || 'cliente@ejemplo.com';
            await sendRefundRequestEmail(orderId, email);
            return NextResponse.json({ success: true, message: 'Order cancelled and email sent' });
        }

        if (action === 'update_status' && status) {
            updateOrder(orderId, { status });
            return NextResponse.json({ success: true, message: `Order status updated to ${status}` });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
