"use client";

import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductActions({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);

    const handleBuyNow = () => {
        setIsAdding(true);
        addToCart(product);
        // Short delay to ensure state update (rarely needed but safe)
        setTimeout(() => {
            router.push("/carrito");
        }, 100);
    };

    return (
        <div className="flex flex-col gap-3">
            <button
                onClick={handleBuyNow}
                disabled={isAdding}
                className="block w-full bg-primary text-white text-center font-bold text-xl py-4 rounded-xl shadow-lg hover:bg-emerald-600 transition-colors transform active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
            >
                {isAdding ? "Procesando..." : "Comprar Ahora"}
            </button>
            <p className="text-center text-sm text-gray-500">
                ¡Agregalo y aprovechá el envío!
            </p>
        </div>
    );
}
