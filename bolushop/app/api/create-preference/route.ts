import { NextRequest, NextResponse } from 'next/server';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { createOrder } from '@/lib/db';
import { Order } from '@/lib/types';
import { CartItem } from '@/lib/cart';
import { v4 as uuidv4 } from 'uuid';

// Configurar el cliente de Mercado Pago con el Token de Checkout Pro
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_PRO_ACCESS_TOKEN || ''
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { cart, shippingCost, formData } = body;

        if (!cart || cart.length === 0) {
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
        }

        const orderId = uuidv4();

        // Determinar URL base para los retornos
        const protocol = req.headers.get('x-forwarded-proto') || 'https';
        const host = req.headers.get('host');
        let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
        baseUrl = baseUrl.replace(/\/$/, '');

        // Construir los ítems para Mercado Pago
        const items = cart.map((item: CartItem) => ({
            id: item.productId,
            title: item.name,
            unit_price: Number(item.price),
            quantity: Number(item.quantity),
            currency_id: 'ARS',
            picture_url: item.image,
            description: item.name
        }));

        // Agregar el costo de envío como un ítem si es mayor a 0
        if (shippingCost > 0) {
            items.push({
                id: 'shipping',
                title: 'Costo de Envío',
                unit_price: Number(shippingCost),
                quantity: 1,
                currency_id: 'ARS',
                description: 'Envío a domicilio'
            });
        }

        const preference = new Preference(client);

        const response = await preference.create({
            body: {
                items,
                payer: {
                    name: formData.name,
                    email: formData.email,
                    phone: {
                        number: formData.phone.replace(/\D/g, '')
                    },
                    address: {
                        street_name: formData.address,
                        zip_code: formData.zipCode || '1000'
                    }
                },
                back_urls: {
                    success: `${baseUrl}/exito?order_id=${orderId}`,
                    failure: `${baseUrl}/rechazado?order_id=${orderId}`,
                    pending: `${baseUrl}/exito?order_id=${orderId}&status=pending`
                },
                auto_return: 'approved',
                external_reference: orderId,
                notification_url: `${baseUrl}/api/webhook/mercadopago`,
                metadata: {
                    order_id: orderId,
                    items: cart
                }
            }
        });

        // Crear la orden en estado pendiente antes de redireccionar
        const orderData: Order = {
            id: orderId,
            date: new Date().toISOString(),
            status: 'pending',
            items: cart,
            total: Number(cart.reduce((acc: number, item: CartItem) => acc + (item.price * item.quantity), 0)) + Number(shippingCost),
            payer: {
                name: formData.name,
                email: formData.email,
                address: `${formData.address}, ${formData.city}, ${formData.province}`,
                phone: formData.phone
            },
            paymentId: response.id // ID de la preferencia para rastreo
        };

        await createOrder(orderData);

        return NextResponse.json({
            id: response.id,
            init_point: response.init_point
        });

    } catch (error: any) {
        console.error('Error al crear preferencia de Mercado Pago:', error);
        return NextResponse.json(
            {
                error: 'Error al iniciar el proceso de pago',
                details: error.message || 'Error desconocido'
            },
            { status: 500 }
        );
    }
}
