import { NextRequest, NextResponse } from 'next/server';
import { getSettings, getAllOrders } from '@/lib/db';
import { Order } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, payer, shippingCost } = body;

        // Calculate total
        const itemsTotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const total = itemsTotal + shippingCost;

        // Create order in database
        const order: Order = {
            id: uuidv4(),
            date: new Date().toISOString(),
            status: 'pending',
            items: items,
            total: total,
            payer: payer,
        };

        // Save order (you'll need to implement saveOrder in lib/db.ts)
        const orders = await getAllOrders();
        orders.push(order);

        // In a real implementation, you would save this to Supabase
        // For now, we'll create the Mercado Pago preference

        const settings = await getSettings();
        const MP_ACCESS_TOKEN = process.env.MP_BRICKS_ACCESS_TOKEN;

        if (!MP_ACCESS_TOKEN) {
            return NextResponse.json(
                { error: 'Mercado Pago not configured' },
                { status: 500 }
            );
        }

        // Create Mercado Pago preference
        const preference = {
            items: items.map((item: any) => ({
                title: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                currency_id: 'ARS',
            })),
            shipments: {
                cost: shippingCost,
                mode: 'not_specified',
            },
            payer: {
                name: payer.name,
                email: payer.email,
                phone: {
                    number: payer.phone,
                },
                address: {
                    street_name: payer.address,
                    zip_code: payer.zipCode || '',
                },
            },
            back_urls: {
                success: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/exito?order_id=${order.id}`,
                failure: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/carrito`,
                pending: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/exito?order_id=${order.id}`,
            },
            auto_return: 'approved' as const,
            external_reference: order.id,
            notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook/mercadopago`,
        };

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(preference),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Mercado Pago Error:', data);
            return NextResponse.json(
                { error: 'Error creating payment preference' },
                { status: 500 }
            );
        }

        revalidatePath('/admin/orders');

        return NextResponse.json({
            success: true,
            preferenceId: data.id,
            initPoint: data.init_point,
            orderId: order.id,
        });

    } catch (error) {
        console.error('Checkout Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
