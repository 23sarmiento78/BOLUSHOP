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
        <div className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/50 hover:-translate-y-1 relative h-full flex flex-col">

            {/* Wishlist Button */}
            <button
                onClick={handleWishlist}
                aria-label={isWishlisted ? "Eliminar de favoritos" : "Agregar a favoritos"}
                className="absolute top-5 right-5 z-20 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm hover:scale-110 active:scale-95 transition-all group/wishlist"
            >
                <Heart
                    className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/wishlist:text-red-400'}`}
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
                        <div className="bg-red-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                            Solo {product.stock} disp.
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                            Agotado
                        </div>
                    )}
                </div>

                {/* Quick View Overlay (Hidden on Mobile for Performance) */}
                <div className="absolute inset-0 bg-black/20 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                        Ver Detalles
                    </div>
                </div>
            </Link>

            {/* Content Section */}
            <div className="p-5 md:p-8 flex flex-col flex-grow">
                <div className="flex-grow">
                    <Link href={`/producto/${product.slug}`}>
                        <div className="flex items-center justify-between mb-2 md:mb-3">
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    {product.category}
                                </p>
                            </div>
                            <div className="flex items-center gap-0.5 text-sun-yellow text-[8px] md:text-[10px]">
                                ★★★★★
                            </div>
                        </div>
                        <h3 className="font-black text-gray-900 text-lg md:text-xl mb-3 md:mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-primary mt-1">$</span>
                                <p className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">
                                    {product.price.toLocaleString('es-AR')}
                                </p>
                            </div>
                            <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-widest mt-1">
                                Cuotas sin interés
                            </p>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || isAdding}
                            aria-label="Agregar al carrito"
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-[1.25rem] flex items-center justify-center transition-all duration-500 group/btn ${product.stock === 0
                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                : isAdding
                                    ? 'bg-emerald-500 text-white scale-110'
                                    : 'bg-primary text-white hover:bg-secondary hover:text-primary shadow-xl shadow-primary/10'
                                }`}
                            title="Agregar al carrito"
                        >
                            {isAdding ? (
                                <span className="text-lg">✓</span>
                            ) : (
                                <span className="text-xl md:text-2xl font-light">+</span>
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
