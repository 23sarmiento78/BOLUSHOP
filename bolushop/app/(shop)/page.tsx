import { getAllProducts, getAllCategories, getAllCollections, getAllPosts } from "@/lib/db";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import TrustBadge from "@/components/shop/TrustBadge";
import NewsletterForm from "@/components/shop/NewsletterForm";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getCurrentHoliday } from "@/lib/holidays";
import HolidayCountdown from "@/components/shop/HolidayCountdown";

export const metadata: Metadata = {
    title: "Regalos Originales Argentina | BoluShop: Tecnología y Bazar Online",
    description: "La tienda #1 de regalos originales en Argentina. Encontrá los mejores gadgets tecnológicos, artículos de bazar premium y curiosidades con envío gratis y cuotas.",
    keywords: "regalos originales argentina, tienda de regalos online, gadgets tecnológicos, bazar premium argentina, comprar regalos curiosos"
};

export default async function HomePage() {
    const allProducts = await getAllProducts();
    const activeProducts = allProducts.filter(p => p.isActive !== false && p.price > 0);
    const collections = await getAllCollections();
    const holiday = getCurrentHoliday();

    // Segregate products as per user request: ML only in specific sections
    const featuredProducts = activeProducts.filter(p => !p.isMlReferral).slice(0, 8);
    const mlProducts = activeProducts.filter(p => p.isMlReferral).slice(0, 4);

    const allPosts = await getAllPosts();
    const recentPosts = allPosts.filter(p => p.isPublished).slice(0, 3);

    return (
        <>
            <Header />

            <main className="min-h-screen relative">
                {/* GLOBAL HOLIDAY ATMOSPHERE */}
                {holiday && (
                    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03]" style={{ background: `linear-gradient(to bottom, ${holiday.colors.primary}, transparent)` }} />
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute text-4xl animate-pulse opacity-20"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animationDuration: `${5 + Math.random() * 10}s`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`,
                                    color: i % 2 === 0 ? holiday.colors.primary : holiday.colors.secondary
                                }}
                            >
                                {holiday.icon}
                            </div>
                        ))}
                    </div>
                )}

                {/* HERO SECTION */}
                <section className="relative text-white overflow-hidden z-10" style={{ background: holiday ? `linear-gradient(to right, ${holiday.colors.primary}, ${holiday.colors.secondary})` : 'linear-gradient(to right, #2d3436, #000000)' }}>
                    {holiday?.image ? (
                        <>
                            <Image src={holiday.image} alt={holiday.label} fill className="object-cover opacity-60 mix-blend-overlay" priority unoptimized />
                            <div className={`absolute inset-0 bg-gradient-to-r ${holiday.colors.gradient} opacity-90 mix-blend-multiply`} />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    )}

                    <div className="container mx-auto px-6 py-20 md:py-32 flex flex-col-reverse md:flex-row items-center gap-12 relative z-10">
                        <div className="w-full md:w-1/2 text-center md:text-left">
                            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest mb-6">
                                {holiday ? `${holiday.icon} ${holiday.label}` : '✨ Nueva Temporada 2026'}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-[1.1] tracking-tight">
                                {holiday ? (
                                    <>
                                        {holiday.message.split('!')[0]}! <br />
                                        <span className="opacity-90">{holiday.message.split('!')[1] || 'Regalos Únicos'}</span>
                                    </>
                                ) : (
                                    <>
                                        Regalos Originales <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe600] to-yellow-200">
                                            & Tecnología en Argentina
                                        </span>
                                    </>
                                )}
                            </h1>
                            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto md:mx-0 font-medium">
                                {holiday ? `Celebrá ${holiday.label.split('(')[0]} con la mejor selección de regalos.` : 'Descubrí una selección curada de productos únicos.'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link href="/productos" className="px-8 py-4 bg-white text-black hover:bg-gray-100 rounded-xl font-bold text-sm transition-all shadow-lg" style={holiday ? { color: holiday.colors.primary } : {}}>
                                    Ver Ofertas {holiday ? 'Especiales' : 'del Día'}
                                </Link>
                                <Link href="/colecciones" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-sm transition-all backdrop-blur-sm">
                                    Colecciones {holiday ? 'Temáticas' : 'VIP'}
                                </Link>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 relative">
                            <div className="relative aspect-square md:aspect-[4/3] w-full max-w-lg mx-auto bg-white/10 rounded-3xl border border-white/20 p-6 backdrop-blur-md -rotate-2 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                                {featuredProducts[0] && (
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white">
                                        <Image src={featuredProducts[0].image} alt="Hero Product" fill className="object-contain p-4" priority />
                                        <div className="absolute top-4 right-4 text-black font-black text-xs px-3 py-1 rounded shadow-sm" style={{ backgroundColor: holiday ? holiday.colors.secondary : '#ffe600', color: holiday ? '#fff' : '#000' }}>
                                            DESTACADO
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* COUNTDOWN SECTION (Holiday Only) */}
                {holiday && <HolidayCountdown holiday={holiday} />}

                {/* COLLECTIONS SHOWCASE */}
                <section className="relative z-10 py-16 md:py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Explora Nuestras Colecciones</span>
                                <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                                {holiday ? (
                                    <>Especial <span style={{ color: holiday.colors.primary }}>{holiday.label} {holiday.icon}</span></>
                                ) : (
                                    <>Colecciones de <span className="italic text-primary">Regalos Originales</span></>
                                )}
                            </h2>
                            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                                Combinaciones perfectas seleccionadas por nuestro equipo
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8">
                            {collections.slice(0, 3).map((coll, i) => (
                                <Link
                                    href={`/colecciones#${coll.slug}`}
                                    key={coll.id}
                                    className="group relative h-[450px] w-full md:w-[calc(33.333%-2rem)] max-w-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                                >
                                    {/* Background Image */}
                                    <Image
                                        src={coll.image || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070'}
                                        alt={coll.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        unoptimized
                                    />

                                    {/* Gradient Overlay */}
                                    <div
                                        className="absolute inset-0 transition-opacity duration-500"
                                        style={{
                                            background: holiday
                                                ? `linear-gradient(to bottom, ${holiday.colors.primary}00, ${holiday.colors.primary}99)`
                                                : 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.8))'
                                        }}
                                    />

                                    {/* Content */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                        <div className="transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                                            <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                                                {coll.name}
                                            </h3>
                                            <p className="text-white/90 text-sm font-medium mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                {coll.description || 'Descubre esta colección exclusiva'}
                                            </p>
                                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                                <span>Ver Colección</span>
                                                <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Discount Badge */}
                                    {coll.discountValue && coll.discountValue > 0 && (
                                        <div
                                            className="absolute top-4 right-4 px-4 py-2 rounded-full font-black text-xs uppercase shadow-lg"
                                            style={{
                                                backgroundColor: holiday ? holiday.colors.secondary : '#D4AF37',
                                                color: '#000'
                                            }}
                                        >
                                            {coll.discountType === 'percentage' ? `-${coll.discountValue}%` : `$${coll.discountValue}`}
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* View All Link */}
                        <div className="text-center mt-12">
                            <Link
                                href="/colecciones"
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-gray-200 hover:border-gray-900 font-bold text-sm uppercase tracking-wider transition-all hover:bg-gray-900 hover:text-white"
                            >
                                Ver Todas las Colecciones
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* TRENDING PRODUCTS */}
                <section className="relative z-10 py-16 transition-colors duration-500" style={{ backgroundColor: holiday ? `${holiday.colors.secondary}10` : '#f8f9fa' }}>
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                                    {holiday ? (
                                        <span className="flex items-center gap-3">
                                            {holiday.icon} Picks de {holiday.label}
                                        </span>
                                    ) : "Tendencias en Tecnología y Regalos"}
                                </h2>
                                <p className="text-gray-500 font-medium">Los productos más buscados de la semana.</p>
                            </div>
                            <Link href="/productos" className="px-6 py-2 rounded-full border border-gray-200 font-bold text-sm hover:bg-black hover:text-white transition-all">
                                Ver Catálogo Completo
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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

                {/* MERCADO LIBRE SPECIAL SECTION */}
                {mlProducts.length > 0 && (
                    <section className="relative z-10 py-16 md:py-24 bg-white">
                        <div className="container mx-auto px-4">
                            <div className="bg-[#FFE600] rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-yellow-500/10 border border-yellow-200 overflow-hidden relative">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50" />

                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                                        <div className="max-w-xl text-center md:text-left">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest mb-4">
                                                <span>🚀 Envío Directo</span>
                                                <span className="opacity-50">|</span>
                                                <span>Compra Protegida</span>
                                            </div>
                                            <h2 className="text-4xl md:text-5xl font-black text-[#2D3277] mb-4 tracking-tight leading-tight">
                                                Imperdibles de <br />
                                                <span className="text-blue-600">Mercado Libre</span>
                                            </h2>
                                            <p className="text-[#2D3277]/70 font-medium text-lg">
                                                Seleccionados por BoluShop. Compra en ML con nuestra recomendación y recibí en tiempo récord.
                                            </p>
                                        </div>
                                        <Link href="/productos?seccion=mercado-libre" className="px-10 py-4 bg-[#2D3277] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 active:scale-95">
                                            Ver Todo Recomendados
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {mlProducts.map((product) => (
                                            <div key={product.id} className="h-full transform hover:-translate-y-2 transition-all duration-300">
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* BLOG PREVIEW SECTION */}
                {recentPosts.length > 0 && (
                    <section className="relative z-10 py-24 bg-white overflow-hidden">
                        <div className="container mx-auto px-6">
                            <div className="flex justify-between items-end mb-16">
                                <div className="max-w-xl">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">Contenido & Insights</span>
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
                                        Explora nuestro <br />
                                        <span className="italic text-primary">Lifestyle Blog</span>
                                    </h2>
                                </div>
                                <Link
                                    href="/blog"
                                    className="hidden md:flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-gray-100 font-black text-[10px] uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all"
                                >
                                    Ir al Blog ↗
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {recentPosts.map((post) => (
                                    <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                                        <div className="relative h-[400px] md:h-[450px] rounded-[2.5rem] overflow-hidden mb-8 shadow-sm border border-gray-100">
                                            {post.image && (
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80"></div>
                                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">{post.category}</span>
                                                <h3 className="text-2xl font-black text-white leading-tight group-hover:translate-x-2 transition-transform duration-500">{post.title}</h3>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-12 md:hidden">
                                <Link href="/blog" className="flex items-center justify-center p-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest">
                                    Ver todo el Blog
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* NEWSLETTER SECTION */}
                <section className="relative z-10 container mx-auto px-4 py-16">
                    <NewsletterForm />
                </section>

                {/* TRUST BADGES */}
                <section className="relative z-10 container mx-auto px-6 py-16 md:py-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <TrustBadge
                            icon="🚚"
                            title={holiday ? `Envíos para regalar` : 'Envíos Flash'}
                            description={holiday ? `Llega a tiempo para ${holiday.label}. Envío gratis en todo el país.` : 'Procesamos tu pedido en menos de 24hs. Envío gratis en todo el país.'}
                        />
                        <TrustBadge
                            icon="🔒"
                            title="Compra Segura"
                            description="Pagá en cuotas sin interés con Mercado Pago. Tus datos están 100% protegidos."
                        />
                        <TrustBadge
                            icon="✨"
                            title="Garantía de Felicidad"
                            description="Si el regalo no gusta, tenés 30 días para devolverlo. Sin preguntas."
                        />
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
