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
        .slice(0, 8);

    return (
        <>
            <Header />

            <main className="min-h-screen">
                {/* Hero Section with Video/Image Background */}
                <section className="relative h-[70vh] md:h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                    {/* Background Video with Poster to prevent CLS */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="/hero-fallback.jpg"
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/videohero.mp4" type="video/mp4" />
                    </video>

                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

                    <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto pt-10">
                        <span className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-top-4 duration-1000">
                            Nueva Colección 2026
                        </span>
                        <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
                            Estilo Que <br />
                            <span className="text-primary italic">Inspira</span>
                        </h1>
                        <p className="text-base md:text-xl mb-10 font-medium text-gray-200/90 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                            Elevá tu hogar con piezas exclusivas elegidas para durar. Envíos flash a todo el país.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            <Link
                                href="/productos"
                                className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                            >
                                Explorar Tienda
                            </Link>
                            <Link
                                href="/rastreo"
                                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                            >
                                Mi Pedido 🚚
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Infinite Product Marquee */}
                <section className="bg-gray-50/30 py-16 overflow-hidden border-y border-gray-100">
                    <div className="container mx-auto px-4 mb-8 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Nuestras Joyas</p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Selección <span className="italic text-primary">Premium</span></h2>
                    </div>

                    <div className="flex animate-marquee whitespace-nowrap">
                        {[...allProducts, ...allProducts].slice(0, 20).map((product, i) => (
                            <div key={i} className="mx-4 flex flex-col items-center gap-4 group cursor-default">
                                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100 group-hover:scale-105 transition-all duration-500">
                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <p className="text-white font-bold text-sm tracking-tight leading-tight whitespace-normal line-clamp-1">{product.name}</p>
                                        <p className="text-primary font-bold mt-0.5 text-xs">${product.price.toLocaleString('es-AR')}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
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

                <section className="container mx-auto px-4 py-8 md:py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                                Selecciones <span className="text-primary italic">Curadas</span>
                            </h2>
                            <p className="text-gray-500 text-base md:text-lg font-medium">
                                Artículos diseñados para mejorar tu calidad de vida diario.
                            </p>
                        </div>
                        <Link href="/productos" className="hidden md:flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:text-primary transition-colors">
                            Ver todo <span className="text-base">→</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {categories.map((category, index) => (
                            <Link
                                key={category.id}
                                href={`/productos?categoria=${encodeURIComponent(category.name)}`}
                                className="group relative h-[250px] md:h-[400px] overflow-hidden rounded-3xl border border-gray-100 shadow-sm transition-all duration-500"
                            >
                                {/* Category Image */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={category.image || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2070&auto=format&fit=crop"}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        priority={index < 3}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
                                    <h3 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight">
                                        {category.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        Explorar →
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Collections Section */}
                {collections && collections.length > 0 && (
                    <section className="bg-gray-900 py-16 overflow-hidden border-y border-white/5">
                        <div className="container mx-auto px-4 mb-12 text-center">
                            <span className="text-secondary font-bold uppercase tracking-widest text-[10px] mb-3 inline-block opacity-80">Selección Exclusiva</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Nuestras <span className="italic text-secondary">Colecciones</span></h2>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 px-4 max-w-7xl mx-auto">
                            {collections.map((coll) => {
                                // 1. Buscamos productos vinculados a esta colección
                                const collectionProducts = allProducts.filter(p =>
                                    p.isActive !== false &&
                                    ((coll.productIds || []).includes(p.id) ||
                                        p.collections?.includes(coll.id) ||
                                        p.collections?.includes(coll.slug))
                                );

                                // 2. Selección de imagen inteligente
                                let displayImage = "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop"; // Placeholder premium

                                if (coll.image && !coll.image.includes('icon.png')) {
                                    // Imagen manual subida por el admin
                                    displayImage = coll.image;
                                } else if (collectionProducts.length > 0) {
                                    // Imagen del primer producto de LA colección
                                    displayImage = collectionProducts[0].image;
                                }

                                return (
                                    <Link
                                        key={coll.id}
                                        href={`/coleccion/${coll.slug}`}
                                        className={`group relative flex-grow min-w-[280px] h-[400px] md:h-[500px] rounded-3xl overflow-hidden transition-all duration-500 ${coll.isFeatured ? 'flex-[1.5] lg:flex-[2] ring-1 ring-secondary/30 ring-offset-4 ring-offset-gray-900' : 'flex-1 opacity-90 hover:opacity-100'}`}
                                    >
                                        <Image
                                            src={displayImage}
                                            alt={coll.name}
                                            fill
                                            className="object-cover transition-transform duration-[4000ms] group-hover:scale-105"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t ${coll.isFeatured ? 'from-gray-950 via-gray-950/40 to-transparent' : 'from-black/90 via-transparent to-transparent'}`} />

                                        <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 flex flex-col justify-end h-full text-white">
                                            {coll.isFeatured && (
                                                <span className="bg-secondary text-gray-900 w-fit px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest mb-3">
                                                    ★ Oferta Especial
                                                </span>
                                            )}
                                            <h3 className={`font-bold tracking-tight leading-tight ${coll.isFeatured ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                                                {coll.name}
                                            </h3>

                                            {coll.discountType !== 'none' && (
                                                <div className="mt-4 flex items-center gap-3">
                                                    <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest">
                                                        {coll.discountType === 'percentage' ? `${coll.discountValue}% OFF` : `$${coll.discountValue} OFF`}
                                                    </span>
                                                </div>
                                            )}

                                            <p className="text-gray-300 mt-4 font-medium max-w-sm line-clamp-2 text-sm">
                                                {coll.description}
                                            </p>
                                            <div className="mt-6 flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-[9px] transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                Ver colección <span>→</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Featured Products */}
                <section className="bg-gray-50/50 py-16 md:py-24 rounded-3xl md:rounded-[3rem] mx-2 md:mx-4">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6 text-center sm:text-left">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                                    Solo <span className="text-primary italic">Lo Mejor</span>
                                </h2>
                                <p className="text-gray-400 font-medium mt-2 text-sm">Productos que están marcando tendencia esta semana.</p>
                            </div>
                            <Link
                                href="/productos"
                                className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                                Ver Catálogo Completo
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="h-full">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

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
