"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { transformImageUrl } from "@/lib/images";
import { addToCart } from "@/lib/cart";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, Zap, Heart, Search } from "lucide-react";
import { getCurrentHoliday } from "@/lib/holidays";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const [isAdding, setIsAdding] = useState(false);
    const holiday = getCurrentHoliday();

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
            style: holiday ? { backgroundColor: holiday.colors.secondary, color: holiday.colors.text } : {}
        });

        setTimeout(() => setIsAdding(false), 2000);
    };

    return (
        <Link
            href={`/producto/${product.slug}`}
            className="group block h-full"
        >
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col h-full">
                {/* Image Section */}
                <div className="relative aspect-[4/5] bg-white overflow-hidden p-6">
                    <Image
                        src={transformImageUrl(product.image)}
                        alt={product.name}
                        fill
                        className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    {/* Badge: New or Holiday */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                        {product.isMlReferral ? (
                            <span className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-lg">
                                <Zap size={10} fill="currentColor" />
                                Selección ML
                            </span>
                        ) : (
                            <span className="bg-black text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] shadow-lg">
                                Local Edition
                            </span>
                        )}

                        {holiday && (
                            <span className="bg-gradient-to-r from-primary to-gold-accent text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] shadow-lg" style={{ backgroundImage: `linear-gradient(to right, ${holiday.colors.primary}, ${holiday.colors.secondary})` }}>
                                {holiday.icon} {holiday.label}
                            </span>
                        )}
                    </div>

                    {/* Actions Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div
                            onClick={handleAddToCart}
                            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all ${product.isMlReferral
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-900 text-white hover:bg-black'
                                }`}
                        >
                            {product.isMlReferral ? (
                                <>
                                    <Search size={16} />
                                    Ver en Mercado Libre
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={16} />
                                    {isAdding ? "¡Agregado!" : "Al Carrito"}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow bg-sand-white">
                    <div className="flex items-center justify-between gap-4 mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary truncate max-w-[150px]">
                            {product.category}
                        </span>
                        <div className="bg-gray-50 p-2 rounded-lg text-gray-300">
                            <Heart size={14} />
                        </div>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-4 line-clamp-2 leading-tight tracking-tight italic group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300">Precio AR$</span>
                            <span className="text-2xl font-black text-gray-900">${product.price.toLocaleString('es-AR')}</span>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${product.isMlReferral ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-900'
                            }`}>
                            <Zap size={20} fill={product.isMlReferral ? 'currentColor' : 'none'} className={product.isMlReferral ? '' : 'stroke-2'} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
