import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Términos y Condiciones",
    description: "Términos y condiciones de uso de BoluShop. Información sobre compras, envíos, devoluciones y uso del sitio en Argentina.",
    path: "/terminos-y-condiciones",
});

export default function TerminosPage() {
    return (
        <>            <main className="min-h-screen bg-white pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-12 tracking-tighter">Términos y Condiciones</h1>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="md:col-span-2 space-y-12 text-gray-600 leading-relaxed">
                                <section>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">1. Identidad</h2>
                                    <p>BoluShop es una plataforma comercial operada por <b>Israel Enrique Sarmiento Escuela</b>, con base de operaciones en Villa Carlos Paz, Córdoba, Argentina. Al acceder y utilizar este sitio, aceptas cumplir con estos términos y condiciones.</p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">2. Envíos y Logística</h2>
                                    <p>Realizamos envíos a toda la República Argentina a través de diversas empresas logísticas. Los tiempos de entrega son estimativos y pueden variar según la zona y la demanda.</p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">3. Productos de Mercado Libre (Referidos)</h2>
                                    <p>Algunos productos mostrados en nuestro catálogo son seleccionados de Mercado Libre bajo una modalidad de recomendación/afiliado. BoluShop no es el vendedor directo de estos artículos; la transacción final se realiza en la plataforma de Mercado Libre bajo sus propios términos de Compra Protegida.</p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">4. Propiedad Intelectual</h2>
                                    <p>Todo el contenido de este sitio, incluyendo logos, diseños, textos y código, es propiedad de BoluShop o se utiliza bajo licencia. Queda prohibida su reproducción sin consentimiento.</p>
                                </section>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-3xl h-fit border border-gray-100">
                                <p className="font-bold text-gray-900 mb-4">¿Tenés dudas?</p>
                                <p className="text-sm text-gray-500 mb-6 font-medium">Si necesitás una aclaración sobre nuestros términos, estamos para ayudarte.</p>
                                <a href="/contacto" className="block text-center py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Contactanos</a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>        </>
    );
}
