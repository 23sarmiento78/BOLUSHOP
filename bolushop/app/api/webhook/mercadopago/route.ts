import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log('Mercado Pago Webhook:', body);

        // Extract payment info (handle both Webhook and IPN)
        const { type, data, topic, resource } = body;
        const kind = type || topic;
        const paymentId = (data && data.id) || resource || body.id;

        if (kind === 'payment' && paymentId) {
            console.log(`🔍 Fetching details for payment ${paymentId}...`);

            // Try different tokens if available
            const MP_ACCESS_TOKEN = process.env.MP_BRICKS_ACCESS_TOKEN || process.env.MP_PRO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN;

            if (!MP_ACCESS_TOKEN) {
                console.error('❌ MP Access Token not configured in webhook');
                return NextResponse.json({ error: 'MP not configured' }, { status: 500 });
            }

            const paymentResponse = await fetch(
                `https://api.mercadopago.com/v1/payments/${paymentId}`,
                {
                    get headers() {
                        return {
                            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
                        };
                    },
                }
            );

            if (!paymentResponse.ok) {
                const errorData = await paymentResponse.text();
                console.error(`❌ Failed to fetch payment ${paymentId}:`, errorData);
                return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 400 });
            }

            const payment = await paymentResponse.json();

            // Update order status based on payment status
            const orderId = payment.external_reference;
            const status = payment.status;
            const status_detail = payment.status_detail;

            console.log(`✅ Webhook Processed: Order ${orderId} - Status: ${status} (${status_detail})`);

            // Mapeo de estados de Mercado Pago a estados de nuestra base de datos
            // statuses: 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
            let dbStatus: 'pending' | 'paid' | 'cancelled' = 'pending';
            if (status === 'approved') dbStatus = 'paid';
            else if (['rejected', 'cancelled', 'refunded'].includes(status)) dbStatus = 'cancelled';

            if (orderId) {
                const { updateOrder, getOrderById } = await import('@/lib/db');
                // const { sendOrderConfirmationEmail } = await import('@/lib/email'); // DISABLED: Resend solo para email marketing

                await updateOrder(orderId, {
                    status: dbStatus as any,
                    paymentId: paymentId.toString()
                });
                console.log(`✨ Database updated for Order ${orderId} to ${dbStatus}`);

                // DISABLED: Email notifications (Resend solo para email marketing)
                // if (dbStatus === 'paid') {
                //     const updatedOrder = await getOrderById(orderId);
                //     if (updatedOrder) {
                //         await sendOrderConfirmationEmail(updatedOrder);
                //         console.log(`📧 Payment confirmation email sent for Order ${orderId}`);
                //     }
                // }
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}
