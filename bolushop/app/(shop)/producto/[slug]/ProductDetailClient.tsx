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
    const [activeImage, setActiveImage] = useState(product.image);

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

                    {/* Product Detail Layout */}
                    {/* Modern E-commerce Layout (MercadoLibre Style) */}
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                        {/* LEFT COLUMN: Gallery, Description, Reviews */}
                        <div className="flex-1 w-full lg:w-[65%] xl:w-[70%]">

                            {/* 1. Gallery Section */}
                            <div className="flex flex-col md:flex-row gap-6 mb-16">
                                {/* Thumbnails (Desktop: Left Vertical, Mobile: Hidden/Bottom) */}
                                {(product.images && product.images.length > 0) && (
                                    <div className="hidden md:flex flex-col gap-3 min-w-[70px]">
                                        <button
                                            onMouseEnter={() => setActiveImage(product.image)}
                                            className={`relative w-[70px] h-[70px] rounded-xl overflow-hidden border-2 transition-all ${activeImage === product.image ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-200'}`}
                                        >
                                            <Image src={product.image} alt="Main" fill className="object-cover" />
                                        </button>
                                        {product.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onMouseEnter={() => setActiveImage(img)}
                                                className={`relative w-[70px] h-[70px] rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-200'}`}
                                            >
                                                <Image src={img} alt={`View ${idx}`} fill className="object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Main Image Stage */}
                                <div className="flex-grow">
                                    <div className="relative aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden bg-white hover:bg-gray-50/50 transition-colors cursor-zoom-in">
                                        <Image
                                            src={activeImage}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-2 hover:scale-110 transition-transform duration-500"
                                            priority
                                            sizes="(max-width: 1024px) 100vw, 70vw"
                                        />
                                    </div>

                                    {/* Mobile Thumbnails Row */}
                                    {(product.images && product.images.length > 0) && (
                                        <div className="flex md:hidden gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                                            <button
                                                onClick={() => setActiveImage(product.image)}
                                                className={`flex-shrink-0 relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === product.image ? 'border-primary' : 'border-transparent bg-gray-50'}`}
                                            >
                                                <Image src={product.image} alt="Main" fill className="object-cover" />
                                            </button>
                                            {product.images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveImage(img)}
                                                    className={`flex-shrink-0 relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-transparent bg-gray-50'}`}
                                                >
                                                    <Image src={img} alt={`View ${idx}`} fill className="object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 2. Description & Specs */}
                            <div className="border-t border-gray-100 pt-10 mb-12">
                                <h3 className="text-2xl font-black text-gray-900 mb-8">Descripción</h3>
                                <div className="prose prose-lg prose-gray max-w-none mb-12">
                                    <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-line">
                                        {product.description}
                                    </p>
                                </div>

                                {product.features && product.features.length > 0 && (
                                    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
                                        <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
                                            <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Características Técnicas</h4>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            {product.features.map((feature, index) => {
                                                // Try to split feature by ":" to simulate key-value pairs if possible
                                                const [label, value] = feature.includes(':') ? feature.split(/:(.*)/s) : ['Característica', feature];
                                                return (
                                                    <div key={index} className="flex flex-col sm:flex-row sm:items-center px-8 py-4 hover:bg-gray-50/50 transition-colors">
                                                        <span className="w-1/3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 sm:mb-0">{value ? label.trim() : '•'}</span>
                                                        <span className="w-2/3 text-sm font-medium text-gray-900">{value ? value.trim() : label.trim()}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 3. Reviews (Ahora abajo a la izquierda) */}
                            <div className="border-t border-gray-100 pt-10">
                                <h3 className="text-2xl font-black text-gray-900 mb-8">Opiniones del producto</h3>
                                <ProductReviews productId={product.id} />
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Sticky Buy Box */}
                        <div className="w-full lg:w-[35%] xl:w-[30%]">
                            <div className="sticky top-28 bg-white border border-gray-200 rounded-[2rem] p-6 lg:p-8 shadow-2xl shadow-gray-200/50">
                                <div className="mb-4 text-xs font-medium text-gray-400">
                                    {product.stock > 0 ? 'Nuevo  |  +100 vendidos' : 'Sin Stock'}
                                </div>

                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex text-primary text-sm">★★★★★</div>
                                    <span className="text-xs text-gray-400 font-medium">(4.9)</span>
                                </div>

                                <div className="mb-8">
                                    <span className="text-4xl font-light text-gray-900">$ {product.price.toLocaleString('es-AR')}</span>
                                    <p className="text-emerald-600 font-bold text-xs mt-2">
                                        en 3x $ {(product.price / 3).toLocaleString('es-AR', { maximumFractionDigits: 2 })} sin interés
                                    </p>
                                    <p className="text-emerald-600 font-bold text-xs mt-1 flex items-center gap-1">
                                        <Truck size={14} /> Envío gratis a todo el país
                                    </p>
                                </div>

                                {product.stock > 0 ? (
                                    <div className="space-y-4">
                                        {/* Stock Alert */}
                                        {product.stock < 5 && (
                                            <p className="text-orange-600 text-xs font-bold bg-orange-50 px-3 py-1.5 rounded-lg w-fit">
                                                ¡Última disponible!
                                            </p>
                                        )}

                                        <button
                                            onClick={handleAddToCart}
                                            disabled={isAdding}
                                            className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 ${isAdding
                                                ? 'bg-green-500 text-white'
                                                : 'bg-primary text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20'}`}
                                        >
                                            {isAdding ? '¡Agregado!' : 'Comprar ahora'}
                                        </button>

                                        <button
                                            onClick={handleAddToCart}
                                            className="w-full py-4 rounded-xl font-bold text-sm text-primary bg-blue-50 hover:bg-blue-100 transition-colors"
                                        >
                                            Agregar al carrito
                                        </button>

                                        <div className="pt-6 space-y-3">
                                            <div className="flex gap-3 text-xs text-gray-500">
                                                <ShieldCheck size={16} className="text-gray-400 flex-shrink-0" />
                                                <p><span className="text-primary font-bold">Compra Protegida</span>, recibí el producto que esperabas o te devolvemos tu dinero.</p>
                                            </div>
                                            <div className="flex gap-3 text-xs text-gray-500">
                                                <span className="text-gray-400 flex-shrink-0">🏆</span>
                                                <p><span className="text-primary font-bold">MercadoLíder Platinum</span>, ¡es uno de los mejores del sitio!</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 p-4 rounded-xl text-center">
                                        <p className="font-bold text-gray-500 text-sm">Publicación pausada</p>
                                    </div>
                                )}
                            </div>
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
