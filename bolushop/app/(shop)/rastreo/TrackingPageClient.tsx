"use client";

import { useState } from "react";
import { getOrderByIdAction } from "@/app/actions/tracking";
import { Order } from "@/lib/types";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function TrackingPageClient() {
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setOrder(null);

        if (!orderId.trim()) {
            toast.error("Por favor ingresá un número de orden");
            return;
        }

        setIsLoading(true);
        try {
            const result = await getOrderByIdAction(orderId.trim());
            if (result) {
                setOrder(result);
                toast.success("Orden encontrada");
            } else {
                setError("No encontramos una orden con ese número. Verificá que sea correcto.");
                toast.error("Orden no encontrada");
            }
        } catch (err) {
            console.error(err);
            setError("Ocurrió un error al buscar la orden. Intentá nuevamente.");
            toast.error("Error al buscar");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'pending': return 1;
            case 'paid': return 2;
            case 'shipped': return 3;
            case 'delivered': return 4;
            default: return 1;
        }
    };

    const currentStep = order ? getStatusStep(order.status) : 0;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2rem] shadow-xl p-8 mb-12">
                <h1 className="text-3xl font-black text-center mb-8">Seguí tu Pedido</h1>

                <form onSubmit={handleSearch} className="flex gap-4 max-w-lg mx-auto mb-8">
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Ingresá tu número de orden (ID)"
                        className="flex-grow px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-mono"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
                    >
                        {isLoading ? '...' : 'Buscar'}
                    </button>
                </form>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-6 font-medium border border-red-100">
                        {error}
                    </div>
                )}

                {order && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="border-t border-gray-100 pt-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Orden #</p>
                                    <p className="font-mono text-xl font-bold">{order.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Fecha</p>
                                    <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Status Steps */}
                            <div className="relative mb-12 px-4">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                                />

                                <div className="relative flex justify-between">
                                    {[
                                        { label: 'Pendiente', icon: '📝', step: 1 },
                                        { label: 'Pagado', icon: '💳', step: 2 },
                                        { label: 'Enviado', icon: '🚚', step: 3 },
                                        { label: 'Entregado', icon: '✨', step: 4 }
                                    ].map((s) => (
                                        <div key={s.step} className="flex flex-col items-center gap-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 transition-all duration-500 ${currentStep >= s.step
                                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-110'
                                                    : 'bg-white border-2 border-gray-200 text-gray-300'
                                                }`}>
                                                {s.icon}
                                            </div>
                                            <p className={`text-xs font-bold uppercase tracking-widest ${currentStep >= s.step ? 'text-green-600' : 'text-gray-300'
                                                }`}>
                                                {s.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Items */}
                            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                <h3 className="font-black text-lg mb-4">Productos</h3>
                                <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {item.image && (
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-bold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                            </div>
                                            <p className="font-black text-primary">
                                                ${(item.price * item.quantity).toLocaleString('es-AR')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                                    <span className="font-bold text-gray-600">Total Pagado</span>
                                    <span className="text-2xl font-black text-gray-900">
                                        ${order.total.toLocaleString('es-AR')}
                                    </span>
                                </div>
                            </div>

                            <div className="text-center">
                                <Link href="/contacto" className="text-sm text-gray-500 hover:text-primary underline">
                                    ¿Tenés algún problema con tu pedido? Contactanos
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
