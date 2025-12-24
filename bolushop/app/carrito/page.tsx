"use client";
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="text-6xl mb-6">🛒</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
                <p className="text-gray-500 mb-8">Parece que todavía no elegiste nada. ¡Mirá lo que hay!</p>
                <Link href="/" className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-600 transition-colors">
                    Ir a comprar
                </Link>
            </div>
        );
    }

    // Shipping Logic: If ANY item has free shipping, the whole order is free.
    // Otherwise, flat rate of $9000.
    const hasFreeShippingItem = items.some(i => i.features && i.features.includes("Envío Gratis 🚚"));
    const shippingCost = hasFreeShippingItem ? 0 : 9000;
    const finalTotal = total + shippingCost;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Tu Carrito</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                            <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="px-3 py-1 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="px-3 py-1 hover:bg-gray-100 text-gray-600 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="text-gray-400 text-xs">x ${item.price.toLocaleString('es-AR')}</span>
                                </div>
                                {item.features?.includes("Envío Gratis 🚚") && (
                                    <div className="text-green-600 text-xs font-bold mt-1">Envío GRATIS</div>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-lg">${(item.price * item.quantity).toLocaleString('es-AR')}</div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 text-xs hover:underline mt-2"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen</h2>
                        <div className="flex justify-between mb-2 text-gray-600">
                            <span>Subtotal</span>
                            <span>${total.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="flex justify-between mb-4 font-medium">
                            <span>Envío</span>
                            {shippingCost === 0 ? (
                                <span className="text-green-600">GRATIS 🚚</span>
                            ) : (
                                <span>${shippingCost.toLocaleString('es-AR')}</span>
                            )}
                        </div>
                        <div className="border-t border-gray-100 pt-4 flex justify-between mb-6">
                            <span className="font-bold text-xl text-gray-900">Total</span>
                            <span className="font-bold text-xl text-primary">${finalTotal.toLocaleString('es-AR')}</span>
                        </div>

                        {shippingCost === 0 ? (
                            <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-lg mb-6">
                                😉 <strong>¡Buena elección!</strong> El envío ya está bonificado.
                            </div>
                        ) : (
                            <div className="bg-gray-50 text-gray-600 text-sm p-3 rounded-lg mb-6">
                                💡 Agregá un producto de más de $20.000 para tener <strong>Envío Gratis</strong> en toda la orden.
                            </div>
                        )}

                        <Link href="/checkout" className="block w-full bg-primary text-white text-center font-bold py-4 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg">
                            Finalizar Compra
                        </Link>
                        <Link href="/" className="block text-center text-gray-500 text-sm mt-4 hover:underline">
                            Seguir comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
