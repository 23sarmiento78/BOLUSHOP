"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/lib/types";
import { addToCart } from "@/lib/cart";

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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.vercel.app';

    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.image,
        "description": product.description,
        "sku": product.id,
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
            "seller": {
                "@type": "Organization",
                "name": "BoluShop"
            }
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <Header />

            <main className="min-h-screen bg-white">
                <div className="container mx-auto px-4 py-12">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary">Inicio</Link>
                        <span>/</span>
                        <Link href="/productos" className="hover:text-primary">Productos</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-bold">{product.name}</span>
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
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                                {product.category}
                            </p>

                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                                {product.name}
                            </h1>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-5xl font-black text-primary">
                                        ${product.price.toLocaleString('es-AR')}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 font-bold">+ Costo de envío (se calcula en el checkout)</p>
                            </div>

                            <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {product.features && product.features.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="font-black text-lg mb-4">Características:</h3>
                                    <ul className="space-y-2">
                                        {product.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <span className="text-primary text-xl">✓</span>
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div className="mb-8">
                                {product.stock > 0 ? (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <span className="text-2xl">✓</span>
                                        <span className="font-bold">
                                            {product.stock > 10 ? 'En stock' : `Últimas ${product.stock} unidades`}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-600">
                                        <span className="text-2xl">✕</span>
                                        <span className="font-bold">Sin stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Quantity & Add to Cart */}
                            {product.stock > 0 && (
                                <div className="flex gap-4 mb-8">
                                    <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-6 py-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="text-2xl font-black text-gray-600 hover:text-primary transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="text-xl font-black w-12 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="text-2xl font-black text-gray-600 hover:text-primary transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isAdding}
                                        className={`flex-grow py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${isAdding
                                            ? 'bg-green-500 text-white scale-105'
                                            : 'bg-primary text-white hover:scale-105 shadow-xl shadow-primary/30'
                                            }`}
                                    >
                                        {isAdding ? '✓ Agregado al Carrito' : '🛒 Agregar al Carrito'}
                                    </button>
                                </div>
                            )}

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="text-3xl mb-2">🚚</div>
                                    <p className="text-xs font-bold text-gray-600">Envío a todo el país</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-2">💳</div>
                                    <p className="text-xs font-bold text-gray-600">Pago seguro</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-2">✨</div>
                                    <p className="text-xs font-bold text-gray-600">Calidad garantizada</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <section className="py-12 border-t border-gray-200">
                            <h2 className="text-3xl font-black mb-8">
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
