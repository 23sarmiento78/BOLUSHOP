import { getAllProducts } from "@/lib/db";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Compra Internacional | CJ Dropshipping | BoluShop",
    description: "Importamos los mejores productos del mundo directamente para vos. Calidad garantizada y envíos seguros desde CJ Dropshipping.",
};

export const dynamic = 'force-dynamic';

export default async function InternacionalShopPage() {
    const allProducts = await getAllProducts();
    const internationalProducts = allProducts.filter(p => p.isInternational === true && p.isActive !== false);

    if (internationalProducts.length === 0) {
        return (
            <div className="bg-sand-white min-h-screen">
                <Header />
                <main className="pt-40 pb-20 container mx-auto px-6 text-center">
                    <h1 className="text-4xl font-black mb-4">Próximamente</h1>
                    <p className="text-gray-500">Estamos preparando nuestra sección de importaciones internacionales.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-sand-white min-h-screen">
            <Header />

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <header className="mb-16 text-center max-w-4xl mx-auto">
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                            🌎 Importaciones Directas
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
                            Compra <br className="hidden md:block" />
                            <span className="text-blue-600 italic">Internacional</span>
                        </h1>
                        <p className="text-xl text-gray-600 font-medium leading-relaxed">
                            Accedé a productos exclusivos del mercado global. Nosotros nos encargamos de la importación y vos lo recibís en la puerta de tu casa.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {internationalProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <section className="mt-24 p-12 bg-gray-900 rounded-[3rem] text-white overflow-hidden relative">
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-3xl font-black mb-6">¿Cómo funciona la Compra Internacional?</h2>
                            <ul className="space-y-4 text-white/80 font-medium">
                                <li className="flex gap-4">
                                    <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black">1</span>
                                    <span>Seleccionás el producto que te gusta. Lo pagás en pesos argentinos con todas nuestras opciones de pago.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black">2</span>
                                    <span>Importamos el producto desde nuestros depósitos en el exterior (CJ Dropshipping).</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black">3</span>
                                    <span>Recibís el seguimiento nacional e internacional de tu pedido hasta que llegue a tus manos.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="absolute -bottom-20 -right-20 text-[20rem] opacity-5 pointer-events-none">📦</div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
