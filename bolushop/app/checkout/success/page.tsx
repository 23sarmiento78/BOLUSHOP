"use client";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useCart } from '@/lib/cart-context';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('payment_id');
    const { clearCart } = useCart();

    useEffect(() => {
        // Clear cart on successful return
        clearCart();
    }, [clearCart]);

    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Pago Exitoso!</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Tu pago #{paymentId} se acreditó correctamente. Te enviamos un mail con los detalles de tu compra.
            </p>
            <Link href="/" className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-600 transition-colors">
                Volver al inicio
            </Link>
        </div>
    );
}
