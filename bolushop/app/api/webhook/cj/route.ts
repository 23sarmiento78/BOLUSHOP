import { NextResponse } from 'next/server';
import { updateProductByCJId, updateOrderByCJId, getSettings } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("📥 Recibido Webhook de CJ:", JSON.stringify(body));

        // Note: CJ Webhooks structure might vary depending on the type
        // Documentation: https://developers.cjdropshipping.com/api-document/webhook-inventory.html

        const { type, data } = body;

        if (type === 'inventory') {
            // Data has variantId, productId, etc.
            const cjProductId = data.productId;
            const newStock = data.productInventory;

            if (cjProductId) {
                await updateProductByCJId(cjProductId, { stock: newStock });
                console.log(`✅ Stock actualizado vía Webhook para CJ ID: ${cjProductId}`);
            }
        }

        else if (type === 'productPrice') {
            const cjProductId = data.productId;
            const newCost = parseFloat(data.sellPrice);

            if (cjProductId && !isNaN(newCost)) {
                const settings = await getSettings();
                const newPrice = Math.ceil(newCost * settings.profitMargin + (settings.averageShippingCost || 0));

                await updateProductByCJId(cjProductId, {
                    cost: newCost,
                    price: newPrice
                });
                console.log(`✅ Costo/Precio actualizado vía Webhook para CJ ID: ${cjProductId}`);
            }
        }

        else if (type === 'orderStatus') {
            const cjOrderId = data.orderId;
            const cjStatus = data.status; // CJ statuses: 1: Waiting for payment, 2: Under processing, etc.

            // Map CJ status to our store status
            let status: any = null;
            if (cjStatus === 3) status = 'shipped';
            if (cjStatus === 4) status = 'delivered';

            if (cjOrderId && status) {
                await updateOrderByCJId(cjOrderId, {
                    status,
                    trackingNumber: data.trackingNumber,
                    trackingUrl: data.trackingUrl
                });
                console.log(`✅ Orden ${cjOrderId} actualizada vía Webhook a ${status}`);
            }
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("❌ Error en Webhook de CJ:", e);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

// CJ needs to verify the endpoint sometimes with a GET request
export async function GET() {
    return NextResponse.json({ message: "CJ Webhook endpoint active" });
}
