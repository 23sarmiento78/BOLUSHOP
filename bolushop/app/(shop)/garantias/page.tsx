import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import Link from "next/link";
import { ChevronRight, Package, Truck, Shield, AlertCircle } from "lucide-react";

export const metadata = {
    title: "Garantías y Devoluciones | BoluShop",
    description: "Conocé nuestras políticas de garantías y devoluciones. Compra con confianza en BoluShop."
};

export default function GarantiasPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-8 md:py-12 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-300">
                            <Link href="/" className="hover:text-white">Inicio</Link>
                            <ChevronRight size={14} />
                            <span>Garantías</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Garantías y Devoluciones</h1>
                        <p className="text-sm md:text-base text-gray-300 max-w-2xl">
                            Compra con total confianza. Conocé nuestras políticas de cambio y garantía.
                        </p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-10">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-[2rem] border border-[#e2e8f0] bg-[#f8fafb] p-8 shadow-card">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-[#fef2f2] mb-6">
                                <Package size={24} className="text-[#e8630a]" />
                            </div>
                            <h2 className="text-xl font-black text-[#0f2044] mb-3">Cambios rápidos</h2>
                            <p className="text-[#64748b] leading-relaxed text-sm">
                                Tenés 10 días para cambiar productos defectuosos o que no cumplan tus expectativas, siempre que estén en condiciones originales.
                            </p>
                        </div>
                        <div className="rounded-[2rem] border border-[#e2e8f0] bg-[#f8fafb] p-8 shadow-card">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-[#ecfdf5] mb-6">
                                <Truck size={24} className="text-[#10b981]" />
                            </div>
                            <h2 className="text-xl font-black text-[#0f2044] mb-3">Envío garantizado</h2>
                            <p className="text-[#64748b] leading-relaxed text-sm">
                                Si tu producto se demora o se pierde, trabajamos para rastrearlo, reemplazarlo o reembolsarte sin complicaciones.
                            </p>
                        </div>
                        <div className="rounded-[2rem] border border-[#e2e8f0] bg-[#f8fafb] p-8 shadow-card">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-[#eff6ff] mb-6">
                                <Shield size={24} className="text-[#185fa5]" />
                            </div>
                            <h2 className="text-xl font-black text-[#0f2044] mb-3">Calidad respaldada</h2>
                            <p className="text-[#64748b] leading-relaxed text-sm">
                                Todos nuestros productos están cubiertos por garantía de calidad del fabricante o importador.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-[#e2e8f0] bg-white p-8 shadow-card">
                        <h2 className="text-2xl font-black text-[#0f2044] mb-6">Cómo iniciar un cambio o devolución</h2>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="rounded-3xl bg-[#f8fafb] p-6">
                                <p className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-black mb-3">Paso 1</p>
                                <p className="text-sm text-[#64748b] leading-relaxed">Contactanos por email o WhatsApp con tu número de pedido.</p>
                            </div>
                            <div className="rounded-3xl bg-[#f8fafb] p-6">
                                <p className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-black mb-3">Paso 2</p>
                                <p className="text-sm text-[#64748b] leading-relaxed">Enviá el producto en su embalaje original y con todos los accesorios.</p>
                            </div>
                            <div className="rounded-3xl bg-[#f8fafb] p-6">
                                <p className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-black mb-3">Paso 3</p>
                                <p className="text-sm text-[#64748b] leading-relaxed">Recibí el cambio, reparación o reembolso según corresponda.</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-[#e2e8f0] bg-[#f8fafb] p-8 shadow-card">
                        <div className="flex items-start gap-4">
                            <div className="rounded-3xl bg-blue-50 p-4 text-blue-600">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#0f2044] mb-3">Pregunta frecuente</h3>
                                <p className="text-[#64748b] leading-relaxed text-sm">
                                    Sí, las devoluciones son gratis durante los primeros 10 días cuando el producto tiene un defecto de fábrica y se conserva en su embalaje original.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link href="/contacto" className="inline-flex items-center justify-center rounded-3xl bg-[#0f2044] px-8 py-4 text-sm font-black text-white transition hover:bg-[#0b1938]">
                            Consultar soporte de garantía
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
