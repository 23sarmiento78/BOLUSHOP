import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import Link from "next/link";
import { ChevronRight, Heart, Zap, Users } from "lucide-react";

export default function NosotrosPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-8 md:py-12 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-300">
                            <Link href="/" className="hover:text-white">Inicio</Link>
                            <ChevronRight size={14} />
                            <span>Nosotros</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Sobre BoluShop</h1>
                        <p className="text-sm md:text-base text-gray-300 max-w-2xl">
                            Conocé nuestro origen, nuestra misión y la forma en que trabajamos cada día.
                        </p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-16">
                    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
                        <div className="space-y-6">
                            <span className="inline-flex items-center rounded-full bg-[#f8fafb] px-4 py-2 text-[11px] font-black uppercase tracking-[0.35em] text-[#0f2044]">Nuestra Historia</span>
                            <h2 className="text-3xl md:text-4xl font-black text-[#0f2044]">Una tienda pensada para quienes buscan lo distinto.</h2>
                            <p className="text-[#64748b] leading-relaxed text-base md:text-lg">
                                BoluShop nació en 2026 con la misión de traer al mercado argentino productos únicos, funcionales y con estilo. Desde Villa Carlos Paz, seleccionamos cada artículo con cuidado.
                            </p>
                            <p className="text-[#64748b] leading-relaxed text-base md:text-lg">
                                Lo que comenzó como una pequeña curaduría de gadgets hoy es un espacio dedicado a experiencias de compra distintas: regalos con personalidad, herramientas prácticas y detalles que sorprenden.
                            </p>
                        </div>
                        <div className="rounded-[2.5rem] bg-[#f8f9fb] border border-[#e2e8f0] p-10 shadow-card">
                            <h3 className="text-2xl font-black text-[#0f2044] mb-5">Nuestra Promesa</h3>
                            <p className="text-[#64748b] leading-relaxed mb-6">
                                Si no lo usaríamos nosotros, no lo recomendamos. Cada producto recibe el respaldo de nuestro servicio y atención personalizada.
                            </p>
                            <div className="grid gap-4">
                                <div className="rounded-3xl bg-white border border-[#e2e8f0] p-5">
                                    <p className="text-xs uppercase tracking-[0.35em] text-[#64748b] mb-2 font-black">Confianza</p>
                                    <p className="text-sm text-[#0f2044] font-bold">Compra segura con soporte real.</p>
                                </div>
                                <div className="rounded-3xl bg-white border border-[#e2e8f0] p-5">
                                    <p className="text-xs uppercase tracking-[0.35em] text-[#64748b] mb-2 font-black">Calidad</p>
                                    <p className="text-sm text-[#0f2044] font-bold">Selección de productos verificados y confiables.</p>
                                </div>
                                <div className="rounded-3xl bg-white border border-[#e2e8f0] p-5">
                                    <p className="text-xs uppercase tracking-[0.35em] text-[#64748b] mb-2 font-black">Entrega</p>
                                    <p className="text-sm text-[#0f2044] font-bold">Envíos rápidos y atención local.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="card p-8">
                            <div className="w-12 h-12 rounded-3xl bg-[#fef2f2] flex items-center justify-center mb-5">
                                <Heart size={24} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-[#0f2044] mb-3">Curaduría de Calidad</h3>
                            <p className="text-[#64748b] leading-relaxed text-sm">
                                Seleccionamos solo productos que realmente valen la pena.
                            </p>
                        </div>
                        <div className="card p-8">
                            <div className="w-12 h-12 rounded-3xl bg-[#f0fdf4] flex items-center justify-center mb-5">
                                <Zap size={24} className="text-[#10b981]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#0f2044] mb-3">Envío Veloz</h3>
                            <p className="text-[#64748b] leading-relaxed text-sm">
                                Enviamos tus compras con agilidad y seguimiento constante.
                            </p>
                        </div>
                        <div className="card p-8">
                            <div className="w-12 h-12 rounded-3xl bg-[#f0f9ff] flex items-center justify-center mb-5">
                                <Users size={24} className="text-[#185fa5]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#0f2044] mb-3">Comunidad</h3>
                            <p className="text-[#64748b] leading-relaxed text-sm">
                                Tu feedback es clave para mejorar cada día.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] bg-[#f8fafc] border border-[#e2e8f0] p-10 text-center">
                        <p className="text-sm uppercase tracking-[0.35em] text-[#64748b] font-bold mb-4">Nuestra visión</p>
                        <h2 className="text-3xl font-black text-[#0f2044] mb-4">Ser la tienda online donde comprar algo especial sea fácil, rápido y seguro.</h2>
                        <p className="text-[#64748b] leading-relaxed text-base md:text-lg">
                            No vendemos productos: ofrecemos experiencias seleccionadas con entusiasmo y responsabilidad.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
