import Link from "next/link";
import { ChevronRight, Package, Truck, Shield, RotateCcw } from "lucide-react";
import { buildPageMetadata, buildFaqJsonLd } from "@/lib/seo";
import { SHOP_FAQ } from "@/lib/faqs";
import FaqSection from "@/components/shop/FaqSection";
import JsonLd from "@/components/shop/JsonLd";

export const metadata = buildPageMetadata({
    title: "Garantías y Devoluciones",
    description:
        "Política de garantías, reembolsos y devoluciones de BoluShop. Devolución exprés en 10 días, reintegro del 100% y envíos a toda Argentina.",
    path: "/garantias",
});

export default function GarantiasPage() {
    return (
        <>
            <JsonLd data={buildFaqJsonLd(SHOP_FAQ)} />
            <main className="min-h-screen bg-[#faf9f7]">
                <section className="hero-mesh text-white py-10 md:py-14">
                    <div className="container-shop">
                        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-xs text-white/60">
                            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                            <ChevronRight size={12} className="text-white/30" />
                            <span className="text-white/90">Garantías</span>
                        </nav>
                        <h1
                            className="text-3xl md:text-5xl font-semibold leading-tight mb-4"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Garantías y devoluciones
                        </h1>
                        <p className="text-base md:text-lg text-white/75 max-w-2xl leading-relaxed">
                            Comprá con confianza. Conocé nuestras políticas de reintegro, devolución exprés y garantía en cada producto.
                        </p>
                    </div>
                </section>

                <section className="container-shop py-12 md:py-16 space-y-10">
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: RotateCcw,
                                title: "Reintegro 100%",
                                desc: "Durante el periodo de devolución se reintegra el total de tu compra, incluyendo envíos.",
                            },
                            {
                                icon: Package,
                                title: "Devolución exprés",
                                desc: "10 días desde que recibís la compra para devolver sin costo ante fallo o disconformidad.",
                            },
                            {
                                icon: Truck,
                                title: "Paquete no entregado",
                                desc: "Si el paquete vuelve al depósito, anulamos la compra y devolvemos el dinero.",
                            },
                            {
                                icon: Shield,
                                title: "Garantía incluida",
                                desc: "Todos los productos de BoluShop tienen garantía. Posterior al plazo de devolución corre la garantía en curso.",
                            },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="card p-6">
                                <div className="w-11 h-11 rounded-xl bg-[#fff4ee] flex items-center justify-center mb-4">
                                    <Icon size={20} className="text-[#ff6b35]" />
                                </div>
                                <h2 className="text-base font-semibold text-[#0a1628] mb-2">{title}</h2>
                                <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="card p-6 md:p-8">
                        <h2 className="text-lg font-semibold text-[#0a1628] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                            Condiciones de devolución
                        </h2>
                        <ul className="space-y-3 text-sm text-[#64748b] leading-relaxed list-disc pl-5">
                            <li>Las devoluciones deben ser <strong className="text-[#0a1628]">completas, no parciales</strong>.</li>
                            <li>El producto debe estar <strong className="text-[#0a1628]">completo y sin uso</strong>, con su caja, accesorios y packaging original.</li>
                            <li>Durante los 10 días de devolución exprés, el reintegro incluye el envío de ida y el de la devolución.</li>
                            <li>Una vez finalizado ese plazo, la garantía en curso no cubre gastos de flete hacia nuestro depósito.</li>
                            <li>Para productos de Mercado Libre, la devolución y el proceso de compra se gestionan directamente desde Mercado Libre.</li>
                        </ul>
                    </div>

                    <div className="card p-6 md:p-8">
                        <h2 className="text-lg font-semibold text-[#0a1628] mb-3" style={{ fontFamily: "var(--font-display)" }}>
                            Productos de Mercado Libre
                        </h2>
                        <p className="text-sm text-[#64748b] leading-relaxed">
                            Nuestra tienda incluye productos seleccionados de Mercado Libre bajo modalidad de afiliado. 
                            Al tratarse de productos pertenecientes a esa plataforma, las transacciones, devoluciones 
                            y la Compra Protegida se gestionan directamente desde Mercado Libre, bajo sus propios términos y condiciones.
                        </p>
                        <Link
                            href="/productos?seccion=mercado-libre"
                            className="inline-flex mt-4 text-sm font-semibold text-[#3483FA] hover:underline"
                        >
                            Ver imperdibles de Mercado Libre →
                        </Link>
                    </div>

                    <FaqSection faqs={SHOP_FAQ} title="Preguntas frecuentes sobre garantías y envíos" />

                    <div className="text-center pt-4">
                        <Link href="/contacto" className="btn btn-primary">
                            Consultar soporte
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
