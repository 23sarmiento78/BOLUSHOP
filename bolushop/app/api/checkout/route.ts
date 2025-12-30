import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_PRO_ACCESS_TOKEN || ''
});

export async function POST(req: NextRequest) {
    // Basic verification of Credentials
    if (!process.env.MP_PRO_ACCESS_TOKEN) {
        console.error("❌ ERROR: MP_PRO_ACCESS_TOKEN no está configurado en las variables de entorno.");
        return NextResponse.json({ error: 'Configuración incompleta en el servidor.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const items = body.items || [];
        const payer = body.payer || { name: 'Cliente', email: 'no-email@test.com' };

        const preference = new Preference(client);
        const orderId = uuidv4();

        const result = await preference.create({
            body: {
                external_reference: orderId,
                items: items.map((item: any) => ({
                    id: item.id,
                    title: item.name,
                    quantity: item.quantity,
                    unit_price: item.price,
                    currency_id: 'ARS',
                    picture_url: item.image,
                })),
                payer: {
                    name: (payer.name && payer.name.split(' ')[0]) || 'Cliente', // Added check for payer.name
                    surname: (payer.name && payer.name.split(' ').slice(1).join(' ')) || '', // Added check for payer.name
                    email: payer.email || 'no-email@test.com',
                },
                back_urls: {
                    success: `${req.nextUrl.origin}/checkout/success?orderId=${orderId}`,
                    failure: `${req.nextUrl.origin}/checkout/failure?orderId=${orderId}`,
                    pending: `${req.nextUrl.origin}/checkout/pending?orderId=${orderId}`,
                },
                auto_return: 'approved',
                binary_mode: true, // Recommended for immediate results
                statement_descriptor: 'BOLUSHOP', // Name on credit card bill
            }
        });

        console.log(`✅ Preference Created for Order ${orderId}: ${result.init_point}`);

        // Save Order to JSON DB
        createOrder({
            id: orderId,
            date: new Date().toISOString(),
            status: 'pending',
            items,
            total: items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0),
            payer,
            paymentId: result.id
        });

        return NextResponse.json({
            init_point: result.init_point,
            orderId: orderId
        });
    } catch (error: any) {
        console.error("❌ Checkout Error:", error);
        return NextResponse.json({
            error: 'Error creating checkout session',
            details: error.message || String(error)
        }, { status: 500 });
    }
}
