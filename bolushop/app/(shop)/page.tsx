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
    const featuredProducts = allProducts.filter(p => p.isActive !== false).slice(0, 8);

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
                <section className="container mx-auto px-4 py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-black mb-4">
                            Explorá por <span className="text-primary italic">Categoría</span>
                        </h2>
                        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">
                            Encontrá exactamente lo que necesitás para tu hogar y oficina con nuestra selección curada.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/productos?categoria=${encodeURIComponent(category.name)}`}
                                className="group relative h-[350px] overflow-hidden rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-500"
                            >
                                {/* Category Image */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={category.image || "https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=2070&auto=format&fit=crop"}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
                                    <h3 className="text-3xl font-black mb-2 transform transition-transform duration-500 group-hover:-translate-y-2">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-300 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        {category.description}
                                    </p>
                                    <div className="mt-6 flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                        Explorar colección
                                        <span className="text-xl">→</span>
                                    </div>
                                </div>
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

                {/* <Newsletter /> */}
            </main>

            <Footer />
        </>
    );
}
