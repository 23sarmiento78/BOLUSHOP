import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // Fallbacks for safety if frontend doesn't send payer yet
        const items = body.items || [];
        const payer = body.payer || { name: 'Cliente', email: 'no-email@test.com' };

        const preference = new Preference(client);

        // Create an internal Order ID
        const orderId = uuidv4();

        // Recalculate shipping logic: Universal absorption (shipping is already in product price)
        const shippingCost = 0;

        const total = items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);

        // BP: If total is 0 (Test Product), bypass MP and go straight to success
        if (total === 0) {
            createOrder({
                id: orderId,
                date: new Date().toISOString(),
                status: 'paid', // Mark as paid immediately since it's free
                items,
                total: 0,
                payer,
                paymentId: 'FREE-ORDER-' + orderId
            });
            return NextResponse.json({
                init_point: `${req.nextUrl.origin}/checkout/success?orderId=${orderId}&status=approved`
            });
        }

        const result = await preference.create({
            body: {
                external_reference: orderId, // Link MP to our Order ID
                items: items.map((item: any) => ({
                    id: item.id,
                    title: item.name,
                    quantity: item.quantity,
                    unit_price: item.price,
                    currency_id: 'ARS',
                    picture_url: item.image,
                })),
                shipments: {
                    cost: shippingCost,
                    mode: 'not_specified',
                },
                back_urls: {
                    success: `${req.nextUrl.origin}/checkout/success?orderId=${orderId}`,
                    failure: `${req.nextUrl.origin}/checkout/failure?orderId=${orderId}`,
                    pending: `${req.nextUrl.origin}/checkout/pending?orderId=${orderId}`,
                },
                auto_return: 'approved',
            }
        });

        // Save Order to JSON DB
        createOrder({
            id: orderId,
            date: new Date().toISOString(),
            status: 'pending', // Will stay pending until Webhook confirms (or we simulate it)
            items,
            total: items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0),
            payer,
            paymentId: result.id
        });

        return NextResponse.json({ init_point: result.init_point });
    } catch (error: any) {
        console.error("❌ Checkout Error:", error);
        return NextResponse.json({
            error: 'Error creating checkout session',
            details: error.message || String(error)
        }, { status: 500 });
    }
}
