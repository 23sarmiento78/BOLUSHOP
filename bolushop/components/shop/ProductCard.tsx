"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { transformImageUrl } from "@/lib/images";
import { addToCart } from "@/lib/cart";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingCart, ExternalLink } from "lucide-react";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.isMlReferral) {
            window.open(product.mlAffiliateUrl, "_blank");
            return;
        }

        setIsAdding(true);
        addToCart(product);
        toast.success(`¡${product.name} agregado!`, {
            description: "Ya lo tenés en tu carrito.",
        });
        setTimeout(() => setIsAdding(false), 2000);
    };

    return (
        <Link href={`/producto/${product.slug}`} className="group block">
            <article className="card flex flex-col h-full">
                <div className="relative bg-[#f5f3f0] aspect-[4/5] overflow-hidden">
                    <Image
                        src={transformImageUrl(product.image)}
                        alt={product.name}
                        fill
                        className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className={`absolute top-3 left-3 ${product.isMlReferral ? "badge-ml" : "badge"}`}>
                        {product.isMlReferral ? "ML" : "Nuevo"}
                    </div>
                </div>

                <div className="p-4 md:p-5 flex flex-col flex-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#94a3b8] mb-2">
                        {product.category}
                    </span>

                    <h3 className="text-sm md:text-[15px] font-semibold text-[#0a1628] leading-snug truncate-2 mb-3" style={{ fontFamily: "var(--font-display)" }}>
                        {product.name}
                    </h3>

                    <div className="mt-auto space-y-3">
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-[#0a1628]" style={{ fontFamily: "var(--font-display)" }}>
                                ${product.price.toLocaleString("es-AR")}
                            </span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className={`w-full rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                                product.isMlReferral
                                    ? "bg-[#fff8e6] text-[#9a6b00] border border-[#f0c040] hover:bg-[#f0c040]"
                                    : "bg-[#0a1628] text-white hover:bg-[#152238]"
                            }`}
                        >
                            {product.isMlReferral ? (
                                <span className="flex items-center justify-center gap-2">
                                    <ExternalLink size={13} /> Ver en ML
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <ShoppingCart size={13} />
                                    {isAdding ? "¡Agregado!" : "Agregar"}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </article>
        </Link>
    );
}
