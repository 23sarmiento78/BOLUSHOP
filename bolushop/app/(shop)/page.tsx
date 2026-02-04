import { getAllProducts, getAllCategories, getAllCollections } from "@/lib/db";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Newsletter from "@/components/shop/Newsletter";

export const metadata: Metadata = {
    title: "BoluShop | El Marketplace N°1 con Envío Gratis en Argentina",
    description: "Comprá los mejores productos en BoluShop. Envío 100% gratis a todo el país, cuotas sin interés con Mercado Pago y calidad garantizada en cada pedido.",
    keywords: "tienda online argentina, comprar por internet argentina, marketplace argentina, envios gratis correo argentino, ofertas hoy argentina, bolushop productos, cuotas sin interes",
    openGraph: {
        title: "BoluShop - Marketplace Líder en Argentina",
        description: "Envío GRATIS a todo el país. Calidad y confianza en tus compras online.",
        type: "website",
    },
};

export default async function HomePage() {
    const allProducts = await getAllProducts();
    const categories = await getAllCategories();
    const collections = await getAllCollections();
    // Prioritize products that are active and have essential data
    const featuredProducts = allProducts
        .filter(p => p.isActive !== false && p.price > 0)
        .slice(0, 4);

    return (
        <>
            <Header />

            <main className="min-h-screen">
                {/* Hero Section with Video/Image Background */}
                {/* Hero Section: Exclusive Drop */}
                <section className="relative bg-gradient-to-r from-[#2d3436] to-[#000000] text-white overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="container mx-auto px-6 py-20 md:py-32 flex flex-col-reverse md:flex-row items-center gap-12 relative z-10">
                        <div className="w-full md:w-1/2 text-center md:text-left">
                            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#ffe600] mb-6">
                                Nueva Temporada 2026
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-[1.1] tracking-tight">
                                Exclusividad <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe600] to-yellow-200">
                                    Al Alcance de Todos
                                </span>
                            </h1>
                            <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto md:mx-0 font-medium">
                                Descubrí una selección curada de productos únicos con la garantía y velocidad que merecés.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link
                                    href="/productos"
                                    className="px-8 py-4 bg-[#2980b9] hover:bg-[#3498db] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20"
                                >
                                    Ver Ofertas del Día
                                </Link>
                                <Link
                                    href="/colecciones"
                                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-sm transition-all backdrop-blur-sm"
                                >
                                    Colecciones VIP
                                </Link>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 relative">
                            <div className="relative aspect-square md:aspect-[4/3] w-full max-w-lg mx-auto bg-white/5 rounded-3xl border border-white/10 p-6 backdrop-blur-sm -rotate-2 hover:rotate-0 transition-transform duration-700">
                                {featuredProducts[0] && (
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white">
                                        <Image
                                            src={featuredProducts[0].image}
                                            alt="Hero Product"
                                            fill
                                            className="object-contain p-4"
                                            priority
                                        />
                                        <div className="absolute top-4 right-4 bg-[#ffe600] text-black font-black text-xs px-3 py-1 rounded shadow-sm">
                                            DESTACADO DE HOY
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Offers of the Day Grid (MercadoLibre Style) */}
                <section className="bg-gray-100 py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-light text-gray-600">Ofertas del día</h2>
                            <Link href="/productos" className="text-sm font-medium text-blue-600 hover:text-blue-800">Ver todas</Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {featuredProducts.length > 0 ? (
                                featuredProducts.map((product) => (
                                    <div key={product.id} className="h-full">
                                        <ProductCard product={product} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-4 text-center py-20 text-gray-400">
                                    <p>Cargando las mejores ofertas...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Catalog Request Section */}
                <section className="container mx-auto px-4 py-16">
                    <div className="bg-gray-900 rounded-3xl p-10 md:p-20 relative overflow-hidden group border border-white/5">
                        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-30 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-l from-gray-900 via-gray-900/40 to-transparent z-10" />
                            <Image
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                                alt="Shopping"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-[4000ms]"
                            />
                        </div>
                        <div className="relative z-20 max-w-xl">
                            <span className="inline-block px-4 py-1.5 bg-secondary/10 backdrop-blur-xl border border-secondary/20 rounded-full text-xs font-bold uppercase tracking-widest text-secondary mb-6">
                                Servicio Exclusivo
                            </span>
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
                                ¿No encontrás <br /> lo que buscás? <br />
                                <span className="text-secondary italic">Solicitá el catálogo</span>
                            </h2>
                            <p className="text-gray-300 text-lg md:text-xl font-medium mb-12 max-w-lg leading-relaxed opacity-90">
                                Tenemos más de <span className="text-white font-bold underline decoration-secondary/50 underline-offset-4">500 productos exclusivos</span> que no están publicados.
                            </p>
                            <a
                                href="https://wa.me/3541237972?text=Hola!%20Me%20interesaría%20solicitar%20el%20catálogo%20completo%20de%20BoluShop."
                                target="_blank"
                                aria-label="Solicitar catálogo VIP por WhatsApp"
                                className="group/btn relative inline-flex items-center gap-4 px-10 py-5 bg-primary text-white rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                            >
                                <span className="relative z-10">📱 Solicitar Catálogo VIP</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Categories Section Removed for Boutique Layout */}

                {/* Modern Featured Collection Banner */}
                {(collections && collections.length > 0) && (() => {
                    const featuredColl = collections.find(c => c.isFeatured) || collections[0];
                    // Find first product image for background if collection has no custom image
                    let bgImage = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop";

                    if (featuredColl.image && !featuredColl.image.includes('icon.png')) {
                        bgImage = featuredColl.image;
                    } else if ((allProducts || []).length > 0) {
                        // Find products in this collection
                        const productsInColl = allProducts.filter(p =>
                            p.isActive !== false &&
                            ((featuredColl.productIds || []).includes(p.id) ||
                                (p.collections || []).includes(featuredColl.id) ||
                                (p.collections || []).includes(featuredColl.slug))
                        );
                        if (productsInColl.length > 0) bgImage = productsInColl[0].image;
                    }

                    return (
                        <section className="container mx-auto px-4 py-8">
                            <Link href={`/coleccion/${featuredColl.slug}`}>
                                <div className="relative rounded-[2.5rem] overflow-hidden group h-[500px] md:h-[600px] shadow-2xl shadow-black/20">
                                    <Image
                                        src={bgImage}
                                        alt={featuredColl.name}
                                        fill
                                        className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                    <div className="absolute inset-x-0 bottom-0 p-10 md:p-20 text-center md:text-left">
                                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            Colección Destacada
                                        </div>

                                        <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tighter leading-[0.9]">
                                            {featuredColl.name}
                                        </h2>

                                        <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl mb-10 md:mb-0 line-clamp-3 md:line-clamp-none">
                                            {featuredColl.description}
                                        </p>

                                        <div className="mt-8">
                                            <span className="inline-block px-8 py-4 bg-white text-black rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer">
                                                Ver Colección Completa
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </section>
                    );
                })()}



                {/* Trust Badges */}
                <section className="container mx-auto px-6 py-16 md:py-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <div className="group text-center p-8 rounded-3xl hover:bg-gray-50 transition-colors">
                            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 transition-transform duration-500 group-hover:scale-110">
                                🚚
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-tight">Envíos Flash</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                Procesamos tu pedido en menos de 24hs. Envío gratis en todo el país.
                            </p>
                        </div>
                        <div className="group text-center p-8 rounded-3xl hover:bg-gray-50 transition-colors">
                            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 transition-transform duration-500 group-hover:scale-110">
                                🔒
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-tight">Compra Segura</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                Pagá en cuotas sin interés con Mercado Pago. Tus datos están 100% protegidos.
                            </p>
                        </div>
                        <div className="group text-center p-8 rounded-3xl hover:bg-gray-50 transition-colors">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 transition-transform duration-500 group-hover:scale-110">
                                ✨
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-tight">Garantía Real</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                Si no te gusta el producto, tenés 30 días para devolverlo. Sin vueltas.
                            </p>
                        </div>
                    </div>
                </section>

                {/* <Newsletter /> */}
            </main>

            <Footer />
        </>
    );
}
