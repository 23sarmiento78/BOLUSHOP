import { NextRequest, NextResponse } from 'next/server';
import MercadoPagoConfig, { Payment } from 'mercadopago';
import { createOrder } from '@/lib/db';
import { Order } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_BRICKS_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN || ''
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Mercado Pago Bricks often nests the data inside 'formData'
        const paymentInfo = body.formData || body;
        const {
            transaction_amount,
            token,
            description,
            payer,
            installments,
            payment_method_id,
            issuer_id
        } = paymentInfo;

        const { metadata, deviceId } = body;

        console.log("💳 Processing integrated payment...", {
            transaction_amount,
            payment_method_id,
            email: payer?.email || 'MISSING'
        });

        if (!payer?.email || !token) {
            console.error("❌ Missing required payment fields:", { hasPayer: !!payer, hasEmail: !!payer?.email, hasToken: !!token });
            return NextResponse.json(
                { error: 'Datos de pago incompletos (faltan payer o token)' },
                { status: 400 }
            );
        }

        const payment = new Payment(client);
        const orderId = uuidv4();
        const idempotencyKey = uuidv4();

        // Extract Payer Details for Anti-fraud
        const fullPayer = metadata?.payer || {};
        const [firstName, ...lastNameParts] = (fullPayer.name || 'Cliente').split(' ');
        const lastName = lastNameParts.join(' ') || 'BoluShop';

        // Map Items for Anti-fraud (additional_info)
        const mpItems = (metadata?.items || []).map((item: any) => ({
            id: item.id || item.productId,
            title: item.name,
            description: item.name,
            category_id: item.category || 'others',
            quantity: item.quantity,
            unit_price: item.price,
        }));

        // Determine Base URL for notification
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const userIp = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';

        let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host || 'localhost:3000'}`;
        baseUrl = baseUrl.replace(/\/$/, '');

        const isLocalhost = host?.includes('localhost') || host?.includes('127.0.0.1');
        const notification_url = isLocalhost ? undefined : `${baseUrl}/api/webhook/mercadopago`;

        const paymentData: any = {
            transaction_amount: Number(transaction_amount || body.transaction_amount),
            token,
            description: description || `Pedido BoluShop - ${mpItems.length} items`,
            installments: Number(installments),
            payment_method_id,
            issuer_id,
            payer: {
                email: payer.email,
                first_name: firstName,
                last_name: lastName,
                phone: {
                    area_code: '54',
                    number: fullPayer.phone?.replace(/\D/g, '') || '1100000000',
                },
                address: {
                    zip_code: fullPayer.zipCode || fullPayer.zip_code || '1000',
                    street_name: fullPayer.address || 'N/A',
                    street_number: '0',
                },
                ...(payer.identification?.number ? {
                    identification: {
                        type: payer.identification?.type,
                        number: payer.identification?.number,
                    }
                } : {}),
            },
            additional_info: {
                items: mpItems,
                payer: {
                    first_name: firstName,
                    last_name: lastName,
                    phone: {
                        area_code: '54',
                        number: fullPayer.phone?.replace(/\D/g, '') || '1100000000',
                    },
                    address: {
                        zip_code: fullPayer.zipCode || fullPayer.zip_code || '1000',
                        street_name: fullPayer.address || 'N/A',
                        street_number: '0',
                    },
                },
                shipments: {
                    receiver_address: {
                        zip_code: fullPayer.zipCode || fullPayer.zip_code || '1000',
                        street_name: fullPayer.address || 'N/A',
                        street_number: 0,
                    }
                },
                ip_address: userIp,
            },
            external_reference: orderId,
            ...(notification_url ? { notification_url } : {}),
            metadata: {
                ...metadata,
                user_ip: userIp,
                device_id: deviceId
            },
        };

        let result;
        try {
            result = await payment.create({
                body: paymentData,
                requestOptions: {
                    idempotencyKey,
                    ...(deviceId ? { 'X-Meli-Session-Id': deviceId } : {})
                }
            });
        } catch (mpError: any) {
            console.error('❌ Mercado Pago API Error:', JSON.stringify(mpError, null, 2));
            return NextResponse.json(
                {
                    error: 'Error de Mercado Pago',
                    details: mpError.message || 'Error desconocido',
                    cause: mpError.cause
                },
                { status: 400 }
            );
        }

        console.log("✅ Payment result:", {
            id: result.id,
            status: result.status,
            status_detail: result.status_detail
        });

        // Save order to our database if not rejected
        if (result.status !== 'rejected') {
            const orderData: Order = {
                id: orderId,
                date: new Date().toISOString(),
                status: result.status === 'approved' ? 'paid' : 'pending',
                items: metadata?.items || [],
                total: Number(transaction_amount || body.transaction_amount),
                payer: {
                    name: fullPayer.name || 'Cliente',
                    email: payer.email,
                    address: fullPayer.address || 'N/A',
                    phone: fullPayer.phone || 'N/A'
                },
                paymentId: result.id?.toString()
            };

            await createOrder(orderData);
            console.log("💾 Order created successfully:", orderId);
        }

        return NextResponse.json({
            status: result.status,
            status_detail: result.status_detail,
            orderId,
            paymentId: result.id
        });

    } catch (error: any) {
        console.error('💥 Payment Process Error:', error);
        return NextResponse.json(
            { error: 'Error processing payment', details: String(error) },
            { status: 500 }
        );
    }
}
