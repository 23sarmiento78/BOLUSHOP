"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { clearCart } from "@/lib/cart";

function ExitoContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');

    useEffect(() => {
        // Clear cart after successful purchase
        clearCart();
    }, []);

    const whatsappMessage = `Hola! Acabo de realizar una compra. Mi número de orden es: ${orderId}`;
    const whatsappLink = `https://wa.me/5491122334455?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <>
            <Header />

            <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-12">
                <div className="max-w-2xl w-full text-center">
                    <div className="bg-white rounded-[3rem] p-12 shadow-2xl">
                        {/* Success Icon */}
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <span className="text-5xl text-white">✓</span>
                        </div>

                        <h1 className="text-5xl font-black text-gray-900 mb-4">
                            ¡Compra <span className="text-green-500 italic">Exitosa</span>!
                        </h1>

                        <p className="text-xl text-gray-600 mb-8">
                            Gracias por tu compra. Recibirás un email con los detalles de tu pedido.
                        </p>

                        {orderId && (
                            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                <p className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Número de Orden
                                </p>
                                <p className="text-2xl font-black text-gray-900 font-mono">
                                    {orderId}
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-5 bg-green-500 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-green-500/30"
                            >
                                📱 Confirmar por WhatsApp
                            </a>

                            <Link
                                href="/productos"
                                className="block w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors"
                            >
                                Seguir Comprando
                            </Link>

                            <Link
                                href="/"
                                className="block w-full py-4 text-gray-600 font-bold text-sm hover:text-primary transition-colors"
                            >
                                ← Volver al Inicio
                            </Link>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="font-black text-lg mb-4">¿Qué sigue?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <div className="text-3xl mb-2">📧</div>
                                    <p className="font-bold">Confirmación por email</p>
                                </div>
                                <div>
                                    <div className="text-3xl mb-2">📦</div>
                                    <p className="font-bold">Preparamos tu pedido</p>
                                </div>
                                <div>
                                    <div className="text-3xl mb-2">🚚</div>
                                    <p className="font-bold">Envío a tu domicilio</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default function ExitoPage() {
    return (
        <Suspense fallback={
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4 animate-pulse">⏳</div>
                        <p className="text-gray-500 font-bold">Cargando...</p>
                    </div>
                </div>
                <Footer />
            </>
        }>
            <ExitoContent />
        </Suspense>
    );
}
