"use client";

import { useState } from "react";
import Image from "next/image";
import { transformImageUrl } from "@/lib/images";
import ProductCard from "@/components/shop/ProductCard";
import { Product, Review } from "@/lib/types";
import { addToCart } from "@/lib/cart";
import { Truck, ShieldCheck, Sparkles } from "lucide-react";
import ProductReviews from "@/components/shop/ProductReviews";
import Link from "next/link";

interface Props {
    product: Product;
    relatedProducts: Product[];
    reviews: Review[];
    categoryHref?: string;
}

export default function ProductDetailClient({ product, relatedProducts, reviews, categoryHref }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const imageSources = [product.image, ...(product.images || [])].filter(Boolean).reduce<string[]>((acc, image) => {
        if (!acc.includes(image)) acc.push(image);
        return acc;
    }, []);
    const [activeImage, setActiveImage] = useState(imageSources[0]);

    const getImageAlt = (index: number) => {
        if (index === 0) return `${product.name} - vista frontal`;
        if (index === 1) return `${product.name} - vista lateral`;
        if (index === 2) return `${product.name} - detalle`;
        return `${product.name} - vista adicional ${index + 1}`;
    };

    const activeImageIndex = imageSources.findIndex((img) => img === activeImage);
    const activeImageAlt = getImageAlt(activeImageIndex === -1 ? 0 : activeImageIndex);

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart(product, quantity);
        setTimeout(() => {
            setIsAdding(false);
        }, 1500);
    };

    const cleanDescription = product.description.replace(/<[^>]*>?/gm, '').trim();
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
        : 5;

    return (
            <main className="min-h-screen bg-[#faf9f7]">
                <section className="hero-mesh text-white py-10 md:py-14">
                    <div className="container-shop">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                            <div className="max-w-2xl">
                                {categoryHref ? (
                                    <Link href={categoryHref} className="text-xs uppercase tracking-[0.3em] text-[#ff6b35] hover:text-white transition-colors mb-2 inline-block">
                                        {product.category}
                                    </Link>
                                ) : (
                                    <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1] mb-2">{product.category}</p>
                                )}
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{product.name}</h1>
                                <p className="mt-4 text-sm md:text-base text-[#dbeafe] max-w-2xl leading-7">{cleanDescription}</p>
                            </div>

                            <div className="rounded-[2rem] bg-white/10 border border-white/20 p-5 md:p-8 text-sm space-y-3">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[#f8fafb] text-xs uppercase tracking-[0.3em] font-black">
                                    <Sparkles size={16} /> Destacado
                                </div>
                                <p className="leading-relaxed text-[#e2e8f0]">Envío gratis a todo Argentina y compra protegida por BoluShop.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="container-shop py-12 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_0.95fr] gap-10">
                        <div className="space-y-10">
                            <div className="rounded-[2rem] border border-[#e2e8f0] bg-[#f8f9fb] p-6 md:p-8">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    <div className="lg:w-[48%]">
                                        <div className="relative w-full overflow-hidden rounded-[2rem] bg-white shadow-card aspect-[4/3] max-h-[520px] md:max-h-[560px]">
                                            <Image
                                                src={transformImageUrl(activeImage)}
                                                alt={activeImageAlt}
                                                fill
                                                className="object-contain p-4"
                                                priority
                                                sizes="(max-width: 1024px) 100vw, 48vw"
                                            />
                                        </div>

                                        {(imageSources.length > 1) && (
                                            <div className="mt-4 grid grid-cols-4 gap-3">
                                                {imageSources.map((img, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => setActiveImage(img)}
                                                        className={`relative rounded-2xl overflow-hidden h-20 aspect-square border transition ${activeImage === img ? 'border-[#0f2044] shadow-lg shadow-[#0f2044]/10' : 'border-[#e2e8f0]'}`}
                                                    >
                                                        <Image src={transformImageUrl(img)} alt={getImageAlt(idx)} fill className="object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="lg:w-[45%] flex flex-col justify-between gap-6">
                                        <div className="space-y-5">
                                            <div className="flex flex-wrap gap-3">
                                                <span className="badge">{product.category || 'Regalo'}</span>
                                                {product.isMlReferral && <span className="badge-ml">Mercado Libre</span>}
                                            </div>
                                            <h2 className="text-3xl font-bold text-[#0f2044]">{product.name}</h2>
                                            <p className="text-sm text-[#64748b] leading-relaxed">{cleanDescription}</p>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-3xl bg-white border border-[#e2e8f0] p-4">
                                                <p className="text-xs uppercase tracking-[0.3em] text-[#64748b] mb-2">Stock</p>
                                                <p className={`font-bold ${product.stock > 0 ? 'text-[#0f2044]' : 'text-orange-600'}`}>{product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}</p>
                                            </div>
                                            <div className="rounded-3xl bg-white border border-[#e2e8f0] p-4">
                                                <p className="text-xs uppercase tracking-[0.3em] text-[#64748b] mb-2">Envío</p>
                                                <p className="font-bold text-[#0f2044]">Gratis a todo el país</p>
                                            </div>
                                        </div>

                                        <div className="rounded-3xl bg-white border border-[#e2e8f0] p-5 space-y-4">
                                            <div className="flex items-center justify-between text-sm text-[#64748b]">
                                                <span>Precio</span>
                                                <span className="font-black text-[#0f2044]">$ {product.price.toLocaleString('es-AR')}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-[#10b981] font-bold">
                                                <span>3 cuotas sin interés</span>
                                                <span>$ {(product.price / 3).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-[#e2e8f0] bg-white p-8">
                                <h2 className="text-2xl font-bold text-[#0f2044] mb-4">Detalles rápidos</h2>
                                <div className="grid gap-4 text-sm text-[#64748b]">
                                    <div className="flex justify-between border-b border-[#e2e8f0] pb-3">
                                        <span className="font-semibold text-[#0f2044]">Marca</span>
                                        <span>BoluShop</span>
                                    </div>
                                    <div className="flex justify-between border-b border-[#e2e8f0] pb-3">
                                        <span className="font-semibold text-[#0f2044]">Categoría</span>
                                        <span>{product.category || 'Regalos'}</span>
                                    </div>
                                    <div className="flex justify-between pb-3">
                                        <span className="font-semibold text-[#0f2044]">Condición</span>
                                        <span>Nuevo</span>
                                    </div>
                                </div>
                            </div>

                            {product.features && product.features.length > 0 && (
                                <div className="rounded-[2rem] border border-[#e2e8f0] bg-[#f8f9fb] p-8">
                                    <h2 className="text-2xl font-bold text-[#0f2044] mb-6">Especificaciones</h2>
                                    <p className="text-sm text-[#64748b] leading-7 mb-6">
                                        {`${product.name} es una opción ideal para quienes buscan ${product.category ? product.category.toLowerCase() : 'productos de calidad'} con diseño práctico y acabados confiables. Perfecto para usar todos los días o regalar en ocasiones especiales. Disfrutá de envío gratis y pago en cuotas sin interés.`}
                                    </p>
                                    <div className="grid gap-3">
                                        {product.features.map((feature, index) => {
                                            const [label, value] = feature.includes(':') ? feature.split(/:(.*)/s) : ['Detalle', feature];
                                            return (
                                                <div key={index} className="rounded-3xl bg-white border border-[#e2e8f0] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <span className="text-xs uppercase tracking-[0.3em] text-[#64748b] font-bold">{label.trim()}</span>
                                                    <span className="text-sm font-medium text-[#0f2044]">{value.trim()}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="rounded-[2rem] border border-[#e2e8f0] bg-white p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="rounded-3xl bg-[#f0f9ff] p-3 text-[#185fa5]"><Truck size={20} /></div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#0f2044]">Envío rápido y seguro</h3>
                                        <p className="text-sm text-[#64748b]">Recibí tu pedido en 1-5 días hábiles según tu zona.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-3xl bg-[#ecfdf5] p-3 text-[#10b981]"><ShieldCheck size={20} /></div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#0f2044]">Compra protegida</h3>
                                        <p className="text-sm text-[#64748b]">Te ayudamos hasta que recibas tu producto correcto o gestionamos tu devolución.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-[#e2e8f0] bg-white p-8">
                                <h2 className="text-2xl font-bold text-[#0f2044] mb-6">Opiniones</h2>
                                <ProductReviews productId={product.id} />
                            </div>
                        </div>

                        <aside className="w-full lg:w-auto">
                            <div className="sticky top-24 space-y-6">
                                <div className="rounded-[2rem] border border-[#e2e8f0] bg-white p-8 shadow-card">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-xs uppercase tracking-[0.3em] text-[#64748b]">Tu compra</span>
                                        <span className="text-sm text-[#10b981] font-bold">{product.stock > 0 ? 'Disponible' : 'Agotado'}</span>
                                    </div>
                                    <div className="mb-6">
                                        <div className="text-xl font-black text-[#0f2044]">$ {product.price.toLocaleString('es-AR')}</div>
                                        <div className="text-sm text-[#64748b] mt-2">3 cuotas de ${(product.price / 3).toLocaleString('es-AR', { maximumFractionDigits: 2 })} sin interés</div>
                                    </div>

                                    <div className="rounded-3xl bg-[#f8f9fb] p-4 border border-[#e2e8f0] mb-6">
                                        <div className="flex items-center gap-2 text-sm text-[#64748b] mb-3">
                                            <span className="font-bold text-[#0f2044]">Cantidad</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="h-12 w-12 rounded-2xl border border-[#e2e8f0] bg-white text-[#0f2044] font-black"
                                            >-</button>
                                            <span className="text-lg font-bold text-[#0f2044]">{quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="h-12 w-12 rounded-2xl border border-[#e2e8f0] bg-white text-[#0f2044] font-black"
                                            >+</button>
                                        </div>
                                    </div>

                                    {product.isMlReferral ? (
                                        <button
                                            type="button"
                                            onClick={() => window.open(product.mlAffiliateUrl, '_blank')}
                                            className="w-full rounded-3xl bg-[#fff9e6] text-[#2d3277] font-bold py-4 transition hover:bg-[#fff3c5]"
                                        >
                                            Comprar seguro en Mercado Libre
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <button
                                                type="button"
                                                onClick={handleAddToCart}
                                                disabled={isAdding}
                                                className={`w-full rounded-3xl py-4 text-sm font-bold transition ${isAdding ? 'bg-[#10b981] text-white' : 'bg-[#e8630a] text-white hover:bg-[#d55708]'}`}
                                            >
                                                {isAdding ? '¡Agregado!' : 'Agregar al carrito'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleAddToCart}
                                                className="w-full rounded-3xl py-4 text-sm font-bold text-[#0f2044] bg-[#f8f9fb] hover:bg-[#eef6ff] transition"
                                            >
                                                Comprar ahora
                                            </button>
                                        </div>
                                    )}

                                    <div className="mt-6 rounded-3xl bg-[#f8fafc] border border-[#e2e8f0] p-4 text-sm text-[#64748b]">
                                        <p className="font-bold text-[#0f2044] mb-2">Protección BoluShop</p>
                                        <p>Si no recibís tu pedido en tiempo, te asistimos hasta resolverlo.</p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {relatedProducts.length > 0 && (
                        <section className="mt-14">
                            <h2 className="text-2xl font-bold text-[#0f2044] mb-6">Productos relacionados</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((item) => (
                                    <ProductCard key={item.id} product={item} />
                                ))}
                            </div>
                        </section>
                    )}
                </section>
            </main>
    );
}

