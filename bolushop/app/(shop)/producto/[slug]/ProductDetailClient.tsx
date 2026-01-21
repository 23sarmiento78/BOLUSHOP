"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/lib/types";
import { addToCart } from "@/lib/cart";
import { Truck, ShieldCheck } from "lucide-react";
import ProductReviews from "@/components/shop/ProductReviews";

interface Props {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart(product, quantity);
        setTimeout(() => {
            setIsAdding(false);
        }, 1500);
    };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com';
    const cleanDescription = product.description
        .replace(/<[^>]*>?/gm, '')
        .replace(/\s+/g, ' ')
        .trim();

    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.image,
        "description": cleanDescription,
        "sku": product.id,
        "category": product.category,
        "brand": {
            "@type": "Brand",
            "name": "BoluShop"
        },
        "offers": {
            "@type": "Offer",
            "url": `${siteUrl}/producto/${product.slug}`,
            "priceCurrency": "ARS",
            "price": product.price,
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
                "@type": "Organization",
                "name": "BoluShop"
            }
        }
    };

    const breadcrumbsJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": siteUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Productos",
                "item": `${siteUrl}/productos`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": product.name,
                "item": `${siteUrl}/producto/${product.slug}`
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
            />
            <Header />

            <main className="min-h-screen bg-white pt-28 pb-12">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-xs text-gray-400">
                        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                        <span className="opacity-30">/</span>
                        <Link href="/productos" className="hover:text-primary transition-colors">Productos</Link>
                        <span className="opacity-30">/</span>
                        <span className="text-gray-900 font-semibold">{product.name}</span>
                    </div>

                    {/* Product Detail */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                        {/* Image */}
                        <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-gray-50 shadow-2xl">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {product.category}
                                </span>
                                <div className="flex items-center gap-1 text-sun-yellow">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className="text-lg">★</span>
                                    ))}
                                    <span className="text-gray-400 text-xs font-bold ml-2">(+50 ventas)</span>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tighter">
                                {product.name}
                            </h1>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                {/* Left: Description & Features */}
                                <div className="lg:col-span-2 space-y-10">
                                    <div className="prose prose-gray max-w-none">
                                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                            {product.description}
                                        </p>
                                    </div>

                                    {product.features && product.features.length > 0 && (
                                        <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100">
                                            <h3 className="font-bold text-lg mb-6 flex items-center gap-3">
                                                <span className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs">✓</span>
                                                Características Principales
                                            </h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {product.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start gap-3 group text-sm">
                                                        <div className="mt-1.5 w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                                        <span className="text-gray-600 font-medium">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Purchase Card */}
                                <div className="lg:col-span-1">
                                    <div className="sticky top-32 bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-black/5">
                                        <div className="mb-6">
                                            <div className="flex items-baseline gap-1.5 mb-2">
                                                <span className="text-xs font-bold text-primary">$</span>
                                                <span className="text-4xl font-bold text-gray-900 tracking-tight">
                                                    {product.price.toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                            <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-wider flex items-center gap-2">
                                                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                                Envío Gratis
                                            </p>
                                        </div>

                                        {product.stock > 0 ? (
                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Cantidad</label>
                                                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1.5 px-3 border border-gray-100">
                                                        <button
                                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                            className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-400 hover:text-primary"
                                                        >−</button>
                                                        <span className="font-bold text-base">{quantity}</span>
                                                        <button
                                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                            className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-400 hover:text-primary"
                                                        >+</button>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={handleAddToCart}
                                                    disabled={isAdding}
                                                    className={`w-full py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all duration-300 shadow-lg ${isAdding
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-primary text-white hover:bg-gold-accent shadow-primary/10'
                                                        }`}
                                                >
                                                    {isAdding ? '¡Agregado!' : 'Comprar Ahora'}
                                                </button>

                                                <div className="space-y-4 pt-6 border-t border-gray-50">
                                                    <div className="flex items-center gap-4 group">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                                                            <Truck size={20} />
                                                        </div>
                                                        <div className="text-xs">
                                                            <p className="font-black text-gray-900">Envío 100% Gratis</p>
                                                            <p className="text-gray-400 font-bold italic">"Sin costos ocultos, vivas donde vivas"</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 group">
                                                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 transition-transform group-hover:scale-110">
                                                            <ShieldCheck size={20} />
                                                        </div>
                                                        <div className="text-xs">
                                                            <p className="font-black text-gray-900">Compra Protegida</p>
                                                            <p className="text-gray-400 font-bold">12 meses de garantía</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100">
                                                <p className="text-red-600 font-black uppercase tracking-widest text-xs">Agotado Temporalmente</p>
                                                <p className="text-red-400 text-[10px] mt-1 font-bold">Te avisaremos cuando vuelva</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <ProductReviews productId={product.id} />
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <section className="py-12 border-t border-gray-100">
                            <h2 className="text-2xl font-bold mb-8">
                                Productos <span className="text-primary italic">Relacionados</span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
