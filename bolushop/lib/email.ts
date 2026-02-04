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

    const statusColors = {
        pending: '#856404',
        paid: '#155724',
        cancelled: '#721c24'
    };
    const statusBg = {
        pending: '#fff3cd',
        paid: '#d4edda',
        cancelled: '#f8d7da'
    };
    const statusText = {
        pending: 'Pendiente de Pago',
        paid: 'Pago Confirmado',
        cancelled: 'Cancelado'
    };

    const currentStatus = order.status || 'pending';
    const statusLabel = statusText[currentStatus as keyof typeof statusText] || statusText.pending;
    const color = statusColors[currentStatus as keyof typeof statusColors] || statusColors.pending;
    const bg = statusBg[currentStatus as keyof typeof statusBg] || statusBg.pending;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #000; text-align: center;">
                ${currentStatus === 'paid' ? '¡Pago Exitoso!' : '¡Gracias por tu compra!'}
            </h1>
            <p style="text-align: center; color: #666;">
                Tu pedido #${id.slice(0, 8)} ha sido ${currentStatus === 'paid' ? 'confirmado' : 'registrado'}.
            </p>
            <div style="text-align: center; margin-bottom: 20px;">
                <span style="background-color: ${bg}; color: ${color}; padding: 5px 10px; border-radius: 5px; font-weight: bold; font-size: 14px;">
                    Estado: ${statusLabel}
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

            ${payLink && currentStatus === 'pending' ? `
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
        const clientSubject = currentStatus === 'paid'
            ? `¡Tu pedido #${id.slice(0, 8)} está confirmado! - BoluShop`
            : `Recibimos tu pedido #${id.slice(0, 8)} - BoluShop`;

        await resend.emails.send({
            from: `BoluShop <${senderEmail}>`,
            to: [payer.email],
            subject: clientSubject,
            html: htmlContent
        });

        // 2. Enviar Copia al Admin
        const adminSubject = currentStatus === 'paid'
            ? `[PAGO EXITOSO] Pedido #${id.slice(0, 8)} - $${total.toLocaleString('es-AR')}`
            : `[NUEVA VENTA] Pedido #${id.slice(0, 8)} - $${total.toLocaleString('es-AR')}`;

        await resend.emails.send({
            from: `BoluShop <${senderEmail}>`,
            to: ['fsarmientoisrael118@gmail.com'],
            subject: adminSubject,
            html: `
                <div style="background: #fff0f0; padding: 10px; border: 1px solid red; margin-bottom: 20px;">
                    <strong>👮 VISTA DE ADMINISTRADOR</strong><br>
                    Estado actual: <strong>${statusLabel}</strong>
                </div>
                ${htmlContent}
            `
        });

        console.log(`📧 Emails enviados correctamente para orden ${id}`);

    } catch (error) {
        console.error("❌ Error enviando email con Resend:", error);
    }
}

export async function sendRefundRequestEmail(orderId: string, email: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("⚠️ RESEND_API_KEY is missing. Skipping refund email.");
        return;
    }

    const senderEmail = process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev';

    try {
        await resend.emails.send({
            from: `BoluShop <${senderEmail}>`,
            to: [email],
            subject: `Cancelación de pedido #${orderId.slice(0, 8)} - BoluShop`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #c62828; text-align: center;">Pedido Cancelado</h2>
                    <p>Tu pedido <strong>#${orderId}</strong> ha sido cancelado.</p>
                    <p>Si ya habías realizado el pago, el dinero será devuelto a tu medio de pago original en los plazos establecidos por Mercado Pago.</p>
                    <p>Por cualquier consulta, no dudes en contactarnos.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="text-align: center; font-size: 12px; color: #999;">BoluShop - Tienda Online</p>
                </div>
            `
        });
        console.log(`📧 Email de cancelación enviado a ${email} para orden ${orderId}`);
    } catch (error) {
        console.error("❌ Error enviando email de cancelación:", error);
    }
}

