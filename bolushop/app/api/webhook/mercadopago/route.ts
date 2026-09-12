import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

function verifyMercadoPagoSignature(
    xSignature: string | null,
    xRequestId: string | null,
    dataId: string,
    secret: string,
) {
    if (!xSignature || !xRequestId || !dataId || !secret) return false;

    let timestamp = '';
    let signature = '';
    for (const part of xSignature.split(',')) {
        const [key, value] = part.trim().split('=', 2);
        if (key === 'ts') timestamp = value || '';
        if (key === 'v1') signature = value || '';
    }
    if (!timestamp || !signature || !/^[a-f0-9]+$/i.test(signature)) return false;

    // Mercado Pago signs this manifest, not the raw JSON body.
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${timestamp};`;
    const expected = createHmac('sha256', secret).update(manifest).digest('hex');
    const receivedBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expected, 'hex');

    return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
}

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const body = JSON.parse(rawBody);
        const xSignature = req.headers.get('x-signature');
        const xRequestId = req.headers.get('x-request-id');
        const dataId = req.nextUrl.searchParams.get('data.id') || body?.data?.id?.toString() || '';
        const webhookSecret = process.env.MP_WEBHOOK_SECRET || '';

        if (!webhookSecret) {
            console.error('❌ MP_WEBHOOK_SECRET not configured');
            return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
        }

        if (!verifyMercadoPagoSignature(xSignature, xRequestId, dataId, webhookSecret)) {
            console.error('❌ Invalid Mercado Pago webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        console.log('Mercado Pago Webhook:', body);

        // Extract payment info (handle both Webhook and IPN)
        const { type, data, topic, resource } = body;
        const kind = type || topic;
        const paymentId = (data && data.id) || resource || body.id;

        if (kind === 'payment' && paymentId) {
            console.log(`🔍 Fetching details for payment ${paymentId}...`);

            // Test and live notifications must be fetched with credentials from the same environment.
            // Never use a production token to look up a sandbox payment.
            const isLiveNotification = body.live_mode !== false;
            const MP_ACCESS_TOKEN = isLiveNotification
                ? (process.env.MP_BRICKS_ACCESS_TOKEN || process.env.MP_PRO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN)
                : process.env.MP_TEST_ACCESS_TOKEN;

            if (!MP_ACCESS_TOKEN) {
                console.error(`❌ MP ${isLiveNotification ? 'live' : 'test'} access token not configured in webhook`);
                return NextResponse.json({ error: 'MP environment not configured' }, { status: 500 });
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
