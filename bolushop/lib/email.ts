// Simulates an email service provider
export async function sendEmail({ to, subject, body }: { to: string, subject: string, body: string }) {
    console.log('--- MOCK EMAIL SENDING ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:`);
    console.log(body);
    console.log('--- EMAIL SENT ---');

    // In a real app, you would use Nodemailer or Resend here.
    return true;
}

export async function sendRefundRequestEmail(orderId: string, customerEmail: string) {
    return sendEmail({
        to: customerEmail,
        subject: `Reembolso Pedido #${orderId} - BoluShop`,
        body: `
Hola,

Lamentamos informarte que tuvimos que cancelar tu pedido #${orderId}.

Para proceder con la devolución de tu dinero, necesitamos que nos envíes los siguientes datos:
- CBU / CVU:
- Alias:
- Banco / Billetera:
- Nombre del Titular:

Te responderemos a la brevedad con el comprobante de transferencia.

Disculpá las molestias.
Equipo BoluShop
        `
    });
}
