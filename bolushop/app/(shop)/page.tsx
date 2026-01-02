import { getFeaturedProducts } from "@/app/actions/shop";
import { getAllProducts } from "@/lib/db";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import type { Metadata } from "next";

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
    const featuredProducts = await getFeaturedProducts();
    const allProducts = await getAllProducts();

    // Get unique categories
    const categories = Array.from(new Set(allProducts.filter(p => p.isActive !== false).map(p => p.category)));

    return (
        <>
            <Header />

            <main>
                {/* Hero Section with Video Background */}
                <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/videohero.mp4" type="video/mp4" />
                    </video>

                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

                    <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                            Tu Marketplace <span className="text-primary italic">Premium</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 font-medium text-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                            Calidad, confianza y envíos rápidos a todo Argentina 🇦🇷
                        </p>
                        <Link
                            href="/productos"
                            className="inline-block px-10 py-5 bg-primary text-white rounded-full font-black text-lg uppercase tracking-widest hover:scale-110 transition-transform shadow-2xl shadow-primary/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
                        >
                            Ver Productos
                        </Link>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="container mx-auto px-4 py-16">
                    <h2 className="text-4xl font-black text-center mb-12">
                        Explorá por <span className="text-primary italic">Categoría</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.slice(0, 8).map((category) => (
                            <Link
                                key={category}
                                href={`/productos?categoria=${encodeURIComponent(category)}`}
                                className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-[2rem] p-8 text-center hover:from-primary hover:to-primary/80 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-xl"
                            >
                                <div className="text-5xl mb-4">📦</div>
                                <h3 className="font-black text-gray-900 group-hover:text-white transition-colors">
                                    {category}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Featured Products */}
                <section className="bg-gray-50 py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-4xl font-black">
                                Productos <span className="text-primary italic">Destacados</span>
                            </h2>
                            <Link
                                href="/productos"
                                className="px-6 py-3 bg-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg"
                            >
                                Ver Todos →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust Badges */}
                <section className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-8">
                            <div className="text-6xl mb-4">🚚</div>
                            <h3 className="text-xl font-black mb-2">Envíos a Todo el País</h3>
                            <p className="text-gray-600">Llegamos a todos los rincones de Argentina</p>
                        </div>
                        <div className="p-8">
                            <div className="text-6xl mb-4">💳</div>
                            <h3 className="text-xl font-black mb-2">Pago Seguro</h3>
                            <p className="text-gray-600">Mercado Pago - Todas las formas de pago</p>
                        </div>
                        <div className="p-8">
                            <div className="text-6xl mb-4">✨</div>
                            <h3 className="text-xl font-black mb-2">Calidad Garantizada</h3>
                            <p className="text-gray-600">Productos seleccionados con los mejores estándares</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
