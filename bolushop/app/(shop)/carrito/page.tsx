"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { getCart, updateQuantity, removeFromCart, getCartTotal, CartItem } from "@/lib/cart";

export default function CarritoPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFreeShipping, setIsFreeShipping] = useState(true);
    const [minPurchase, setMinPurchase] = useState(35000);

    useEffect(() => {
        setCart(getCart());

        // Fetch settings to check free shipping
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    setIsFreeShipping(data.settings.isFreeShippingEnabled ?? true);
                    setMinPurchase(data.settings.minPurchaseAmount ?? 35000);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));

        const handleCartUpdate = () => {
            setCart(getCart());
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        updateQuantity(productId, newQuantity);
    };

    const handleRemove = (productId: string) => {
        if (confirm('¿Eliminar este producto del carrito?')) {
            removeFromCart(productId);
        }
    };

    const subtotal = getCartTotal();

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-gray-500 font-bold">Cargando carrito...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (cart.length === 0) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                    <div className="text-center px-4">
                        <div className="text-9xl mb-6 opacity-20">🛒</div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Tu carrito está vacío
                        </h1>
                        <p className="text-gray-600 mb-8 text-lg">
                            ¡Descubrí nuestros productos y empezá a comprar!
                        </p>
                        <Link
                            href="/productos"
                            className="inline-block px-8 py-4 bg-primary text-white rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-primary/30"
                        >
                            Ver Productos
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <main className="min-h-screen bg-gray-50 pt-28 pb-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-5xl font-bold mb-10 tracking-tight">
                        Tu <span className="text-primary italic">Carrito</span>
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.productId}
                                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-6">
                                        {/* Image */}
                                        <Link
                                            href={item.isCollection ? `/coleccion/${item.slug}` : `/producto/${item.slug}`}
                                            className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0"
                                        >
                                            <Image
                                                src={item.image || "/placeholder.png"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="96px"
                                            />
                                        </Link>

                                        {/* Info */}
                                        <div className="flex-grow">
                                            <Link href={item.isCollection ? `/coleccion/${item.slug}` : `/producto/${item.slug}`}>
                                                <h3 className="font-bold text-base md:text-lg text-gray-900 hover:text-primary transition-colors mb-1">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            {item.isCollection && (
                                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest inline-block mb-3">
                                                    Pack Ahorro
                                                </span>
                                            )}
                                            <p className="text-lg md:text-xl font-bold text-primary mb-4">
                                                ${item.price.toLocaleString('es-AR')}
                                            </p>

                                            <div className="flex items-center gap-6">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                        className="text-lg font-bold text-gray-400 hover:text-primary transition-colors"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="text-sm font-bold w-6 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                        className="text-lg font-bold text-gray-400 hover:text-primary transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => handleRemove(item.productId)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors font-semibold text-[10px] uppercase tracking-wider"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subtotal Item */}
                                        <div className="text-right flex flex-col justify-center">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Subtotal</p>
                                            <p className="text-lg md:text-xl font-bold text-gray-900">
                                                ${(item.price * item.quantity).toLocaleString('es-AR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 sticky top-24 border border-gray-100">
                                <h2 className="text-xl font-bold mb-6">Resumen</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-lg">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-bold">${subtotal.toLocaleString('es-AR')}</span>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span className="text-gray-600">Envío</span>
                                        <span className={`font-bold uppercase tracking-widest text-sm ${isFreeShipping ? 'text-emerald-500' : 'text-gray-500'}`}>
                                            {isFreeShipping ? 'Gratis' : 'A calcular'}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6 mb-8">
                                    <div className="flex justify-between text-2xl">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold text-primary">${subtotal.toLocaleString('es-AR')}</span>
                                    </div>
                                    {!isFreeShipping && <p className="text-[10px] text-gray-400 mt-2">+ Costo de envío</p>}
                                </div>

                                {isFreeShipping ? (
                                    <div className="bg-emerald-50 rounded-2xl p-4 mb-8 border border-emerald-100/50 flex items-center gap-3">
                                        <span className="text-xl">🚚</span>
                                        <p className="text-xs text-emerald-900 font-semibold leading-relaxed">
                                            ¡Tu pedido califica para <span className="text-emerald-600 font-bold uppercase">Envío Gratis</span>!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-blue-50 rounded-2xl p-4 mb-8">
                                        <p className="text-xs text-blue-900 font-medium">
                                            💡 El costo de envío se calculará en el checkout.
                                        </p>
                                    </div>
                                )}

                                {subtotal < minPurchase && (
                                    <div className="bg-red-50 rounded-2xl p-4 mb-8 border border-red-100/50 flex items-center gap-3">
                                        <span className="text-xl">⚠️</span>
                                        <p className="text-xs text-red-900 font-semibold leading-relaxed">
                                            La compra mínima es de <span className="font-bold">${minPurchase.toLocaleString('es-AR')}</span>.
                                        </p>
                                    </div>
                                )}

                                <Link
                                    href={subtotal < minPurchase ? "#" : "/checkout"}
                                    className={`block w-full py-4 text-white text-center rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg ${subtotal < minPurchase
                                        ? 'bg-gray-200 cursor-not-allowed grayscale'
                                        : 'bg-primary hover:bg-gold-accent shadow-primary/10'
                                        }`}
                                    onClick={(e) => {
                                        if (subtotal < minPurchase) {
                                            e.preventDefault();
                                            alert(`La compra mínima requerida es de $${minPurchase.toLocaleString('es-AR')}`);
                                        }
                                    }}
                                >
                                    Continuar Pago
                                </Link>

                                <Link
                                    href="/productos"
                                    className="block w-full py-3 text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-4 hover:text-primary transition-colors"
                                >
                                    ← Seguir Explorando
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
