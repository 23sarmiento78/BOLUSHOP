"use client";

import { Collection, Product } from "@/lib/types";
import { addCollectionToCart } from "@/lib/cart";
import { toast } from "sonner";
import Image from "next/image";
import { ShoppingBag, Check, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    collection: Collection;
    products: Product[];
    totalPrice: number;
    originalPrice: number;
}

export default function CollectionDetailClient({ collection, products, totalPrice, originalPrice }: Props) {
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();

    const handleAddToCart = () => {
        setIsAdding(true);
        addCollectionToCart(collection, products, totalPrice);

        toast.success(`¡Pack ${collection.name} añadido!`, {
            description: "Ya podés finalizar tu compra.",
            action: {
                label: "Ver Carrito",
                onClick: () => router.push("/carrito")
            }
        });

        setTimeout(() => setIsAdding(false), 1000);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

            {/* LEFT COLUMN: Gallery & Visuals */}
            <div className="flex-1 w-full lg:w-[60%]">
                <div className="sticky top-32">
                    <div className="relative aspect-square md:aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100 mb-8 group">
                        <Image
                            src={collection.image || (products[0]?.image) || "/icon.png"}
                            alt={collection.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        {/* Badge Overlay */}
                        <div className="absolute top-6 left-6">
                            <span className="bg-white/90 backdrop-blur-md text-gray-900 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                Pack Exclusivo
                            </span>
                        </div>
                    </div>

                    {/* Mini Gallery of included items */}
                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 ml-1">Productos Incluidos</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {products.map((p) => (
                                <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm tooltip" title={p.name}>
                                    <Image src={p.image} alt={p.name} fill className="object-contain p-2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Info & Buy Box */}
            <div className="w-full lg:w-[40%]">
                <div className="flex flex-col h-full">
                    {/* Header Info */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-emerald-500 flex text-sm">★★★★★</span>
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">Colección Premium</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                            {collection.name}
                        </h1>

                        <div className="prose prose-sm prose-gray max-w-none text-gray-500 font-medium">
                            <p className="whitespace-pre-line">{collection.description}</p>
                        </div>
                    </div>

                    {/* Sticky-ish Buy Box */}
                    <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-xl shadow-gray-200/50">

                        {/* Pricing */}
                        <div className="mb-8">
                            {totalPrice < originalPrice && (
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-gray-400 line-through font-medium text-lg">
                                        ${originalPrice.toLocaleString('es-AR')}
                                    </span>
                                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider">
                                        {Math.round((1 - totalPrice / originalPrice) * 100)}% OFF
                                    </span>
                                </div>
                            )}

                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-light text-gray-400">$</span>
                                <span className="text-5xl font-bold text-gray-900 tracking-tighter">
                                    {totalPrice.toLocaleString('es-AR')}
                                </span>
                            </div>

                            <p className="text-emerald-600 font-bold text-xs mt-3 flex items-center gap-2">
                                <Truck size={14} /> Envío Gratis a todo el país
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 ${isAdding
                                    ? 'bg-emerald-500 text-white translate-y-1'
                                    : 'bg-primary text-white hover:bg-gray-800 hover:shadow-primary/20'
                                    }`}
                            >
                                {isAdding ? (
                                    <>¡Agregado!</>
                                ) : (
                                    <>Comprar Pack Ahora</>
                                )}
                            </button>

                            <p className="text-center text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-widest">
                                Compra protegida por BoluShop
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
