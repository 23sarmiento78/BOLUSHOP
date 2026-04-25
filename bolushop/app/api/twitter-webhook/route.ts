import { NextRequest, NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const crc_token = searchParams.get('crc_token');

    if (crc_token) {
        const consumer_secret = process.env.TWITTER_CONSUMER_SECRET;
        if (!consumer_secret) {
            return NextResponse.json({ error: "Falta TWITTER_CONSUMER_SECRET" }, { status: 500 });
        }

        // Generar respuesta hash SHA-256 para verificación de Twitter
        const hmac = CryptoJS.HmacSHA256(crc_token, consumer_secret).toString(CryptoJS.enc.Base64);

        return NextResponse.json({
            response_token: `sha256=${hmac}`
        });
    }

    return NextResponse.json({ message: "Twitter Webhook Activo" });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Aquí recibes los eventos de Twitter (menciones, DMs, etc)
        console.log("📥 Evento de Twitter recibido:", body);

        // Lógica: Si alguien menciona a @BoluShop, podrías hacer algo aquí.

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Error procesando webhook" }, { status: 400 });
    }
}
