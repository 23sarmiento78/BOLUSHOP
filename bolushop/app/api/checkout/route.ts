import { NextRequest, NextResponse } from 'next/server';
import { getSettings, getAllOrders } from '@/lib/db';
import { Order } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
    console.log("🚀 Starting Checkout Process");
    try {
        const body = await req.json();
        const { items, payer, shippingCost } = body;
        console.log("📦 Body received:", { itemsCount: items.length, payerEmail: payer.email, shippingCost });

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
        console.log("📝 Order object created:", order.id);

        // Save order
        // const orders = await getAllOrders();
        // orders.push(order);
        // console.log("💾 Order pushed to local array (simulated)");

        const MP_ACCESS_TOKEN = process.env.MP_BRICKS_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN;
        console.log("🔑 MP Token present:", !!MP_ACCESS_TOKEN, "Length:", MP_ACCESS_TOKEN?.length);

        if (!MP_ACCESS_TOKEN) {
            console.error("❌ Stats: MP_ACCESS_TOKEN missing");
            return NextResponse.json(
                { error: 'Mercado Pago not configured' },
                { status: 500 }
            );
        }

        // Determine Base URL
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        let baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

        if (!baseUrl) {
            baseUrl = `${protocol}://${host || 'localhost:3000'}`;
        }

        // Ensure protocol is present
        if (!baseUrl.startsWith('http')) {
            baseUrl = `https://${baseUrl}`;
        }

        // Remove trailing slash if present
        baseUrl = baseUrl.replace(/\/$/, '');

        console.log("🌐 Base URL calculated (Sanitized):", baseUrl);

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
                success: `https://www.google.com/exito?order_id=${order.id}`,
                failure: `https://www.google.com/carrito`,
                pending: `https://www.google.com/exito?order_id=${order.id}`,
            },
            auto_return: 'approved' as const,
            external_reference: order.id,
            notification_url: `https://www.google.com/api/webhook/mercadopago`,
        };

        console.log("🔗 Back URLs constructed:", JSON.stringify(preference.back_urls, null, 2));
        console.log("📤 Sending Preference to MP...", JSON.stringify(preference, null, 2));

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(preference),
        });

        const data = await response.json();
        console.log("📥 MP Response Status:", response.status);

        if (!response.ok) {
            console.error('❌ Mercado Pago Error Data:', JSON.stringify(data, null, 2));
            return NextResponse.json(
                { error: 'Error creating payment preference', details: data },
                { status: 500 }
            );
        }

        console.log("✅ Preference Created:", data.id);

        // Only save to DB if preference successful? No, save as pending first usually, or after. 
        // Logic in original file was saving before.
        // Let's restore the save logic but add a try catch for it specifically or use the existing lib
        try {
            // We need to import createOrder from lib/db if it exists, or use the direct logic
            // Original file used getAllOrders and push.
            // I'll stick to what was there but add logging.
            const orders = await getAllOrders();
            orders.push(order);
            console.log("💾 Order saved to memory/file");
        } catch (dbErr) {
            console.error("❌ DB Save Error:", dbErr);
        }

        // revalidatePath('/admin/orders');

        return NextResponse.json({
            success: true,
            preferenceId: data.id,
            initPoint: data.init_point,
            orderId: order.id,
        });

    } catch (error) {
        console.error('💥 Internal Checkout Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}
