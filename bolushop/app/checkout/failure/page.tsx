"use client";
import Link from 'next/link';

export default function FailurePage() {
    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Ups, algo salió mal</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                No se pudo procesar tu pago. Podés intentar nuevamente o elegir otro medio de pago.
            </p>
            <Link href="/carrito" className="bg-secondary text-white font-bold py-3 px-8 rounded-full hover:bg-yellow-600 transition-colors">
                Volver al Carrito
            </Link>
        </div>
    );
}
