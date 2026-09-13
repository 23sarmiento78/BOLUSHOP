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
    isFreeShipping?: boolean;
}

export default function ProductDetailClient({ product, relatedProducts, reviews, categoryHref, isFreeShipping = false }: Props) {
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
        if (product.stock <= 0) return;
        setIsAdding(true);
        addToCart(product, quantity);
        setTimeout(() => setIsAdding(false), 1500);
    };

    const handleBuyNow = () => {
        if (product.stock <= 0) return;
        addToCart(product, quantity);
        window.location.href = "/checkout";
    };

    const cleanDescription = product.description.replace(/<[^>]*>?/gm, '').trim();
    return (
            <main className="min-h-screen bg-[#f4f4ed]">
                <section className="hero-mesh text-white py-10 md:py-14">
                    <div className="container-shop">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                            <div className="max-w-2xl">
                                {categoryHref ? (
                                    <Link href={categoryHref} className="text-xs uppercase tracking-[0.3em] text-[#c8f31d] hover:text-white transition-colors mb-2 inline-block">
                                        {product.category}
                                    </Link>
                                ) : (
                                    <p className="text-xs uppercase tracking-[0.3em] text-[#d7d9cf] mb-2">{product.category}</p>
                                )}
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{product.name}</h1>
                                <p className="mt-4 text-sm md:text-base text-[#dbeafe] max-w-2xl leading-7">{cleanDescription}</p>
                            </div>

                            <div className="rounded-[2rem] bg-white/10 border border-white/20 p-5 md:p-8 text-sm space-y-3">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[#eef0e8] text-xs uppercase tracking-[0.3em] font-black">
                                    <Sparkles size={16} /> Destacado
                                </div>
                                <p className="leading-relaxed text-[#deded4]">{isFreeShipping ? 'Envío gratis a todo Argentina.' : 'Envío calculado según tu zona.'} Atención personalizada durante tu compra.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="container-shop py-10 md:py-14">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_0.95fr] gap-10">
                        <div className="space-y-10">
                            <div className="rounded-[1.75rem] border border-[#deded4] bg-white p-4 md:p-6 shadow-sm">
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
                                                        aria-label={`Ver imagen ${idx + 1} de ${imageSources.length}`}
                                                        aria-pressed={activeImage === img}
                                                        className={`relative rounded-2xl overflow-hidden h-20 aspect-square border transition ${activeImage === img ? 'border-[#11110f] shadow-lg shadow-[#11110f]/10' : 'border-[#deded4]'}`}
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
                                            <h2 className="text-2xl font-semibold text-[#11110f] md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>{product.name}</h2>
                                            <p className="text-sm text-[#6d726a] leading-relaxed">{cleanDescription}</p>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-3xl bg-white border border-[#deded4] p-4">
                                                <p className="text-xs uppercase tracking-[0.3em] text-[#6d726a] mb-2">Stock</p>
                                                <p className={`font-bold ${product.stock > 0 ? 'text-[#11110f]' : 'text-orange-600'}`}>{product.stock > 0 ? 'Disponible' : 'Agotado'}</p>
                                            </div>
                                            <div className="rounded-3xl bg-white border border-[#deded4] p-4">
                                                <p className="text-xs uppercase tracking-[0.3em] text-[#6d726a] mb-2">Envío</p>
                                                <p className="font-bold text-[#11110f]">{isFreeShipping ? 'Gratis a todo el país' : 'Según tu zona'}</p>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl bg-[#f4f4ed] border border-[#deded4] p-5 space-y-4">
                                            <div className="flex items-center justify-between text-sm text-[#6d726a]">
                                                <span>Precio</span>
                                                <span className="font-black text-[#11110f]">$ {product.price.toLocaleString('es-AR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[1.75rem] border border-[#deded4] bg-white p-6 md:p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-[#11110f] mb-4">Detalles rápidos</h2>
                                <div className="grid gap-4 text-sm text-[#6d726a]">
                                    <div className="flex justify-between border-b border-[#deded4] pb-3">
                                        <span className="font-semibold text-[#11110f]">Marca</span>
                                        <span>BoluShop</span>
                                    </div>
                                    <div className="flex justify-between border-b border-[#deded4] pb-3">
                                        <span className="font-semibold text-[#11110f]">Categoría</span>
                                        <span>{product.category || 'Regalos'}</span>
                                    </div>
                                    <div className="flex justify-between pb-3">
                                        <span className="font-semibold text-[#11110f]">Condición</span>
                                        <span>Nuevo</span>
                                    </div>
                                </div>
                            </div>

                            {product.features && product.features.length > 0 && (
                                <div className="rounded-[2rem] border border-[#deded4] bg-[#eef0e8] p-8">
                                    <h2 className="text-2xl font-bold text-[#11110f] mb-6">Especificaciones</h2>
                                    <p className="text-sm text-[#6d726a] leading-7 mb-6">
                                        {`${product.name} es una opción ideal para quienes buscan ${product.category ? product.category.toLowerCase() : 'productos de calidad'} con diseño práctico y acabados confiables. Perfecto para usar todos los días o regalar en ocasiones especiales.`}
                                    </p>
                                    <div className="grid gap-3">
                                        {product.features.map((feature, index) => {
                                            const [label, value] = feature.includes(':') ? feature.split(/:(.*)/s) : ['Detalle', feature];
                                            return (
                                                <div key={index} className="rounded-3xl bg-white border border-[#deded4] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <span className="text-xs uppercase tracking-[0.3em] text-[#6d726a] font-bold">{label.trim()}</span>
                                                    <span className="text-sm font-medium text-[#11110f]">{value.trim()}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="rounded-[1.75rem] border border-[#deded4] bg-white p-6 md:p-8 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="rounded-3xl bg-[#ecebfd] p-3 text-[#185fa5]"><Truck size={20} /></div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#11110f]">Envío rápido y seguro</h3>
                                        <p className="text-sm text-[#6d726a]">Los plazos y el costo se calculan según tu zona durante la compra.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-3xl bg-[#ecfdf5] p-3 text-[#10b981]"><ShieldCheck size={20} /></div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#11110f]">Atención postventa</h3>
                                        <p className="text-sm text-[#6d726a]">Estamos disponibles para ayudarte con tu compra y resolver cualquier consulta.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[1.75rem] border border-[#deded4] bg-white p-6 md:p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-[#11110f] mb-6">Opiniones</h2>
                                <ProductReviews productId={product.id} />
                            </div>
                        </div>

                        <aside className="w-full lg:w-auto">
                            <div className="sticky top-24 space-y-6">
                                <div className="rounded-[2rem] border border-[#deded4] bg-white p-8 shadow-card">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-xs uppercase tracking-[0.3em] text-[#6d726a]">Tu compra</span>
                                        <span className="text-sm text-[#10b981] font-bold">{product.stock > 0 ? 'Disponible' : 'Agotado'}</span>
                                    </div>
                                    <div className="mb-6">
                                        <div className="text-xl font-black text-[#11110f]">$ {product.price.toLocaleString('es-AR')}</div>
                                        <div className="text-sm text-[#6d726a] mt-2">El medio de pago disponible se informa durante el checkout.</div>
                                    </div>

                                    <div className="rounded-3xl bg-[#eef0e8] p-4 border border-[#deded4] mb-6">
                                        <div className="flex items-center gap-2 text-sm text-[#6d726a] mb-3">
                                            <span className="font-bold text-[#11110f]">Cantidad</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                aria-label="Disminuir cantidad"
                                                className="h-12 w-12 rounded-2xl border border-[#deded4] bg-white text-[#11110f] font-black"
                                            >-</button>
                                            <span className="text-lg font-bold text-[#11110f]" aria-live="polite">{quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                                                aria-label="Aumentar cantidad"
                                                className="h-12 w-12 rounded-2xl border border-[#deded4] bg-white text-[#11110f] font-black"
                                            >+</button>
                                        </div>
                                    </div>

                                    {product.isMlReferral ? (
                                        <button
                                            type="button"
                                            onClick={() => product.mlAffiliateUrl && window.open(product.mlAffiliateUrl, '_blank', 'noopener,noreferrer')}
                                            disabled={!product.mlAffiliateUrl}
                                            className="w-full rounded-3xl bg-[#f1efff] text-[#2d3277] font-bold py-4 transition hover:bg-[#e5e0ff]"
                                        >
                                            Comprar seguro en Mercado Libre
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <button
                                                type="button"
                                                onClick={handleAddToCart}
                                                disabled={isAdding || product.stock <= 0}
                                                className={`w-full rounded-3xl py-4 text-sm font-bold transition ${isAdding ? 'bg-[#10b981] text-white' : 'bg-[#6f58d9] text-white hover:bg-[#5d48c7]'}`}
                                            >
                                                {product.stock <= 0 ? 'Agotado' : isAdding ? '¡Agregado!' : 'Agregar al carrito'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleBuyNow}
                                                disabled={product.stock <= 0}
                                                className="w-full rounded-3xl py-4 text-sm font-bold text-[#11110f] bg-[#eef0e8] hover:bg-[#eef6ff] transition disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Comprar ahora
                                            </button>
                                        </div>
                                    )}

                                    <div className="mt-6 rounded-3xl bg-[#f8fafc] border border-[#deded4] p-4 text-sm text-[#6d726a]">
                                        <p className="font-bold text-[#11110f] mb-2">Atención BoluShop</p>
                                        <p>Estamos disponibles para ayudarte con tu compra y resolver consultas.</p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {relatedProducts.length > 0 && (
                        <section className="mt-14">
                            <h2 className="text-2xl font-bold text-[#11110f] mb-6">Productos relacionados</h2>
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

