import Link from "next/link";
import { ChevronRight, Heart, Zap, Users, ShieldCheck, Truck } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Sobre Nosotros",
    description: "Conocé la historia de BoluShop, tienda de regalos originales y accesorios para el hogar en Villa Carlos Paz, Córdoba. Selección experta y envío a todo Argentina.",
    path: "/nosotros",
    keywords: ["bolushop nosotros", "tienda regalos cordoba", "villa carlos paz"],
});

export default function NosotrosPage() {
    return (
            <main className="min-h-screen bg-[#faf9f7]">
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-10 md:py-14 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 mb-4 text-xs text-white/70">
                            <Link href="/" className="hover:text-white">Inicio</Link>
                            <ChevronRight size={14} />
                            <span>Nosotros</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black mb-3">Sobre nosotros</h1>
                        <p className="max-w-3xl text-sm md:text-base text-white/75">
                            Conocé nuestra historia, valores y cómo trabajamos para acercarte productos únicos con atención cercana.
                        </p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-14">
                    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.85fr] items-start">
                        <div className="space-y-6">
                            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.35em] text-white">
                                Nuestra historia
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-[#0f2044]">Nacimos para hacer los regalos más fáciles.</h2>
                            <p className="text-[#64748b] leading-relaxed text-base md:text-lg">
                                BoluShop nació en Villa Carlos Paz, Córdoba, con una misión simple: ayudarte a encontrar el regalo perfecto sin perder tiempo ni plata.
                            </p>
                            <p className="text-[#64748b] leading-relaxed text-base md:text-lg">
                                Seleccionamos cada producto con criterio y lo respaldamos con envío gratis, atención real y recomendaciones confiables.
                            </p>
                        </div>

                        <div className="rounded-[2rem] bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] p-8 text-white shadow-lg">
                            <div className="grid gap-4">
                                <div className="rounded-[1.5rem] bg-white/10 p-5">
                                    <p className="text-xs uppercase tracking-[0.35em] text-white/70 mb-3">Estadísticas</p>
                                    <div className="grid gap-3">
                                        <div className="rounded-3xl bg-white/10 p-4">
                                            <p className="text-3xl font-black">+100</p>
                                            <p className="text-sm text-white/70">Productos vendidos</p>
                                        </div>
                                        <div className="rounded-3xl bg-white/10 p-4">
                                            <p className="text-3xl font-black">4.9★</p>
                                            <p className="text-sm text-white/70">Calificación promedio</p>
                                        </div>
                                        <div className="rounded-3xl bg-white/10 p-4">
                                            <p className="text-3xl font-black">2024</p>
                                            <p className="text-sm text-white/70">Año de fundación</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-black text-[#0f2044]">Nuestros valores</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="rounded-[1.5rem] bg-white border border-[#e2e8f0] p-6 shadow-sm">
                                <div className="inline-flex items-center rounded-full bg-[#f0f9ff] px-3 py-1 text-[10px] font-semibold text-[#185fa5] uppercase tracking-[0.35em] mb-4">
                                    Compra protegida
                                </div>
                                <p className="text-sm text-[#64748b] leading-relaxed">
                                    Si el producto no es lo que esperabas, te devolvemos el dinero. Sin preguntas.
                                </p>
                            </div>
                            <div className="rounded-[1.5rem] bg-white border border-[#e2e8f0] p-6 shadow-sm">
                                <div className="inline-flex items-center rounded-full bg-[#eef3fb] px-3 py-1 text-[10px] font-semibold text-[#0f2044] uppercase tracking-[0.35em] mb-4">
                                    Envío gratis siempre
                                </div>
                                <p className="text-sm text-[#64748b] leading-relaxed">
                                    A todo el país, sin monto mínimo. Coordinamos con Correo Argentino
                                </p>
                            </div>
                            <div className="rounded-[1.5rem] bg-white border border-[#e2e8f0] p-6 shadow-sm">
                                <div className="inline-flex items-center rounded-full bg-[#fff7ed] px-3 py-1 text-[10px] font-semibold text-[#b45309] uppercase tracking-[0.35em] mb-4">
                                    Curaduría de calidad
                                </div>
                                <p className="text-sm text-[#64748b] leading-relaxed">
                                    Cada producto fue elegido por nosotros. No vendemos cualquier cosa.
                                </p>
                            </div>
                            <div className="rounded-[1.5rem] bg-white border border-[#e2e8f0] p-6 shadow-sm">
                                <div className="inline-flex items-center rounded-full bg-[#f8fafc] px-3 py-1 text-[10px] font-semibold text-[#0f2044] uppercase tracking-[0.35em] mb-4">
                                    Atención por WhatsApp
                                </div>
                                <p className="text-sm text-[#64748b] leading-relaxed">
                                    Respondemos rápido. Estamos disponibles para resolver cualquier duda.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2rem] bg-white border border-[#e2e8f0] p-8 shadow-sm">
                        <div className="grid gap-6 lg:grid-cols-[0.9fr_0.7fr] items-center">
                            <div>
                                <p className="text-sm uppercase tracking-[0.35em] text-[#64748b] font-bold mb-3">Cómo llegamos hasta acá</p>
                                <p className="text-lg md:text-xl font-black text-[#0f2044] mb-4">Una historia de crecimiento desde Córdoba hacia todo el país.</p>
                                <p className="text-[#64748b] leading-relaxed">
                                    Empezamos con una pequeña curaduría de regalos y hoy entregamos experiencia, confianza y productos seleccionados con criterio.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-[1.5rem] bg-[#f8fafb] border border-[#e2e8f0] p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0f2044] text-white">2024</span>
                                        <div>
                                            <p className="font-bold text-[#0f2044]">Fundación de BoluShop</p>
                                            <p className="text-sm text-[#64748b]">Israel Sarmiento crea la tienda con foco en regalos originales y envíos a todo el país.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-[1.5rem] bg-[#f8fafb] border border-[#e2e8f0] p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0f2044] text-white">2025</span>
                                        <div>
                                            <p className="font-bold text-[#0f2044]">Primeros productos y afiliados ML</p>
                                            <p className="text-sm text-[#64748b]">Se incorpora la sección de Mercado Libre con links de afiliado seleccionados a mano.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-[1.5rem] bg-[#fff7ed] border border-[#f0c040] p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e8630a] text-white">2026</span>
                                        <div>
                                            <p className="font-bold text-[#0f2044]">Nueva colección y rediseño</p>
                                            <p className="text-sm text-[#64748b]">Lanzamiento de colecciones temáticas, blog editorial y experiencia de compra mejorada.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2rem] bg-[#0f2044] p-8 md:p-10 text-white">
                        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] items-center">
                            <div>
                                <p className="text-base font-semibold text-[#f8fafc] mb-2">¿Tenés alguna pregunta?</p>
                                <p className="text-sm text-[#dbeafe]">Escribinos y te respondemos en menos de 24 horas.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="https://wa.me/543541237972" className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition">
                                    WhatsApp
                                </Link>
                                <Link href="mailto:contacto@bolushop.com" className="inline-flex items-center justify-center rounded-xl bg-[#e8630a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#d65a05] transition">
                                    Email
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
    );
}
