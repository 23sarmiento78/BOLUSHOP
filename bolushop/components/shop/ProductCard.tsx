"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { addToCart } from "@/lib/cart";
import { toggleWishlist, isInWishlist } from "@/lib/wishlist";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";

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
        <div className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-[1.02] relative">

            {/* Wishlist Button */}
            <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
                <Heart
                    className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                />
            </button>

            {/* Image */}
            <Link href={`/producto/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                <Image
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black z-10">
                        ¡Últimas {product.stock}!
                    </div>
                )}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                        <span className="bg-white text-gray-900 px-6 py-3 rounded-full font-black text-sm">
                            Sin Stock
                        </span>
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="p-6">
                <Link href={`/producto/${product.slug}`}>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                        {product.category}
                    </p>
                    <h3 className="font-black text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-4">
                    <div>
                        <p className="text-2xl font-black text-primary">
                            ${product.price.toLocaleString('es-AR')}
                        </p>
                        <p className="text-xs text-gray-400 font-bold">+ Envío</p>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || isAdding}
                        className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${product.stock === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : isAdding
                                ? 'bg-green-500 text-white scale-110'
                                : 'bg-primary text-white hover:scale-105 shadow-lg shadow-primary/20'
                            }`}
                    >
                        {isAdding ? '✓ Agregado' : '+ Carrito'}
                    </button>
                </div>
            </div>
        </div>
    );
}
