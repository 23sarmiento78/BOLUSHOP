import { NextRequest, NextResponse } from 'next/server';
import { updateOrder, getAllOrders } from '@/lib/db';
import { sendRefundRequestEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId, action } = body;

        if (action === 'cancel') {
            const orders = getAllOrders();
            const order = orders.find(o => o.id === orderId);

            if (!order) {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }

            // Update status
            updateOrder(orderId, { status: 'cancelled' });

            // Send Email
            // Assuming customer email is stored, mock fallback for now
            const email = order.payer?.email || 'cliente@ejemplo.com';
            await sendRefundRequestEmail(orderId, email);

            return NextResponse.json({ success: true, message: 'Order cancelled and email sent' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
