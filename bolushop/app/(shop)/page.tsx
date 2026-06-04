import { getAllProducts, getAllCategories, getAllCollections, getAllPosts } from "@/lib/db";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Truck, CreditCard, Shield, Gift, Home, Zap, Gamepad2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Regalos Originales y Hogar | BoluShop Argentina",
    description: "Regalos originales y accesorios para el hogar de Argentina. Envío gratis, cuotas sin interés, compra protegida.",
    keywords: "regalos originales, hogar, accesorios, argentina"
};

export default async function HomePage() {
    const allProducts = await getAllProducts();
    const activeProducts = allProducts.filter(p => p.isActive !== false && p.price > 0);
    const featuredProducts = activeProducts.slice(0, 4);
    const mlProducts = activeProducts.filter(p => p.isMlReferral).slice(0, 3);
    const allPosts = await getAllPosts();
    const recentPosts = allPosts.filter(p => p.isPublished).slice(0, 3);

    const categories = [
        { id: 1, name: 'Organización del hogar', icon: Home },
        { id: 2, name: 'Regalos originales', icon: Gift },
        { id: 3, name: 'Cocina y comedor', icon: '🍳' },
        { id: 4, name: 'Gadgets tech', icon: Zap },
        { id: 5, name: 'Juegos y entretenimiento', icon: Gamepad2 },
    ];

    return (
        <>
            <Header />

            <main className="min-h-screen">
                {/* HERO SECTION */}
                <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2044] via-[#152d5d] to-[#1a3a6b] text-white py-10 md:py-20 px-4 md:px-6 rounded-[2rem] shadow-2xl shadow-black/20">
                    <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-[#e8630a]/30 blur-3xl" />
                    <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#34d399]/25 blur-3xl" />
                    <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
                        {/* Left side - Text */}
                        <div className="flex-1 max-w-2xl">
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
                                <span className="text-[10px] uppercase tracking-[0.35em] text-[#f9e5c1] font-bold">✨ Nueva temporada 2026</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight md:leading-[1.01] tracking-tight">
                                Regalos originales y<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] to-[#fb923c]">accesorios para tu hogar</span><br />
                                en Argentina
                            </h1>
                            <p className="text-sm md:text-base text-[#d1d5db] mb-8 max-w-xl leading-relaxed">
                                Productos curados con envío gratis a todo el país.<br />
                                Pagá en cuotas sin interés. Devolución en 30 días.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                                <Link href="/productos" className="inline-flex items-center justify-center rounded-full bg-[#f59e0b] px-6 py-3 text-sm font-bold text-[#0f172a] shadow-lg shadow-[#f59e0b]/30 transition hover:scale-[1.01] hover:bg-[#fbbf24]">
                                    Ver ofertas del día
                                </Link>
                                <Link href="/colecciones" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                                    Colecciones
                                </Link>
                            </div>
                        </div>

                        {/* Right side - Product Image */}
                        <div className="hidden lg:flex flex-1 justify-end">
                            <div className="relative w-72 h-72 rounded-[2rem] bg-white/10 border border-white/20 shadow-2xl shadow-black/20 backdrop-blur-xl overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.12),transparent_55%)]" />
                                {featuredProducts[0] ? (
                                    <Image
                                        src={featuredProducts[0].image}
                                        alt="Featured"
                                        fill
                                        className="object-contain p-8"
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>

                {/* TRUST BAR */}
                <section className="bg-[#f8f9fb] border-b border-[#e2e8f0] py-4 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-12 text-[9px] md:text-xs text-[#64748b]">
                            <div className="flex items-center gap-2">
                                <Truck size={16} className="text-[#0f2044]" />
                                <span>Envíos a todo el país — OCA / Andreani</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-2">
                                <Shield size={16} className="text-[#0f2044]" />
                                <span>Compra 100% protegida</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2">
                                <CreditCard size={16} className="text-[#0f2044]" />
                                <span>Hasta 12 cuotas sin interés</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CATEGORIES */}
                <section className="py-12 md:py-16 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-baseline mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-[#0f2044]">
                                Explorá por <span className="text-[#e8630a]">categoría</span>
                            </h2>
                            <Link href="/productos" className="text-xs text-[#0f2044] font-bold hover:underline">
                                Ver todo →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="bg-[#f8f9fb] border border-[#e2e8f0] rounded-lg p-3 md:p-4 text-center hover:border-[#0f2044] transition-colors cursor-pointer"
                                >
                                    <div className="text-2xl md:text-3xl mb-2">
                                        {typeof cat.icon === 'string' ? cat.icon : <cat.icon size={24} className="mx-auto text-[#0f2044]" />}
                                    </div>
                                    <p className="text-[9px] md:text-xs font-medium text-[#1e293b]">{cat.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FEATURED PRODUCTS */}
                <section className="py-12 md:py-16 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-baseline mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-[#0f2044]">
                                Más vendidos <span className="text-[#e8630a]">esta semana</span>
                            </h2>
                            <Link href="/productos" className="text-xs text-[#0f2044] font-bold hover:underline">
                                Ver catálogo →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* MERCADO LIBRE SECTION */}
                {mlProducts.length > 0 && (
                    <section className="bg-[#fff9e6] border-t border-[#f0c040] border-b py-12 md:py-16 px-4 md:px-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <h2 className="text-xl md:text-2xl font-bold text-[#0f2044]">Recomendados en</h2>
                                    <span className="bg-[#f0c040] text-[#7a4f00] text-xs font-bold px-3 py-1 rounded-md">Mercado Libre</span>
                                </div>
                                <p className="text-[9px] md:text-xs text-[#8a6500] flex items-center gap-2">
                                    <span>ℹ️</span>
                                    <span>Links de afiliado — si comprás a través de estos links podemos recibir una comisión sin costo adicional para vos.</span>
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {mlProducts.map(product => (
                                    <a
                                        key={product.id}
                                        href={product.mlAffiliateUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white border border-[#f0d080] rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <span className="inline-block bg-[#fff9e6] text-[#c47a00] text-[9px] font-bold px-2 py-1 rounded mb-3 border border-[#f0c040]">
                                            Selección ML
                                        </span>
                                        <h3 className="text-xs font-bold text-[#0f2044] mb-2 line-clamp-2">{product.name}</h3>
                                        <p className="text-sm font-bold text-[#0f2044] mb-2">${product.price.toLocaleString('es-AR')}</p>
                                        <p className="text-[9px] text-[#8a6500] font-medium">↗ Ver en Mercado Libre</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* BLOG SECTION */}
                {recentPosts.length > 0 && (
                    <section className="bg-[#f8f9fb] py-12 md:py-16 px-4 md:px-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex justify-between items-baseline mb-8">
                                <h2 className="text-xl md:text-2xl font-bold text-[#0f2044]">
                                    Del <span className="text-[#e8630a]">blog</span> — guías y recomendaciones
                                </h2>
                                <Link href="/blog" className="text-xs text-[#0f2044] font-bold hover:underline">
                                    Ver todos →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {recentPosts.map(post => (
                                    <Link key={post.id} href={`/blog/${post.slug}`} className="card overflow-hidden hover:shadow-md transition-shadow group">
                                        <div className="h-32 bg-[#eef3fb] flex items-center justify-center">
                                            {post.image && (
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    width={200}
                                                    height={200}
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                                                />
                                            )}
                                        </div>
                                        <div className="p-3 md:p-4">
                                            <span className="text-[9px] bg-[#e6f1fb] text-[#185fa5] px-2 py-1 rounded inline-block mb-2 font-bold">
                                                {post.category}
                                            </span>
                                            <h3 className="text-xs font-bold text-[#0f2044] line-clamp-2 mb-1">{post.title}</h3>
                                            <p className="text-[9px] text-[#64748b]">{post.author || 'BoluShop'}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </>
    );
}
