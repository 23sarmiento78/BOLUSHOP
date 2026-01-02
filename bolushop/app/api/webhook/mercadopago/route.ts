import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log('Mercado Pago Webhook:', body);

        // Extract payment info
        const { type, data } = body;

        if (type === 'payment') {
            const paymentId = data.id;

            // Fetch payment details from Mercado Pago
            const MP_ACCESS_TOKEN = process.env.MP_BRICKS_ACCESS_TOKEN;

            if (!MP_ACCESS_TOKEN) {
                return NextResponse.json({ error: 'MP not configured' }, { status: 500 });
            }

            const paymentResponse = await fetch(
                `https://api.mercadopago.com/v1/payments/${paymentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
                    },
                }
            );

            const payment = await paymentResponse.json();

            // Update order status based on payment status
            const orderId = payment.external_reference;
            const status = payment.status;

            console.log(`Order ${orderId} - Payment Status: ${status}`);

            // TODO: Update order in database
            // You would implement updateOrderStatus in lib/db.ts
            // await updateOrderStatus(orderId, status === 'approved' ? 'paid' : 'pending');

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}
