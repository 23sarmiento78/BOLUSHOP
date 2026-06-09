import Link from "next/link";
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
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">1. Identidad del comercio</h2>
                                    <p>BoluShop es una tienda 100% online operada por <b>Israel Enrique Sarmiento Escuela</b>, dedicada a la comercialización de productos a través de comercio electrónico. Nuestro modelo de negocio se basa en la venta de productos seleccionados que son abastecidos por proveedores externos especializados en logística y envíos. Al acceder y utilizar este sitio, aceptas cumplir con estos términos y condiciones.</p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">2. Productos y proveedores</h2>
                                    <p>Los productos ofrecidos en BoluShop son comercializados bajo un esquema de dropshipping. Esto significa que los productos son abastecidos, despachados y gestionados logísticamente por nuestros proveedores asociados, quienes cuentan con la capacidad operativa para cumplir con los plazos de entrega en todo el país. BoluShop actúa como intermediario entre el cliente y el proveedor, facilitando la experiencia de compra y el soporte postventa.</p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">3. Envíos y Logística</h2>
                                    <p>Realizamos envíos a toda la República Argentina a través de diversas empresas logísticas. Los tiempos de entrega son estimativos y pueden variar según la zona y la demanda. Una vez realizado el pedido, el proveedor se encarga del despacho y entrega del producto.</p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">4. Devoluciones y garantías</h2>
                                    <p>Contamos con políticas de devolución y garantía aplicables a todos los productos. Para más detalles sobre plazos, condiciones y procedimientos, consultá nuestra página de <Link href="/garantias" className="text-[#e8630a] hover:underline">Garantías y Devoluciones</Link>.</p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">5. Propiedad Intelectual</h2>
                                    <p>Todo el contenido de este sitio, incluyendo logos, diseños, textos y código, es propiedad de BoluShop o se utiliza bajo licencia. Queda prohibida su reproducción sin consentimiento.</p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">6. Modificaciones</h2>
                                    <p>Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio.</p>
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
