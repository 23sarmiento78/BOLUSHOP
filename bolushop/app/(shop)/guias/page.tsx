import Link from "next/link";
import { BookOpen, ShoppingBag, ArrowRight } from "lucide-react";
import { buildPageMetadata, buildFaqJsonLd } from "@/lib/seo";
import { SHOP_FAQ } from "@/lib/faqs";
import FaqSection from "@/components/shop/FaqSection";
import JsonLd from "@/components/shop/JsonLd";

export const metadata = buildPageMetadata({
    title: "Guías de Compra y FAQ",
    description:
        "Preguntas frecuentes sobre envíos, reembolsos, garantías y compras en BoluShop. Moto mensajería en CABA/GBA y Correo Argentino al interior.",
    path: "/guias",
});

export default function GuiasPage() {
    return (
        <>
            <JsonLd data={buildFaqJsonLd(SHOP_FAQ)} />
            <main className="min-h-screen bg-[#faf9f7]">
                <section className="hero-mesh text-white py-10 md:py-14">
                    <div className="container-shop text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <BookOpen size={28} />
                        </div>
                        <h1
                            className="text-3xl md:text-5xl font-semibold leading-tight mb-4"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Guías de compra
                        </h1>
                        <p className="text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
                            Todo lo que necesitás saber para comprar en BoluShop con tranquilidad.
                        </p>
                    </div>
                </section>

                <section className="container-shop py-12 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <div className="card p-6 md:p-8">
                            <div className="w-12 h-12 bg-[#fff4ee] rounded-xl flex items-center justify-center mb-5">
                                <ShoppingBag size={22} className="text-[#ff6b35]" />
                            </div>
                            <h2 className="text-xl font-semibold text-[#0a1628] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                                ¿Cómo comprar?
                            </h2>
                            <ol className="space-y-3 text-sm text-[#64748b] leading-relaxed">
                                <li><span className="font-semibold text-[#0a1628]">1.</span> Navegá por categorías o colecciones y agregá productos al carrito.</li>
                                <li><span className="font-semibold text-[#0a1628]">2.</span> Andá al checkout e ingresá tus datos de envío.</li>
                                <li><span className="font-semibold text-[#0a1628]">3.</span> Pagá con Mercado Pago de forma segura.</li>
                                <li><span className="font-semibold text-[#0a1628]">4.</span> Recibí la confirmación por email y seguí tu pedido en la página de rastreo.</li>
                            </ol>
                            <Link href="/productos" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[#ff6b35] hover:gap-3 transition-all">
                                Ir a la tienda <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="card p-6 md:p-8">
                            <h2 className="text-xl font-semibold text-[#0a1628] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                                Envíos en Argentina
                            </h2>
                            <div className="space-y-4 text-sm text-[#64748b] leading-relaxed">
                                <p>
                                    <strong className="text-[#0a1628]">CABA y GBA:</strong> moto mensajería express.
                                    Entrega dentro de las primeras 48 horas hábiles luego del despacho.
                                </p>
                                <p>
                                    <strong className="text-[#0a1628]">Interior de Buenos Aires y resto del país:</strong> Correo Argentino.
                                    Demora de 2 a 5 días hábiles según la distancia.
                                </p>
                                <p>Llegamos a <strong className="text-[#0a1628]">toda la República Argentina</strong>.</p>
                            </div>
                            <Link href="/garantias" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[#ff6b35] hover:gap-3 transition-all">
                                Ver garantías y devoluciones <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    <FaqSection faqs={SHOP_FAQ} />

                    <div className="text-center mt-10">
                        <Link href="/contacto" className="btn btn-primary">
                            ¿Tenés otra consulta? Escribinos
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
