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

    const rating = 4.8; // Placeholder, should come from product data
    const soldCount = 100; // Placeholder

    return (
        <Link href={`/producto/${product.slug}`} className="group block">
            <div className="card overflow-hidden flex flex-col h-full hover:shadow-md">
                {/* Image Section */}
                <div className="relative bg-[#f8f9fb] aspect-square overflow-hidden">
                    <Image
                        src={transformImageUrl(product.image)}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 25vw"
                    />

                    {/* Badge */}
                    {product.isMlReferral ? (
                        <div className="absolute top-2 left-2 badge badge-ml">
                            <span className="text-[9px]">Selección ML</span>
                        </div>
                    ) : (
                        <div className="absolute top-2 left-2 badge">
                            <span className="text-[9px]">Nuevo</span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-3 md:p-4 flex flex-col flex-grow">
                    <span className="text-[9px] font-medium text-[#64748b] uppercase tracking-wider mb-1">
                        {product.category}
                    </span>

                    <h3 className="text-[11px] md:text-xs font-bold text-[#1e293b] line-clamp-2 leading-tight mb-2 group-hover:text-[#0f2044] transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-[#f0a500]">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} fill="currentColor" />
                            ))}
                        </div>
                        <span className="text-[8px] text-[#64748b]">({rating})</span>
                    </div>

                    <div className="mt-auto">
                        {/* Price */}
                        <div className="mb-2">
                            <span className="text-[9px] text-[#64748b] block mb-0.5">Precio</span>
                            <span className="text-sm md:text-base font-bold text-[#0f2044]">
                                ${product.price.toLocaleString('es-AR')}
                            </span>
                        </div>

                        {/* Add to cart button */}
                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-2 px-2 rounded-md text-[9px] font-bold uppercase transition-all ${
                                product.isMlReferral
                                    ? 'bg-[#fff9e6] text-[#c47a00] hover:bg-[#f0c040]'
                                    : 'bg-[#0f2044] text-white hover:bg-opacity-90'
                            }`}
                        >
                            {product.isMlReferral ? (
                                <div className="flex items-center justify-center gap-1">
                                    <ExternalLink size={10} />
                                    <span>Ver en ML</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-1">
                                    <ShoppingCart size={10} />
                                    <span>{isAdding ? '¡Agregado!' : 'Agregar'}</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
