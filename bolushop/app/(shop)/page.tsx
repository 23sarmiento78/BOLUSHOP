import { getAllProducts, getAllCategories, getAllPosts } from "@/lib/db";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/seo";
import {
    Truck, Shield, CreditCard, Gift, Home, Zap, Gamepad2,
    ArrowRight, Sparkles, Star, RefreshCw,
} from "lucide-react";

export const metadata = buildPageMetadata({
    title: "Regalos Originales y Hogar en Argentina",
    description:
        "Descubrí regalos originales y accesorios para el hogar en BoluShop. Envío gratis a todo el país, cuotas sin interés y compra 100% protegida. ¡Sorprendé hoy!",
    path: "/",
    keywords: [
        "regalos originales argentina",
        "accesorios hogar",
        "tienda online regalos",
        "envio gratis",
        "bolushop",
    ],
});

export default async function HomePage() {
    const allProducts = await getAllProducts();
    const activeProducts = allProducts.filter((p) => p.isActive !== false && p.price > 0);
    const featuredProducts = activeProducts.slice(0, 8);
    const mlProducts = activeProducts.filter((p) => p.isMlReferral).slice(0, 3);
    const heroProduct = featuredProducts[0];
    const allPosts = await getAllPosts();
    const recentPosts = allPosts.filter((p) => p.isPublished).slice(0, 3);
    const categories = await getAllCategories();

    const getCategoryIcon = (slug: string) => {
        const icons: Record<string, typeof Home> = { hogar: Home, regalos: Gift, tech: Zap, juegos: Gamepad2 };
        const Icon = icons[slug] || Gift;
        return <Icon size={24} />;
    };

    return (
        <div className="min-h-screen">
            {/* HERO */}
            <section className="hero-mesh text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#ff6b35] rounded-full blur-[120px]" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#f5c842] rounded-full blur-[150px]" />
                </div>

                <div className="container-shop relative py-16 md:py-24 lg:py-28">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="animate-fade-up">
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-6 text-xs font-medium text-white/80">
                                <Sparkles size={14} className="text-[#f5c842]" />
                                Nueva temporada 2026
                            </div>

                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.08] mb-6"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                Regalos que{" "}
                                <span className="text-gradient">sorprenden</span>
                                <br />
                                para tu hogar
                            </h1>

                            <p className="text-base md:text-lg text-white/65 max-w-lg mb-8 leading-relaxed">
                                Productos curados con envío gratis a todo Argentina.
                                Pagá en cuotas sin interés. Devolución en 30 días.
                            </p>

                            <div className="flex flex-wrap gap-3 mb-10">
                                <Link href="/productos" className="btn btn-primary">
                                    Ver catálogo
                                    <ArrowRight size={16} />
                                </Link>
                                <Link href="/ofertas" className="btn btn-outline !text-white !border-white/30 hover:!bg-white/10">
                                    Ofertas
                                </Link>
                            </div>

                            <div className="flex gap-8 text-center">
                                {[
                                    { value: "500+", label: "Productos" },
                                    { value: "4.9★", label: "Valoración" },
                                    { value: "24hs", label: "Envío rápido" },
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <div className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                                            {stat.value}
                                        </div>
                                        <div className="text-[11px] text-white/45 uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {heroProduct && (
                            <div className="hidden lg:block animate-float">
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-gradient-to-br from-[#ff6b35]/20 to-[#f5c842]/10 rounded-[2rem] blur-2xl" />
                                    <div className="relative bg-white/10 backdrop-blur-xl border border-white/15 rounded-[2rem] p-8 shadow-2xl">
                                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 mb-5">
                                            <Image
                                                src={heroProduct.image}
                                                alt={heroProduct.name}
                                                fill
                                                className="object-contain p-6"
                                                priority
                                            />
                                        </div>
                                        <div className="flex items-center gap-1 text-[#f5c842] mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill="currentColor" />
                                            ))}
                                            <span className="text-white/50 text-xs ml-2">Destacado</span>
                                        </div>
                                        <h2 className="text-lg font-semibold text-white mb-2 truncate-2" style={{ fontFamily: "var(--font-display)" }}>
                                            {heroProduct.name}
                                        </h2>
                                        <p className="text-2xl font-bold text-[#ff6b35]" style={{ fontFamily: "var(--font-display)" }}>
                                            ${heroProduct.price.toLocaleString("es-AR")}
                                        </p>
                                        <Link
                                            href={`/producto/${heroProduct.slug}`}
                                            className="mt-4 btn btn-primary w-full text-sm"
                                        >
                                            Ver producto
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* TRUST BAR */}
            <section className="bg-white border-b border-[#e8e4df] py-5">
                <div className="container-shop">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs md:text-sm text-[#64748b]">
                        {[
                            { icon: Truck, text: "Envío a todo el país" },
                            { icon: Shield, text: "Compra protegida" },
                            { icon: CreditCard, text: "Cuotas sin interés" },
                            { icon: RefreshCw, text: "Devolución 30 días" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center justify-center gap-2">
                                <Icon size={16} className="text-[#ff6b35] flex-shrink-0" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="section-padding">
                <div className="container-shop">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[#94a3b8] mb-2">Explorá</p>
                            <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                                Por <span className="text-gradient">categoría</span>
                            </h2>
                        </div>
                        <Link href="/productos" className="text-sm font-semibold text-[#0a1628] hover:text-[#ff6b35] flex items-center gap-1 transition-colors">
                            Ver todo <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {(categories.length > 0 ? categories.slice(0, 5) : [
                            { slug: "hogar", name: "Hogar" },
                            { slug: "regalos", name: "Regalos" },
                            { slug: "cocina", name: "Cocina" },
                            { slug: "tech", name: "Tech" },
                            { slug: "juegos", name: "Juegos" },
                        ]).map((cat, i) => (
                            <Link
                                key={cat.slug}
                                href={`/categoria/${cat.slug}`}
                                className={`group text-center p-6 rounded-2xl border transition-all hover:-translate-y-1 ${
                                    i === 0
                                        ? "bg-[#0a1628] text-white border-[#0a1628] shadow-lg"
                                        : "bg-white border-[#e8e4df] hover:border-[#ff6b35]/30 hover:shadow-md"
                                }`}
                            >
                                <div className={`mx-auto mb-3 w-12 h-12 rounded-xl flex items-center justify-center ${
                                    i === 0 ? "bg-white/10 text-[#ff6b35]" : "bg-[#faf9f7] text-[#0a1628]"
                                }`}>
                                    {getCategoryIcon(cat.slug)}
                                </div>
                                <span className={`text-sm font-medium ${i === 0 ? "text-white" : "text-[#0a1628]"}`}>
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="section-padding bg-white">
                <div className="container-shop">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[#94a3b8] mb-2">Selección</p>
                            <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                                Más vendidos <span className="text-gradient">esta semana</span>
                            </h2>
                        </div>
                        <Link href="/productos" className="text-sm font-semibold text-[#0a1628] hover:text-[#ff6b35] flex items-center gap-1">
                            Catálogo <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ML SECTION */}
            {mlProducts.length > 0 && (
                <section className="section-padding bg-[#fff8e6] border-y border-[#f0c040]/40">
                    <div className="container-shop">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="text-2xl font-semibold text-[#0a1628]" style={{ fontFamily: "var(--font-display)" }}>
                                    Recomendados en
                                </h2>
                                <span className="badge-ml text-xs font-bold px-3 py-1">Mercado Libre</span>
                            </div>
                            <p className="text-sm text-[#9a6b00]">
                                Links de afiliado — comisión sin costo extra para vos.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {mlProducts.map((product) => (
                                <a
                                    key={product.id}
                                    href={product.mlAffiliateUrl}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    className="group block bg-white rounded-2xl border border-[#f0c040]/50 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                                >
                                    <span className="badge-ml text-[10px] mb-3 inline-block">Selección ML</span>
                                    <h3 className="font-semibold text-[#0a1628] truncate-2 mb-3" style={{ fontFamily: "var(--font-display)" }}>
                                        {product.name}
                                    </h3>
                                    <p className="text-xl font-bold text-[#0a1628] mb-2">
                                        ${product.price.toLocaleString("es-AR")}
                                    </p>
                                    <span className="text-sm text-[#9a6b00] font-medium group-hover:underline">
                                        Ver en Mercado Libre →
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* BLOG */}
            {recentPosts.length > 0 && (
                <section className="section-padding">
                    <div className="container-shop">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-[#94a3b8] mb-2">Blog</p>
                                <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                                    Guías y <span className="text-gradient">recomendaciones</span>
                                </h2>
                            </div>
                            <Link href="/blog" className="text-sm font-semibold text-[#0a1628] hover:text-[#ff6b35] flex items-center gap-1">
                                Ver blog <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {recentPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="group card overflow-hidden"
                                >
                                    <div className="h-48 bg-[#f5f3f0] overflow-hidden relative">
                                        {post.image && (
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                    </div>
                                    <div className="p-5">
                                        {post.category && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff6b35] mb-2 block">
                                                {post.category}
                                            </span>
                                        )}
                                        <h3 className="font-semibold text-[#0a1628] truncate-2 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                                            {post.title}
                                        </h3>
                                        <p className="text-xs text-[#94a3b8]">{post.author || "BoluShop"}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="hero-mesh py-16 md:py-20">
                <div className="container-shop text-center">
                    <h2
                        className="text-3xl md:text-4xl font-semibold text-white mb-4"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        ¿Listo para sorprender?
                    </h2>
                    <p className="text-white/60 mb-8 max-w-md mx-auto">
                        Explorá nuestro catálogo completo con envío gratis y la mejor selección de regalos.
                    </p>
                    <Link href="/productos" className="btn btn-primary text-base px-8">
                        Explorar productos
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
