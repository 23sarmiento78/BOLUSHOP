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
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:-translate-y-1 relative h-full flex flex-col">

            {/* Wishlist Button */}
            <button
                onClick={handleWishlist}
                aria-label={isWishlisted ? "Eliminar de favoritos" : "Agregar a favoritos"}
                className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-sm hover:scale-110 active:scale-95 transition-all group/wishlist"
            >
                <Heart
                    className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/wishlist:text-red-400'}`}
                />
            </button>

            {/* Image Section */}
            <Link href={`/producto/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50">
                <Image
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                />

                {/* Stock Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.stock <= 5 && product.stock > 0 && (
                        <div className="bg-red-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider shadow-lg">
                            Solo {product.stock} disp.
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div className="bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider shadow-lg">
                            Agotado
                        </div>
                    )}
                </div>

                {/* Quick View Overlay (Hidden on Mobile for Performance) */}
                <div className="absolute inset-0 bg-black/10 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="bg-white text-black px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest translate-y-2 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                        Ver Detalles
                    </div>
                </div>
            </Link>

            {/* Content Section */}
            <div className="p-5 md:p-8 flex flex-col flex-grow">
                <div className="flex-grow">
                    <Link href={`/producto/${product.slug}`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-primary/40"></span>
                                <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                                    {product.category}
                                </p>
                            </div>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base md:text-lg mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-semibold text-primary">$</span>
                                <p className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                                    {product.price.toLocaleString('es-AR')}
                                </p>
                            </div>
                            <p className="text-[8px] text-emerald-600 font-semibold uppercase tracking-wider mt-0.5">
                                Cuotas sin interés
                            </p>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || isAdding}
                            aria-label="Agregar al carrito"
                            className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all duration-300 group/btn ${product.stock === 0
                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                : isAdding
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-primary text-white hover:bg-gold-accent shadow-lg shadow-primary/5'
                                }`}
                            title="Agregar al carrito"
                        >
                            {isAdding ? (
                                <span className="text-base">✓</span>
                            ) : (
                                <ShoppingCart size={18} strokeWidth={2} />
                            )}
                        </button>
                    </div>

                    <div className="pt-3 md:pt-4 border-t border-gray-100 flex items-center justify-between text-[8px] md:text-[10px] font-bold text-gray-400">
                        <span className="flex items-center gap-1">
                            <Truck size={10} className="text-primary" /> Envío Gratis
                        </span>
                        <span>Stock: {product.stock}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
