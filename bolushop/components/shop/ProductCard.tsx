"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { transformImageUrl } from "@/lib/images";
import { addToCart } from "@/lib/cart";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingCart, Star, ExternalLink } from "lucide-react";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.isMlReferral) {
            window.open(product.mlAffiliateUrl, '_blank');
            return;
        }

        setIsAdding(true);
        addToCart(product);
        toast.success(`¡${product.name} agregado!`, {
            description: "Ya lo tenés en tu carrito.",
        });

        setTimeout(() => setIsAdding(false), 2000);
    };

    const badgeLabel = product.isMlReferral ? 'Imperdible ML' : 'Nuevo';
    const badgeClass = product.isMlReferral ? 'badge-ml' : 'badge';
    const installmentText = product.isMlReferral ? 'Ver en Mercado Libre' : `Pago único`;

    return (
        <Link href={`/producto/${product.slug}`} className="group block">
            <div className="card overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
                <div className="relative bg-[#eef3fb] aspect-square overflow-hidden flex items-center justify-center">
                    <Image
                        src={transformImageUrl(product.image)}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className={`absolute top-3 left-3 ${badgeClass} text-[10px] font-semibold px-3 py-1.5 rounded-full`}>
                        {badgeLabel}
                    </div>
                </div>

                <div className="p-4 md:p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] uppercase tracking-[0.35em] text-[#64748b]">
                            {product.category}
                        </span>
                        {product.isMlReferral && (
                            <span className="text-[9px] font-semibold text-[#c47a00] bg-[#fff9e6] border border-[#f0c040] rounded-full px-2 py-1">
                                ML
                            </span>
                        )}
                    </div>

                    <h3 className="text-sm md:text-base font-semibold text-[#0f2044] leading-snug line-clamp-2 mb-3">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-0.5 text-[#f0a500]">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill="currentColor" />
                            ))}
                        </div>
                        <span className="text-[10px] text-[#64748b]">4.9</span>
                    </div>

                    <div className="mt-auto space-y-3">
                        <div>
                            <div className="text-[10px] text-[#64748b] uppercase tracking-[0.35em] mb-1">Precio</div>
                            <div className="text-base md:text-lg font-bold text-[#0f2044]">
                                ${product.price.toLocaleString('es-AR')}
                            </div>
                        </div>
                        <div className="text-[10px] text-[#64748b]">{installmentText}</div>

                        <button
                            onClick={handleAddToCart}
                            className={`w-full rounded-xl py-3 text-[11px] font-bold uppercase tracking-[0.25em] transition-all ${
                                product.isMlReferral
                                    ? 'bg-[#fff9e6] text-[#c47a00] hover:bg-[#f0c040]'
                                    : 'bg-[#0f2044] text-white hover:bg-[#0b1938]'
                            }`}
                        >
                            {product.isMlReferral ? (
                                <div className="flex items-center justify-center gap-2">
                                    <ExternalLink size={14} />
                                    <span>Ver en ML</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <ShoppingCart size={14} />
                                    <span>{isAdding ? '¡Agregado!' : 'Agregar al carrito'}</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
