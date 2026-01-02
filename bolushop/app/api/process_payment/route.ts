import { NextRequest, NextResponse } from 'next/server';
import MercadoPagoConfig, { Payment } from 'mercadopago';
import { createOrder } from '@/lib/db';
import { Order } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_BRICKS_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN || '' });

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

        const { metadata } = body;

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

        // Determine Base URL for notification
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host || 'localhost:3000'}`;
        baseUrl = baseUrl.replace(/\/$/, '');

        const isLocalhost = host?.includes('localhost') || host?.includes('127.0.0.1');
        const notification_url = isLocalhost ? undefined : `${baseUrl}/api/webhook/mercadopago`;

        const paymentData: any = {
            transaction_amount: Number(transaction_amount || body.transaction_amount),
            token,
            description: description || `Pedido BoluShop - ${metadata?.items?.length || 0} items`,
            installments: Number(installments),
            payment_method_id,
            issuer_id,
            payer: {
                email: payer.email,
                ...(payer.identification?.number ? {
                    identification: {
                        type: payer.identification?.type,
                        number: payer.identification?.number,
                    }
                } : {}),
            },
            external_reference: orderId,
            ...(notification_url ? { notification_url } : {}),
            metadata: metadata || {},
        };

        let result;
        try {
            result = await payment.create({ body: paymentData });
        } catch (mpError: any) {
            console.error('❌ Mercado Pago API Error:', JSON.stringify(mpError, null, 2));
            return NextResponse.json(
                {
                    error: 'Error de Mercado Pago',
                    details: mpError.message || 'Error desconocido en la API',
                    cause: mpError.cause || mpError
                },
                { status: 400 }
            );
        }

        console.log("✅ Payment result:", { id: result.id, status: result.status, status_detail: result.status_detail });

        // Save order if payment is progressing or completed
        // Statuses: approved, in_process, pending, rejected, cancelled, etc.
        if (result.status === 'approved' || result.status === 'in_process' || result.status === 'pending') {
            const order: Order = {
                id: orderId,
                date: new Date().toISOString(),
                status: result.status === 'approved' ? 'paid' : 'pending',
                items: metadata?.items || [],
                total: transaction_amount,
                payer: {
                    name: `${metadata?.payer?.name || 'Cliente'}`,
                    email: payer.email,
                    address: metadata?.payer?.address || 'N/A',
                    phone: metadata?.payer?.phone || 'N/A',
                },
                paymentId: String(result.id)
            };

            await createOrder(order);
            console.log("💾 Order created successfully:", orderId);
        }

        return NextResponse.json({
            id: result.id,
            status: result.status,
            status_detail: result.status_detail,
            orderId: orderId,
        });

    } catch (error) {
        console.error('💥 Payment Process Error:', error);
        return NextResponse.json(
            { error: 'Error processing payment', details: String(error) },
            { status: 500 }
        );
    }
}
