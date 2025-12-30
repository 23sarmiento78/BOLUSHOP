import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { updateOrder, getAllOrders } from "@/lib/db";

// Initialize MP clients for both gateways
const proClient = new MercadoPagoConfig({
    accessToken: process.env.MP_PRO_ACCESS_TOKEN || ''
});

const bricksClient = new MercadoPagoConfig({
    accessToken: process.env.MP_BRICKS_ACCESS_TOKEN || ''
});

// Helper to validate signature
// Docs: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks#validar-origen-de-la-notificaci%C3%B3n
function isSignatureValid(req: NextRequest, body: any): boolean {
    const xSignature = req.headers.get("x-signature");
    const xRequestId = req.headers.get("x-request-id");

    // We try with the main secret or the bricks secret
    const secrets = [
        process.env.MP_WEBHOOK_SECRET,
        process.env.MP_BRICKS_WEBHOOK_SECRET
    ].filter(Boolean);

    if (!xSignature || !xRequestId || secrets.length === 0) {
        console.error("Missing signature headers or MP secrets");
        return false;
    }

    // Parse x-signature
    // Format: ts=...,v1=...
    const parts = xSignature.split(",");
    let ts = "";
    let hash = "";

    parts.forEach(part => {
        const [key, value] = part.split("=");
        if (key === "ts") ts = value;
        if (key === "v1") hash = value;
    });

    // Create manifest
    // Template: id:[data.id];request-id:[x-request-id];ts:[ts];
    const dataId = body?.data?.id;
    if (!dataId) return false;

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    // Calculate and compare for each secret until one matches
    return secrets.some(secret => {
        const cyphedSignature = crypto
            .createHmac("sha256", secret!)
            .update(manifest)
            .digest("hex");

        return cyphedSignature === hash;
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const searchParams = req.nextUrl.searchParams;
        const topic = searchParams.get("topic") || body.type; // 'payment' or 'merchant_order'

        // 1. Validate Signature (Optional but recommended for production)
        // We only enable this check if MP_WEBHOOK_SECRET is set
        if (process.env.MP_WEBHOOK_SECRET) {
            if (!isSignatureValid(req, body)) {
                return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
            }
        }

        // 2. Handle Payment Event
        if (topic === "payment" || topic === "merchant_order") {
            let paymentId = body.data?.id;

            // If it's a merchant_order, we might need to fetch the order to get the payment IDs
            if (topic === "merchant_order") {
                console.log("📦 Merchant Order notification received:", body.resource || body.id);
                // For now, we mainly care about direct payment updates, 
                // but we log it to understand the flow in production.
                return NextResponse.json({ success: true });
            }

            if (!paymentId) return NextResponse.json({ error: "No payment ID" }, { status: 400 });

            console.log(`🔍 Processing ${topic} update for ID: ${paymentId}`);

            // We try with Pro client first, then Bricks client
            let paymentData = null;

            try {
                const proPayment = new Payment(proClient);
                paymentData = await proPayment.get({ id: paymentId });
            } catch (e) {
                console.log(`ℹ️ Payment ${paymentId} not found in Pro account, checking Bricks...`);
                try {
                    const bricksPayment = new Payment(bricksClient);
                    paymentData = await bricksPayment.get({ id: paymentId });
                } catch (e2) {
                    console.error("❌ Payment not found in any account:", e2);
                }
            }

            if (paymentData) {
                const externalReference = paymentData.external_reference; // This is our Order ID
                const status = paymentData.status;

                console.log(`✅ Webhook Match: Order ${externalReference} -> MP Status: ${status}`);

                if (externalReference) {
                    // Map MP status to our internal status
                    let newStatus: 'pending' | 'paid' | 'cancelled' = 'pending';

                    if (status === 'approved') newStatus = 'paid';
                    else if (status === 'rejected' || status === 'cancelled') newStatus = 'cancelled';
                    else if (status === 'in_process') newStatus = 'pending';

                    // Update DB
                    await updateOrder(externalReference, {
                        status: newStatus,
                        paymentId: String(paymentId)
                    });
                }
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
