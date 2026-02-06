import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { success: false, error: 'Email inválido' },
                { status: 400 }
            );
        }

        const result = await subscribeToNewsletter(email);

        if (result) {
            return NextResponse.json({
                success: true,
                message: '¡Suscripción exitosa! Revisa tu email.'
            });
        } else {
            return NextResponse.json({
                success: false,
                error: 'Este email ya está suscrito'
            }, { status: 409 });
        }
    } catch (error) {
        console.error('Error en suscripción newsletter:', error);
        return NextResponse.json(
            { success: false, error: 'Error al procesar la suscripción' },
            { status: 500 }
        );
    }
}
