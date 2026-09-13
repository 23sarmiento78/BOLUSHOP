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

    const handleAddToCart = () => {
        if (product.isMlReferral) {
            if (product.mlAffiliateUrl) window.open(product.mlAffiliateUrl, "_blank", "noopener,noreferrer");
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
        <article className="card flex h-full flex-col">
            <Link href={`/producto/${product.slug}`} className="group flex min-h-0 flex-1 flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f3f0]">
                    <Image
                        src={transformImageUrl(product.image)}
                        alt={product.name}
                        fill
                        className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {product.isMlReferral && (
                        <div className="badge-ml absolute left-3 top-3">ML</div>
                    )}
                </div>

                <div className="flex flex-1 flex-col p-4 md:p-5">
                    <span className="mb-2 text-[10px] uppercase tracking-widest text-[#8d9388]">
                        {product.category}
                    </span>
                    <h3 className="truncate-2 mb-3 text-sm font-semibold leading-snug text-[#11110f] md:text-[15px]" style={{ fontFamily: "var(--font-display)" }}>
                        {product.name}
                    </h3>
                    <div className="mt-auto flex items-baseline gap-1">
                        <span className="text-xl font-bold text-[#11110f]" style={{ fontFamily: "var(--font-display)" }}>
                            ${product.price.toLocaleString("es-AR")}
                        </span>
                    </div>
                </div>
            </Link>

            <div className="px-4 pb-4 md:px-5 md:pb-5">
                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.isMlReferral && !product.mlAffiliateUrl}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8f31d] focus-visible:ring-offset-2 ${
                        product.isMlReferral
                            ? "border border-[#bca7ff] bg-[#f1efff] text-[#9a6b00] hover:bg-[#bca7ff] disabled:cursor-not-allowed disabled:opacity-50"
                            : "bg-[#11110f] text-white hover:bg-[#25251f]"
                    }`}
                >
                    {product.isMlReferral ? (
                        <><ExternalLink size={13} /> Ver en ML</>
                    ) : (
                        <><ShoppingCart size={13} /> {isAdding ? "¡Agregado!" : "Agregar"}</>
                    )}
                </button>
            </div>
        </article>
    );
}
