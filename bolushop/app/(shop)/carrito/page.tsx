"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCart, updateQuantity, removeFromCart, getCartTotal, CartItem } from "@/lib/cart";
import { ChevronRight } from "lucide-react";

export default function CarritoPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFreeShipping, setIsFreeShipping] = useState(true);
    const [minPurchase, setMinPurchase] = useState(35000);

    useEffect(() => {
        setCart(getCart());

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
            <>                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-[#64748b] font-bold">Cargando carrito...</p>
                    </div>
                </div>            </>
        );
    }

    if (cart.length === 0) {
        return (
            <>                <main className="min-h-screen bg-white">
                    <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-12 md:py-16 px-4 md:px-6 flex items-center justify-center min-h-[40vh]">
                        <div className="max-w-7xl mx-auto text-center">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Tu Carrito está Vacío</h1>
                            <p className="text-sm md:text-base text-gray-300">
                                ¡Descubre nuestros productos y comienza a comprar!
                            </p>
                        </div>
                    </section>
                    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
                        <Link
                            href="/productos"
                            className="btn btn-primary"
                        >
                            Ver Productos
                        </Link>
                    </section>
                </main>            </>
        );
    }

    return (
        <>
            <main className="min-h-screen bg-white">
                {/* Page Header */}
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-8 md:py-12 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-300">
                            <Link href="/" className="hover:text-white">Inicio</Link>
                            <ChevronRight size={14} />
                            <span>Carrito</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Tu Carrito de Compras</h1>
                        <p className="text-sm md:text-base text-gray-300">
                            {cart.length} producto{cart.length !== 1 ? 's' : ''} en tu carrito
                        </p>
                    </div>
                </section>

                {/* Cart Content */}
                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.productId}
                                    className="card p-4 md:p-6 flex gap-4 md:gap-6"
                                >
                                    {/* Image */}
                                    <Link
                                        href={item.isCollection ? `/coleccion/${item.slug}` : `/producto/${item.slug}`}
                                        className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-[#f8f9fb] flex-shrink-0"
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
                                            <h3 className="font-bold text-sm md:text-base text-[#0f2044] hover:text-[#e8630a] transition-colors mb-1">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        {item.isCollection && (
                                            <span className="badge-ml text-[10px] mb-3 inline-block">
                                                Pack Ahorro
                                            </span>
                                        )}
                                        <p className="text-base md:text-lg font-bold text-[#e8630a] mb-3">
                                            ${item.price.toLocaleString('es-AR')}
                                        </p>

                                        <div className="flex items-center gap-4 flex-wrap">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 bg-[#f8f9fb] rounded-lg px-3 py-1.5 border border-[#e2e8f0]">
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                    className="text-base font-bold text-[#64748b] hover:text-[#0f2044] transition-colors"
                                                >
                                                    −
                                                </button>
                                                <span className="text-sm font-bold w-6 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                    className="text-base font-bold text-[#64748b] hover:text-[#0f2044] transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemove(item.productId)}
                                                className="text-[#64748b] hover:text-red-500 transition-colors font-bold text-xs uppercase tracking-wider"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-right flex flex-col justify-center">
                                        <p className="text-xs text-[#64748b] font-bold uppercase tracking-wider mb-1">Subtotal</p>
                                        <p className="text-base md:text-lg font-bold text-[#0f2044]">
                                            ${(item.price * item.quantity).toLocaleString('es-AR')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="card p-6 md:p-8 sticky top-[100px] md:top-24">
                                <h2 className="text-lg md:text-xl font-bold text-[#0f2044] mb-6">Resumen</h2>

                                <div className="space-y-4 mb-6 pb-6 border-b border-[#e2e8f0]">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[#64748b]">Subtotal</span>
                                        <span className="font-bold text-[#0f2044]">${subtotal.toLocaleString('es-AR')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[#64748b]">Envío</span>
                                        <span className={`font-bold text-sm ${isFreeShipping ? 'text-[#10b981]' : 'text-[#64748b]'}`}>
                                            {isFreeShipping ? '¡Gratis!' : 'A calcular'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-[#0f2044]">Total</span>
                                        <span className="text-lg font-bold text-[#e8630a]">${subtotal.toLocaleString('es-AR')}</span>
                                    </div>
                                    {!isFreeShipping && <p className="text-[10px] text-[#64748b] mt-2">+ Costo de envío</p>}
                                </div>

                                {isFreeShipping && (
                                    <div className="bg-[#f0fdf4] rounded-lg p-4 mb-8 border border-[#dcfce7] flex items-start gap-3">
                                        <span className="text-lg flex-shrink-0">🚚</span>
                                        <p className="text-xs text-[#166534] font-bold leading-relaxed">
                                            ¡Tu pedido califica para <span className="text-[#10b981]">ENVÍO GRATIS</span>!
                                        </p>
                                    </div>
                                )}

                                {subtotal < minPurchase && (
                                    <div className="bg-[#fef2f2] rounded-lg p-4 mb-8 border border-[#fecaca] flex items-start gap-3">
                                        <span className="text-lg flex-shrink-0">⚠️</span>
                                        <p className="text-xs text-[#991b1b] font-bold leading-relaxed">
                                            Compra mínima: <span>${minPurchase.toLocaleString('es-AR')}</span>
                                        </p>
                                    </div>
                                )}

                                <Link
                                    href={subtotal < minPurchase ? "#" : "/checkout"}
                                    className={`block w-full py-4 text-white text-center rounded-lg font-bold text-sm uppercase tracking-widest transition-all ${subtotal < minPurchase
                                        ? 'bg-[#cbd5e1] cursor-not-allowed'
                                        : 'btn btn-primary'
                                        }`}
                                    onClick={(e) => {
                                        if (subtotal < minPurchase) {
                                            e.preventDefault();
                                            alert(`Compra mínima: $${minPurchase.toLocaleString('es-AR')}`);
                                        }
                                    }}
                                >
                                    Continuar al Pago
                                </Link>

                                <Link
                                    href="/productos"
                                    className="block w-full py-3 text-center text-[#64748b] font-bold text-xs uppercase tracking-widest mt-4 hover:text-[#0f2044] transition-colors"
                                >
                                    ← Seguir Explorando
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>        </>
    );
}
