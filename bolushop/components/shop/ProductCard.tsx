"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { addToCart } from "@/lib/cart";
import { toggleWishlist, isInWishlist } from "@/lib/wishlist";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Heart, Truck, ShoppingCart } from "lucide-react";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const [isAdding, setIsAdding] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        setIsWishlisted(isInWishlist(product.id));
    }, [product.id]);

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart(product);
        toast.success("Producto agregado al carrito");
        setTimeout(() => setIsAdding(false), 1000);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggleWishlist(product.id);
        setIsWishlisted(added);
        toast.success(added ? "Agregado a favoritos" : "Eliminado de favoritos");
    };

    return (
        <Link href={`/producto/${product.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full relative">

            {/* Wishlist Button (Floating) */}
            <button
                onClick={handleWishlist}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-300 hover:text-blue-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
            >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-blue-500 text-blue-500' : ''}`} />
            </button>

            {/* Image (Squared) */}
            <div className="relative aspect-square border-b border-gray-50 overflow-hidden bg-white p-4">
                <Image
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                {(product.stock === 0) && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded">AGOTADO</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow bg-white">
                <h3 className="text-sm font-normal text-gray-800 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>

                <div className="mt-auto space-y-1">
                    {/* Price */}
                    <div className="text-2xl font-light text-gray-900">
                        ${product.price.toLocaleString('es-AR')}
                    </div>

                    {/* Installments */}
                    <div className="text-[10px] sm:text-xs font-medium text-emerald-600">
                        en <span className="font-bold">3x ${(product.price / 3).toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span> sin interés
                    </div>

                    {/* Free Shipping Badge */}
                    <div className="pt-2">
                        <span className="inline-block text-[10px] md:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Envío gratis ⚡
                        </span>
                    </div>

                    {/* Hidden Add to Cart - Only visible on hover/mobile if needed, but keeping it clean for now */}
                    <div className="pt-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart();
                            }}
                            disabled={product.stock === 0 || isAdding}
                            className="w-full py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            {isAdding ? '¡Agregado!' : 'Agregar al carrito'}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
