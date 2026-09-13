import { getAllCategories, getAllPosts, getAllProducts, getSettings } from "@/lib/db";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Box, House, Lightbulb, Sparkles, Tag, UserRound } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { transformImageUrl } from "@/lib/images";

export const metadata = buildPageMetadata({
    title: "Regalos originales y hogar en Argentina",
    description: "Una selección de objetos útiles, regalos originales y detalles para hacer más lindo tu espacio.",
    path: "/",
    keywords: ["regalos originales argentina", "hogar", "objetos útiles", "BoluShop"],
});

export default async function HomePage() {
    const [allProducts, allPosts, categories, settings] = await Promise.all([getAllProducts(), getAllPosts(), getAllCategories(), getSettings()]);
    const products = allProducts.filter((product) => product.isActive !== false && product.price > 0);
    const recentProducts = products.slice(0, 8);
    const recentPosts = allPosts.filter((post) => post.isPublished).slice(0, 3);
    const categoryNames = Array.from(new Set(products.map((product) => product.category))).sort();
    const heroProduct = products[0];
    const categoryIcons: Record<string, typeof House> = { Hogar: House, Organización: Box, Oficina: UserRound, Baño: Sparkles, Varios: Tag };

    return (
        <main className="new-home">
            <section className="new-home-hero">
                <div className="container-shop new-home-hero-grid">
                    <div className="new-home-copy">
                        <p className="new-eyebrow"><span /> Objetos para vivir mejor</p>
                        <h1>Pequeñas cosas.<br /><em>Gran diferencia.</em></h1>
                        <p className="new-home-lead">Regalos originales, detalles para tu casa y productos que resuelven lo cotidiano sin perder el estilo.</p>
                        <div className="new-home-actions">
                            <Link href="/productos" className="new-primary-button">Explorar tienda <ArrowUpRight size={17} /></Link>
                            <Link href="/ofertas" className="new-text-link">Ver ofertas <span>↗</span></Link>
                        </div>
                        <div className="new-home-note"><span className="new-note-avatars"><i /><i /><i /></span><span>{products.length} productos activos para descubrir</span></div>
                    </div>
                    {heroProduct && (
                        <div className="new-hero-stage">
                            <div className="new-hero-sticker new-sticker-top">Elegido<br /><b>para vos</b></div>
                            <div className="new-hero-product-card">
                                <div className="new-hero-image"><Image src={transformImageUrl(heroProduct.image)} alt={heroProduct.name} fill priority sizes="(max-width: 900px) 80vw, 42vw" /></div>
                                <div className="new-hero-product-bottom"><span>Producto destacado</span><strong>${heroProduct.price.toLocaleString("es-AR")}</strong></div>
                            </div>
                            <div className="new-hero-sticker new-sticker-bottom">Bolu<br />Shop<span>✳</span></div>
                        </div>
                    )}
                </div>
            </section>

            <section className="new-category-strip">
                <div className="container-shop">
                    <div className="new-section-heading compact"><div><p className="new-eyebrow"><span /> Entrá por donde quieras</p><h2>Encontrá tu próximo favorito</h2></div><Link href="/productos" className="new-round-link" aria-label="Ver todos los productos"><ArrowUpRight size={20} /></Link></div>
                    <div className="new-category-grid">
                        {categoryNames.map((category) => { const Icon = categoryIcons[category] || Sparkles; return <Link href={`/categoria/${category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} key={category} className="new-category-card"><span className="new-category-icon"><Icon size={22} /></span><span>{category}</span><ArrowUpRight size={16} /></Link>; })}
                    </div>
                </div>
            </section>

            <section className="new-product-section">
                <div className="container-shop">
                    <div className="new-section-heading"><div><p className="new-eyebrow"><span /> La selección de hoy</p><h2>Elegidos para tu casa</h2></div><Link href="/productos" className="new-text-link">Ver todo <span>↗</span></Link></div>
                    <div className="new-product-grid">{recentProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
                </div>
            </section>

            <section className="new-values-band">
                <div className="container-shop new-values-grid">
                    <div><p className="new-eyebrow light"><span /> Sin vueltas</p><h2>Elegí algo lindo.<br /><em>Lo demás, fácil.</em></h2></div>
                    <div className="new-value-list"><div><Sparkles size={21} /><span><b>Selección curada</b><small>Menos ruido, mejores hallazgos.</small></span></div><div><Box size={21} /><span><b>Compra simple</b><small>Todo claro antes de pagar.</small></span></div><div><Tag size={21} /><span><b>{settings.isFreeShippingEnabled ? "Envío vigente" : "Envío según zona"}</b><small>Las condiciones aparecen en checkout.</small></span></div></div>
                </div>
            </section>

            {recentPosts.length > 0 && <section className="new-journal-section"><div className="container-shop"><div className="new-section-heading"><div><p className="new-eyebrow"><span /> Ideas y guías</p><h2>Para inspirarte</h2></div><Link href="/blog" className="new-text-link">Ver blog <span>↗</span></Link></div><div className="new-journal-grid">{recentPosts.map((post) => <Link href={`/blog/${post.slug}`} key={post.id} className="new-journal-card"><div className="new-journal-image">{post.image ? <Image src={transformImageUrl(post.image)} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" /> : <div>✳</div>}</div><div><small>{post.category || "Guía"}</small><h3>{post.title}</h3><span>Leer artículo ↗</span></div></Link>)}</div></div></section>}

            <section className="new-final-cta"><div className="container-shop"><p className="new-eyebrow light"><span /> Tu próxima compra</p><h2>Algo te estaba<br /><em>esperando.</em></h2><Link href="/productos" className="new-primary-button">Ver la tienda <ArrowUpRight size={17} /></Link></div></section>
        </main>
    );
}
