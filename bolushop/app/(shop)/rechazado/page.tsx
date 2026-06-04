"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { AlertCircle } from "lucide-react";

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
        <div className="max-w-2xl w-full text-center px-4 py-8 md:py-12">
            <div className="rounded-[2rem] bg-white border border-[#e2e8f0] p-8 shadow-card">
                <div className="w-24 h-24 bg-[#fef2f2] text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <AlertCircle size={48} />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-[#0f2044] tracking-tight mb-4">Pago No Procesado</h1>
                <p className="text-lg text-[#1e293b] mb-4 font-bold">{mensajeError}</p>
                <p className="text-base text-[#64748b] mb-8">{sugerencia}</p>
                {orderId && (
                    <div className="bg-[#f8f9fb] rounded-3xl p-4 mb-8 border border-[#e2e8f0]">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#64748b] mb-1">Referencia de Intento</p>
                        <p className="text-sm font-bold text-[#0f2044] font-mono">{orderId}</p>
                    </div>
                )}
                <div className="space-y-3 mb-8">
                    <Link href="/checkout" className="inline-flex w-full justify-center rounded-3xl bg-[#0f2044] px-6 py-4 text-sm font-black text-white hover:bg-[#0b1938] transition">🔄 Intentar de Nuevo</Link>
                    <Link href="/productos" className="inline-flex w-full justify-center rounded-3xl border border-[#e2e8f0] bg-white px-6 py-4 text-sm font-black text-[#0f2044] hover:bg-[#f8fafb] transition">Volver a la Tienda</Link>
                </div>
                <div className="pt-6 border-t border-[#e2e8f0]">
                    <h3 className="font-bold text-base mb-3 text-[#64748b]">¿Necesitas Ayuda?</h3>
                    <p className="text-sm text-[#64748b] mb-4">Si crees que esto es un error, contáctanos para asistirte.</p>
                    <a
                        href={`https://wa.me/3541237972?text=${encodeURIComponent(`Hola, tuve un problema con mi pago. Mi referencia es: ${orderId}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-[#25D366] text-white rounded-3xl font-bold text-sm uppercase tracking-widest hover:shadow-lg transition-shadow"
                    >
                        📱 Soporte por WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function RechazadoPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-10 md:py-16 px-4 md:px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-3xl md:text-5xl font-black mb-4">Pago Rechazado</h1>
                        <p className="text-sm md:text-base text-white/80">No se pudo completar tu compra. Revisá los detalles y volvé a intentarlo.</p>
                    </div>
                </section>
                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 flex items-center justify-center">
                    <Suspense fallback={
                        <div className="min-h-[40vh] flex items-center justify-center text-center">
                            <div>
                                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Cargando...</p>
                            </div>
                        </div>
                    }>
                        <RechazadoContent />
                    </Suspense>
                </section>
            </main>
            <Footer />
        </>
    );
}
