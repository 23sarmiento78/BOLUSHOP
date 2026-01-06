import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createOrder } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// Configuración mínima y directa
const accessToken = process.env.MP_PRO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN || '';
const client = new MercadoPagoConfig({ accessToken });

export async function POST(req: NextRequest) {
    try {
        const { cart, shippingCost, formData } = await req.json();
        const orderId = uuidv4();

        // 1. Detección de URL Base (Simpificada para Localhost)
        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;

        console.log('--- REWRITE: Creación de Preferencia ---');
        console.log('Base URL:', baseUrl);
        console.log('Order ID:', orderId);

        // 2. Mapeo de Items
        const items = cart.map((item: any) => ({
            id: item.productId || item.id,
            title: item.name,
            unit_price: Number(item.price),
            quantity: Number(item.quantity),
            currency_id: 'ARS',
            picture_url: item.image?.startsWith('http') ? item.image : `${baseUrl}${item.image}`
        }));

        if (shippingCost > 0) {
            items.push({
                id: 'shipping-cost',
                title: 'Costo de Envío',
                unit_price: Number(shippingCost),
                quantity: 1,
                currency_id: 'ARS'
            });
        }

        // 3. Payload de la Preferencia (Estructura Estricta SDK v2)
        const preferenceBody: any = {
            items,
            payer: {
                name: formData.name.split(' ')[0] || 'Cliente',
                surname: formData.name.split(' ').slice(1).join(' ') || 'BoluShop',
                email: formData.email,
                phone: {
                    number: formData.phone?.replace(/\D/g, '') || '1122334455'
                },
                address: {
                    street_name: formData.street || 'Calle',
                    street_number: Number(formData.streetNumber) || 0,
                    zip_code: formData.zipCode || '1000'
                }
            },
            back_urls: {
                success: `${baseUrl}/exito`,
                failure: `${baseUrl}/rechazado`,
                pending: `${baseUrl}/exito`
            },
            auto_return: 'approved',
            external_reference: orderId,
            metadata: {
                order_id: orderId
            },
            // NOTA: notification_url NO puede ser localhost para que MP lo acepte
            notification_url: host.includes('localhost') ? undefined : `${baseUrl}/api/webhook/mercadopago`,
            binary_mode: true // Mejora la experiencia en Checkout Pro
        };

        console.log('Payload Final:', JSON.stringify(preferenceBody, null, 2));

        const preference = new Preference(client);
        const response = await preference.create({ body: preferenceBody });

        console.log('✅ Preferencia Creada:', response.id);

        // 4. Guardar Orden (Simplificado para evitar errores de tipos)
        const orderData = {
            id: orderId,
            date: new Date().toISOString(),
            status: 'pending',
            items: cart.map((item: any) => ({ ...item, id: item.productId })),
            total: items.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0),
            payer: {
                name: formData.name,
                email: formData.email,
                address: `${formData.street} ${formData.streetNumber}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.province}`,
                phone: formData.phone
            },
            paymentId: response.id
        };

        try {
            await createOrder(orderData as any);
            console.log('✅ Orden guardada en DB');
        } catch (dbError) {
            console.error('⚠️ Error al guardar en DB (continuando con el pago):', dbError);
        }

        return NextResponse.json({
            id: response.id,
            init_point: response.init_point
        });

    } catch (error: any) {
        console.error('❌ Error en /api/create-preference:', error);

        // Log detallado del error de la API de MP
        if (error.response) {
            console.error('Detalle Mercado Pago:', JSON.stringify(error.response, null, 2));
        }

        return NextResponse.json({
            error: 'Error al procesar el pago',
            details: error.message,
            mp_error: error.response?.message || 'Error desconocido'
        }, { status: 500 });
    }
}
