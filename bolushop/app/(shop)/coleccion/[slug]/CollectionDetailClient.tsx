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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Bundle Visual */}
            <div className="space-y-8">
                <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100">
                    <Image
                        src={collection.image || (products[0]?.image) || "/bolushop.png"}
                        alt={collection.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-10 text-white">
                        <span className="bg-primary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                            Pack Exclusivo
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{collection.name}</h1>
                    </div>
                </div>

                {/* Bundle Items Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {products.slice(0, 3).map((p) => (
                        <div key={p.id} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform hover:scale-105">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                    ))}
                    {products.length > 3 && (
                        <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                            +{products.length - 3}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Bundle Info & Buy */}
            <div className="flex flex-col">
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">
                            Ahorro Garantizado
                        </span>
                        <span className="text-gray-400 font-bold text-sm">
                            {products.length} productos incluidos
                        </span>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {collection.description}
                    </p>
                </div>

                {/* Pricing Card */}
                <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 mb-10">
                    <div className="mb-6">
                        {totalPrice < originalPrice && (
                            <>
                                <p className="text-gray-400 font-bold line-through text-xl mb-1">
                                    ${originalPrice.toLocaleString('es-AR')}
                                </p>
                            </>
                        )}
                        <div className="flex items-end gap-4">
                            <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">
                                ${totalPrice.toLocaleString('es-AR')}
                            </span>
                            {totalPrice < originalPrice && originalPrice > 0 && (
                                <span className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-black mb-2 animate-bounce">
                                    -{Math.round((1 - totalPrice / originalPrice) * 100)}%
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-xl ${isAdding
                            ? 'bg-emerald-500 text-white translate-y-1'
                            : 'bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/25'
                            }`}
                    >
                        {isAdding ? (
                            <><Check size={20} /> Pack Añadido</>
                        ) : (
                            <><ShoppingBag size={20} /> Comprar Pack Completo</>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-400 font-bold mt-6 uppercase tracking-widest">
                        Paga en cuotas con Mercado Pago 💳
                    </p>
                </div>

                {/* Trust Points */}
                <div className="space-y-6">
                    <div className="flex gap-4 p-4 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-sm tracking-tight mb-1">Garantía BoluShop</h4>
                            <p className="text-xs text-gray-500 font-medium">Todos los productos del pack cuentan con soporte 24/7.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-sm tracking-tight mb-1">Envío Flash Incluido</h4>
                            <p className="text-xs text-gray-500 font-medium">Recibí todo el pack junto en un solo envío protegido.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
