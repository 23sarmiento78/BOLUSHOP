"use client";

import { CartItem } from "@/lib/cart";
import Image from "next/image";
import { useHolidayTheme } from "@/lib/hooks/useHolidayTheme";

interface OrderSummaryProps {
    items: CartItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
}

export default function OrderSummary({ items, subtotal, shippingCost, total }: OrderSummaryProps) {
    const { holiday, primary } = useHolidayTheme();

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>

            {/* Items */}
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                    <div key={item.productId} className="flex gap-4 pb-4 border-b border-gray-50">
                        <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain p-2"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {item.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                                Cantidad: {item.quantity}
                            </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-gray-900">
                                ${(item.price * item.quantity).toLocaleString('es-AR')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 py-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${subtotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-semibold text-emerald-600">
                        {shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toLocaleString('es-AR')}`}
                    </span>
                </div>
            </div>

            {/* Grand Total */}
            <div
                className="flex justify-between items-center pt-4 border-t-2 transition-colors"
                style={{ borderColor: holiday ? primary : '#0F172A' }}
            >
                <span className="text-lg font-bold">Total</span>
                <span
                    className="text-2xl font-black transition-colors"
                    style={{ color: holiday ? primary : '#0F172A' }}
                >
                    ${total.toLocaleString('es-AR')}
                </span>
            </div>

            {/* Holiday Message */}
            {holiday && (
                <div
                    className="mt-6 p-4 rounded-xl text-sm font-medium text-center"
                    style={{
                        backgroundColor: `${primary}10`,
                        color: primary
                    }}
                >
                    {holiday.icon} ¡Llega a tiempo para {holiday.label}!
                </div>
            )}

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="text-lg">🔒</span>
                    <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="text-lg">📦</span>
                    <span>Envío rastreable</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="text-lg">↩️</span>
                    <span>30 días para devoluciones</span>
                </div>
            </div>
        </div>
    );
}
