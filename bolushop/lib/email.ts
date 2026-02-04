import { Resend } from 'resend';
import { Order } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'tucorreo@ejemplo.com'; // Fallback or env var

export async function sendOrderConfirmationEmail(order: Order, payLink?: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("⚠️ RESEND_API_KEY is missing. Skipping email.");
        return;
    }

    const { payer, items, total, id } = order;

    // Construir lista de productos en HTML
    const itemsHtml = items.map(item => `
        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <p style="margin: 0; font-weight: bold;">${item.name}</p>
            <p style="margin: 0; color: #666;">Cant: ${item.quantity} x $${item.price.toLocaleString('es-AR')}</p>
        </div>
    `).join('');

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #000; text-align: center;">¡Gracias por tu compra!</h1>
            <p style="text-align: center; color: #666;">Tu pedido #${id.slice(0, 8)} ha sido registrado.</p>
            <div style="text-align: center; margin-bottom: 20px;">
                <span style="background-color: #fff3cd; color: #856404; padding: 5px 10px; border-radius: 5px; font-weight: bold; font-size: 14px;">
                    Estado: Pendiente de Pago
                </span>
            </div>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">📦 Datos de Envío (Ingresados en Checkout)</h3>
                <p><strong>Nombre:</strong> ${payer.name}</p>
                <p><strong>DNI:</strong> ${payer.dni}</p>
                <p><strong>Teléfono:</strong> ${payer.phone}</p>
                <p><strong>Dirección:</strong> ${payer.address}</p>
                <p><strong>Email:</strong> ${payer.email}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="border-bottom: 2px solid #000; padding-bottom: 10px;">🛒 Productos</h3>
                ${itemsHtml}
                <div style="text-align: right; margin-top: 20px;">
                    <h2 style="color: #000;">Total: $${total.toLocaleString('es-AR')}</h2>
                </div>
            </div>

            ${payLink ? `
            <div style="text-align: center; margin-top: 30px;">
                <a href="${payLink}" style="background-color: #009ee3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Pagar con Mercado Pago
                </a>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">Si ya pagaste, desestimá este botón.</p>
            </div>
            ` : ''}

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="text-align: center; font-size: 12px; color: #999;">BoluShop - Tienda Online</p>
        </div>
    `;

    try {
        // 1. Enviar al Cliente
        const senderEmail = process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev';

        await resend.emails.send({
            from: `BoluShop <${senderEmail}>`,
            to: [payer.email],
            subject: `Recibimos tu pedido #${id.slice(0, 8)} - BoluShop`,
            html: htmlContent
        });

        // 2. Enviar Copia al Admin (con todos los datos para "saber qué escribió")
        await resend.emails.send({
            from: `BoluShop <${senderEmail}>`,
            to: ['fsarmientoisrael118@gmail.com'], // Hardcoded as per potential user identity or env
            subject: `[NUEVA VENTA] Pedido #${id.slice(0, 8)} - $${total.toLocaleString('es-AR')}`,
            html: `
                <div style="background: #fff0f0; padding: 10px; border: 1px solid red; margin-bottom: 20px;">
                    <strong>👮 VISTA DE ADMINISTRADOR</strong><br>
                    Estos son los datos crudos que el cliente ingresó en el formulario.
                </div>
                ${htmlContent}
            `
        });

        console.log(`📧 Emails enviados correctamente para orden ${id}`);

    } catch (error) {
        console.error("❌ Error enviando email con Resend:", error);
    }
}
