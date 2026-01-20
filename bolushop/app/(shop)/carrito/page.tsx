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
                        <h1 className="text-4xl font-black text-gray-900 mb-4">
                            Tu carrito está vacío
                        </h1>
                        <p className="text-gray-600 mb-8 text-lg">
                            ¡Descubrí nuestros productos y empezá a comprar!
                        </p>
                        <Link
                            href="/productos"
                            className="inline-block px-8 py-4 bg-primary text-white rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-primary/30"
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
                    <h1 className="text-5xl font-black mb-12">
                        Tu <span className="text-primary italic">Carrito</span>
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.productId}
                                    className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-shadow"
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
                                                <h3 className="font-black text-lg text-gray-900 hover:text-primary transition-colors mb-2">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            {item.isCollection && (
                                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest inline-block mb-3">
                                                    Pack Ahorro
                                                </span>
                                            )}
                                            <p className="text-2xl font-black text-primary mb-4">
                                                ${item.price.toLocaleString('es-AR')}
                                            </p>

                                            <div className="flex items-center gap-4">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                        className="text-xl font-black text-gray-600 hover:text-primary transition-colors"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="text-lg font-black w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                        className="text-xl font-black text-gray-600 hover:text-primary transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => handleRemove(item.productId)}
                                                    className="text-red-500 hover:text-red-700 transition-colors font-bold text-sm"
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold mb-1">Subtotal</p>
                                            <p className="text-2xl font-black text-gray-900">
                                                ${(item.price * item.quantity).toLocaleString('es-AR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[2rem] p-8 shadow-lg sticky top-24">
                                <h2 className="text-2xl font-black mb-6">Resumen</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-lg">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-black">${subtotal.toLocaleString('es-AR')}</span>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span className="text-gray-600">Envío</span>
                                        <span className={`font-black uppercase tracking-widest text-sm ${isFreeShipping ? 'text-emerald-500' : 'text-gray-500'}`}>
                                            {isFreeShipping ? 'Gratis' : 'A calcular'}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <div className="flex justify-between text-2xl">
                                        <span className="font-black">Total</span>
                                        <span className="font-black text-primary">${subtotal.toLocaleString('es-AR')}</span>
                                    </div>
                                    {!isFreeShipping && <p className="text-xs text-gray-500 mt-2">+ Costo de envío</p>}
                                </div>

                                {isFreeShipping ? (
                                    <div className="bg-emerald-50 rounded-2xl p-4 mb-6 border border-emerald-100 flex items-center gap-3">
                                        <span className="text-2xl">🚚</span>
                                        <p className="text-sm text-emerald-900 font-bold">
                                            ¡Tu pedido califica para <span className="text-emerald-600 uppercase">Envío Gratis</span> a todo el país!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                                        <p className="text-sm text-blue-900 font-medium">
                                            💡 El costo de envío se calculará en el checkout según tu ubicación
                                        </p>
                                    </div>
                                )}

                                {subtotal < minPurchase && (
                                    <div className="bg-red-50 rounded-2xl p-4 mb-6 border border-red-100 flex items-center gap-3">
                                        <span className="text-2xl">⚠️</span>
                                        <p className="text-sm text-red-900 font-bold">
                                            La compra mínima es de <span className="text-red-600">${minPurchase.toLocaleString('es-AR')}</span>. Te faltan <span className="text-red-600">${(minPurchase - subtotal).toLocaleString('es-AR')}</span>.
                                        </p>
                                    </div>
                                )}

                                <Link
                                    href={subtotal < minPurchase ? "#" : "/checkout"}
                                    className={`block w-full py-4 text-white text-center rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl ${subtotal < minPurchase
                                            ? 'bg-gray-300 cursor-not-allowed opacity-70 grayscale'
                                            : 'bg-primary hover:scale-105 shadow-primary/30'
                                        }`}
                                    onClick={(e) => {
                                        if (subtotal < minPurchase) {
                                            e.preventDefault();
                                            alert(`La compra mínima requerida es de $${minPurchase.toLocaleString('es-AR')}`);
                                        }
                                    }}
                                >
                                    Continuar al Checkout
                                </Link>

                                <Link
                                    href="/productos"
                                    className="block w-full py-3 text-center text-gray-600 font-bold text-sm mt-4 hover:text-primary transition-colors"
                                >
                                    ← Seguir Comprando
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
