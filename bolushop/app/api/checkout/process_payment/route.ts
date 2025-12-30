import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';
import { createOrder, Order } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_BRICKS_ACCESS_TOKEN || ''
});

export async function POST(req: NextRequest) {
    if (!process.env.MP_BRICKS_ACCESS_TOKEN) {
        return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { formData, items, total } = body;

        if (!formData || !formData.token) {
            return NextResponse.json({ error: 'Token de pago faltante' }, { status: 400 });
        }

        const payment = new Payment(client);
        const orderId = uuidv4();

        const result = await payment.create({
            body: {
                transaction_amount: formData.transaction_amount,
                token: formData.token,
                description: 'Compra en BoluShop',
                installments: formData.installments,
                payment_method_id: formData.payment_method_id,
                issuer_id: formData.issuer_id,
                payer: {
                    email: formData.payer.email,
                    identification: formData.payer.identification,
                },
                external_reference: orderId,
            }
        });

        // Map status
        const statusMap: Record<string, string> = {
            'approved': 'paid',
            'in_process': 'pending',
            'rejected': 'cancelled',
            'pending': 'pending'
        };

        const finalStatus = statusMap[result.status || ''] || 'pending';

        // Save Order to DB
        await createOrder({
            id: orderId,
            date: new Date().toISOString(),
            status: finalStatus as Order['status'],
            items: items,
            total: total,
            payer: {
                name: body.internalPayer?.name || 'Cliente Brick',
                email: formData.payer.email,
                address: body.internalPayer?.address || 'N/A',
                phone: body.internalPayer?.phone || 'N/A'
            },
            paymentId: String(result.id)
        });

        return NextResponse.json({
            status: result.status,
            status_detail: result.status_detail,
            id: result.id,
            orderId: orderId
        });

    } catch (error: any) {
        console.error("❌ Payment Processing Error:", error);
        return NextResponse.json({
            error: 'Error al procesar el pago',
            details: error.message || String(error)
        }, { status: 400 });
    }
}
