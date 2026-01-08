import { getAllProducts, getAllCategories } from "@/lib/db";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Newsletter from "@/components/shop/Newsletter";

export const metadata: Metadata = {
    title: "BoluShop | Tu Marketplace de Confianza en Argentina",
    description: "Descubrí los mejores productos con envío a todo el país. Calidad garantizada, precios increíbles y atención personalizada.",
    keywords: "marketplace, tienda online, argentina, compras, envíos gratis, productos, calidad",
    openGraph: {
        title: "BoluShop - Tu Marketplace de Confianza",
        description: "Los mejores productos con envío a todo Argentina",
        type: "website",
    },
};

export default async function HomePage() {
    const allProducts = await getAllProducts();
    const categories = await getAllCategories();
    // Prioritize products that are active and have essential data
    const featuredProducts = allProducts
        .filter(p => p.isActive !== false && p.price > 0)
        .slice(0, 8);

    return (
        <>
            <Header />

            <main className="min-h-screen">
                {/* Hero Section with Video/Image Background */}
                <section className="relative h-[85vh] md:h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
                    {/* Background Video with Poster to prevent CLS */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="/hero-fallback.jpg" // You should create this image or I will generate one
                        className="absolute inset-0 w-full h-full object-cover scale-105"
                    >
                        <source src="/videohero.mp4" type="video/mp4" />
                    </video>

                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

                    <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto pt-10">
                        <span className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 animate-in fade-in slide-in-from-top-4 duration-1000">
                            Nueva Colección 2026
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700">
                            Estilo Que <br />
                            <span className="text-primary italic">Inspira</span>
                        </h1>
                        <p className="text-lg md:text-2xl mb-12 font-medium text-gray-200/90 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                            Elevá tu hogar con piezas exclusivas elegidas para durar. Envíos flash a todo el país.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            <Link
                                href="/productos"
                                className="w-full sm:w-auto px-12 py-5 bg-primary text-white rounded-full font-black text-sm uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-primary/40"
                            >
                                Explorar Tienda
                            </Link>
                            <Link
                                href="/rastreo"
                                className="w-full sm:w-auto px-8 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                            >
                                Mi Pedido 🚚
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Infinite Product Marquee */}
                <section className="bg-gray-50/30 py-24 overflow-hidden border-y border-gray-100">
                    <div className="container mx-auto px-4 mb-12 text-center">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-4">Nuestras Joyas</h3>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Selección <span className="italic text-primary">Premium</span></h2>
                    </div>

                    <div className="flex animate-marquee whitespace-nowrap">
                        {[...allProducts, ...allProducts].slice(0, 20).map((product, i) => (
                            <div key={i} className="mx-6 flex flex-col items-center gap-6 group cursor-default">
                                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden bg-white shadow-xl shadow-gray-200/50 border border-gray-100 group-hover:scale-105 transition-all duration-700">
                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute bottom-8 left-8 right-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <p className="text-white font-black text-xl tracking-tight leading-tight">{product.name}</p>
                                        <p className="text-primary font-bold mt-1">${product.price.toLocaleString('es-AR')}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Catalog Request Section */}
                <section className="container mx-auto px-4 py-20">
                    <div className="bg-gray-900 rounded-[4rem] p-12 md:p-24 relative overflow-hidden group border border-white/5">
                        <div className="absolute top-0 right-0 w-full md:w-2/3 h-full opacity-40 md:opacity-30 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent z-10" />
                            <Image
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                                alt="Shopping"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-[5000ms]"
                            />
                        </div>
                        <div className="relative z-20 max-w-2xl">
                            <span className="inline-block px-6 py-2 bg-secondary/10 backdrop-blur-xl border border-secondary/20 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-secondary mb-8">
                                Servicio Exclusivo
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-[1.1]">
                                ¿No encontrás <br /> lo que buscás? <br />
                                <span className="text-secondary italic">Solicitá el catálogo</span>
                            </h2>
                            <p className="text-gray-100 text-xl md:text-2xl font-medium mb-14 max-w-xl leading-relaxed opacity-90">
                                Tenemos más de <span className="text-white font-black underline decoration-secondary/50 underline-offset-4">500 productos exclusivos</span> que no están publicados. Hablá con nosotros y recibí el PDF actualizado al instante.
                            </p>
                            <a
                                href="https://wa.me/3541237972?text=Hola!%20Me%20interesaría%20solicitar%20el%20catálogo%20completo%20de%20BoluShop."
                                target="_blank"
                                className="group/btn relative inline-flex items-center gap-6 px-12 py-6 bg-primary text-white rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 overflow-hidden"
                            >
                                <span className="relative z-10">📱 Solicitar Catálogo VIP</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Categories Section - Improved Mobile Grid */}
                <section className="container mx-auto px-4 py-10 md:py-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                                Selecciones <span className="text-primary italic">Curadas</span>
                            </h2>
                            <p className="text-gray-500 text-lg md:text-xl font-medium">
                                Artículos diseñados para mejorar tu calidad de vida diario. Encontrá la pieza perfecta.
                            </p>
                        </div>
                        <Link href="/productos" className="hidden md:flex items-center gap-2 font-black uppercase tracking-widest text-sm text-gray-400 hover:text-primary transition-colors">
                            Ver todas las categorías <span className="text-xl">→</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {categories.map((category, index) => (
                            <Link
                                key={category.id}
                                href={`/productos?categoria=${encodeURIComponent(category.name)}`}
                                className="group relative h-[300px] md:h-[450px] overflow-hidden rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-700"
                            >
                                {/* Category Image - Added Priority for first 2 images */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={category.image || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2070&auto=format&fit=crop"}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        priority={index < 2}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:via-black/40" />
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white">
                                    <div className="transform transition-all duration-500 group-hover:-translate-y-4">
                                        <h3 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-300 font-medium line-clamp-2 md:line-clamp-none opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 text-sm md:text-base">
                                            {category.description}
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] md:text-xs opacity-0 md:group-hover:opacity-100 transition-all duration-500 delay-100">
                                        Ver Colección
                                        <span className="text-xl">→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Featured Products - Performance Optimized */}
                <section className="bg-gray-50/50 py-24 md:py-32 rounded-[3rem] md:rounded-[5rem] mx-0 md:mx-4">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6 text-center sm:text-left">
                            <div>
                                <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                                    Solo <span className="text-primary italic">Lo Mejor</span>
                                </h2>
                                <p className="text-gray-400 font-medium mt-2">Productos que están marcando tendencia esta semana.</p>
                            </div>
                            <Link
                                href="/productos"
                                className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-100 text-gray-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl shadow-gray-200/50"
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

                {/* Trust Badges - Optimized for Mobile */}
                <section className="container mx-auto px-6 py-24 md:py-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
                        <div className="group text-center">
                            <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                🚚
                            </div>
                            <h3 className="text-2xl font-black mb-4 tracking-tight">Envíos Flash</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Procesamos tu pedido en menos de 24hs. Envío gratis a todo Argentina en compras mayores a $30.000.
                            </p>
                        </div>
                        <div className="group text-center">
                            <div className="w-20 h-20 bg-secondary/10 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                                🔒
                            </div>
                            <h3 className="text-2xl font-black mb-4 tracking-tight">Compra Segura</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Usamos Mercado Pago para garantizar que tus datos estén 100% protegidos. Pagá en cuotas sin interés.
                            </p>
                        </div>
                        <div className="group text-center">
                            <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                ✨
                            </div>
                            <h3 className="text-2xl font-black mb-4 tracking-tight">Garantía Real</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Si no te gusta el producto, tenés 30 días para devolverlo. Sin preguntas ni vueltas.
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
