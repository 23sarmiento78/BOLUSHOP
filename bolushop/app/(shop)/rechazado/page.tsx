"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";

function RechazadoContent() {
    const searchParams = useSearchParams();
    const statusDetail = searchParams.get('status_detail') || searchParams.get('collection_status');
    const orderId = searchParams.get('order_id') || searchParams.get('external_reference');

    let mensajeError = "Lo sentimos, no pudimos procesar tu pago en este momento.";
    let sugerencia = "Por favor, intenta con otro medio de pago o verifica los datos ingresados.";

    if (statusDetail === 'cc_rejected_high_risk' || statusDetail === 'rejected') {
        mensajeError = "El pago no pudo ser procesado por seguridad.";
        sugerencia = "Te recomendamos intentar con otro medio de pago o verificar con tu entidad bancaria.";
    } else if (statusDetail === 'cc_rejected_insufficient_amount') {
        mensajeError = "Tu tarjeta no tiene fondos suficientes.";
        sugerencia = "Por favor, verifica el límite de tu tarjeta o intenta con otra.";
    } else if (statusDetail === 'cc_rejected_bad_filled_security_code') {
        mensajeError = "El código de seguridad es incorrecto.";
        sugerencia = "Por favor, verifica el CVV de tu tarjeta y vuelve a intentarlo.";
    }

    return (
        <>
            <Header />

            <main className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4 pt-28 pb-12">
                <div className="max-w-2xl w-full text-center">
                    <div className="bg-white rounded-[3rem] p-12 shadow-2xl">
                        {/* Error Icon */}
                        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <span className="text-5xl text-white">✕</span>
                        </div>

                        <h1 className="text-5xl font-black text-gray-900 mb-4">
                            Pago <span className="text-red-500 italic">No Procesado</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-4 font-bold">
                            {mensajeError}
                        </p>

                        <p className="text-lg text-gray-500 mb-8">
                            {sugerencia}
                        </p>

                        {orderId && (
                            <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                    Referencia de Intento
                                </p>
                                <p className="text-sm font-bold text-gray-600 font-mono">
                                    {orderId}
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <Link
                                href="/checkout"
                                className="block w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-gray-900/30"
                            >
                                🔄 Intentar de nuevo
                            </Link>

                            <Link
                                href="/productos"
                                className="block w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors"
                            >
                                Volver a la Tienda
                            </Link>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="font-black text-lg mb-4 text-gray-400">¿Necesitas ayuda?</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Si crees que esto es un error, contactanos para asistirte.
                            </p>
                            <a
                                href={`https://wa.me/3541237972?text=${encodeURIComponent(`Hola, tuve un problema con mi pago. Mi referencia es: ${orderId}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-green-600 transition-colors"
                            >
                                📱 Soporte por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default function RechazadoPage() {
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
            <RechazadoContent />
        </Suspense>
    );
}

