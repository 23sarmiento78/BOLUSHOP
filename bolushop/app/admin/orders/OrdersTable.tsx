"use client";

import { useState } from "react";
import { Order } from "@/lib/types";
import { updateOrderStatusAction } from "@/app/actions/admin";
import { toast } from "sonner";
import Image from "next/image";

interface Props {
    initialOrders: Order[];
}

export default function OrdersTable({ initialOrders }: Props) {
    const [orders, setOrders] = useState(initialOrders);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const handleStatusChange = async (orderId: string, newStatus: string, extras?: any) => {
        setIsLoading(true);
        try {
            const success = await updateOrderStatusAction(orderId, newStatus, extras);
            if (success) {
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any, ...extras } : o));
                toast.success("Pedido actualizado correctamente");
            } else {
                toast.error("Error al actualizar pedido");
            }
        } catch (e) {
            toast.error("Error desconocido");
        } finally {
            setIsLoading(false);
        }
    };

    const statusColors: any = {
        pending: "bg-yellow-100 text-yellow-800",
        paid: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800"
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-gray-100">
                {orders.map((order) => (
                    <div key={order.id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="font-black text-gray-900 text-base mb-1">{order.payer.name}</p>
                                <p className="text-xs text-gray-500 font-bold mb-1">DNI: {order.payer.dni || 'N/A'}</p>
                                <p className="text-xs text-gray-600 font-mono">{order.id.slice(0, 12)}...</p>
                                <p className="text-xs text-gray-600 mt-1">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase ${statusColors[order.status] || "bg-gray-100"}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-black text-primary text-lg">${order.total.toLocaleString('es-AR')}</span>
                            <button
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors text-sm font-bold"
                            >
                                {expandedOrder === order.id ? '▲ Ocultar' : '▼ Ver Detalles'}
                            </button>
                        </div>
                        {expandedOrder === order.id && (
                            <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                                <div>
                                    <h4 className="font-black text-xs uppercase text-gray-600 mb-2">Actualizar Estado</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(order.id, status)}
                                                disabled={isLoading || order.status === status}
                                                className={`px-3 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${order.status === status
                                                    ? statusColors[status]
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    } disabled:opacity-50`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-black text-xs uppercase text-gray-600 mb-2">Productos</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
                                                {item.image && (
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                        <Image src={item.image} alt={item.name} width={48} height={48} className="object-cover" />
                                                    </div>
                                                )}
                                                <div className="flex-grow min-w-0">
                                                    <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-gray-600">{item.quantity}x ${item.price.toLocaleString('es-AR')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-sm uppercase text-gray-500 font-bold border-b border-gray-100">
                            <th className="p-4">Orden ID</th>
                            <th className="p-4">Fecha</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <>
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono text-xs">{order.id}</td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(order.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-gray-900 text-sm">{order.payer.name}</p>
                                        <p className="text-xs text-gray-500">{order.payer.dni || 'DNI N/A'}</p>
                                        <p className="text-xs text-gray-500">{order.payer.email}</p>
                                    </td>
                                    <td className="p-4 font-bold text-gray-900">
                                        ${order.total.toLocaleString('es-AR')}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${statusColors[order.status] || "bg-gray-100"}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                                className="text-gray-400 hover:text-primary transition-colors text-sm font-bold"
                                            >
                                                {expandedOrder === order.id ? 'Ocultar' : 'Ver Detalles'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedOrder === order.id && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={6} className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* Status Control */}
                                                <div>
                                                    <h3 className="font-black text-sm uppercase text-gray-400 mb-4">Actualizar Estado</h3>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                                            <button
                                                                key={status}
                                                                onClick={() => handleStatusChange(order.id, status)}
                                                                disabled={isLoading || order.status === status}
                                                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${order.status === status
                                                                    ? 'bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-2'
                                                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                                                                    }`}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <div className="mt-8">
                                                        <h3 className="font-black text-sm uppercase text-gray-400 mb-2">Seguimiento de Envío (CJ/Correo)</h3>
                                                        <div className="bg-white p-6 rounded-2xl border border-orange-100 bg-orange-50/20 space-y-4">
                                                            <div>
                                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">CJ Order Number</label>
                                                                <input
                                                                    type="text"
                                                                    defaultValue={order.cjOrderId || ""}
                                                                    placeholder="Ej: CJ12345678"
                                                                    onBlur={(e) => handleStatusChange(order.id, order.status, { cjOrderId: e.target.value })}
                                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 outline-none font-mono text-xs"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Número de Seguimiento</label>
                                                                <input
                                                                    type="text"
                                                                    defaultValue={order.trackingNumber || ""}
                                                                    placeholder="Ej: CJ123456789"
                                                                    onBlur={(e) => handleStatusChange(order.id, order.status, { trackingNumber: e.target.value })}
                                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 outline-none font-mono text-xs"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">URL de Seguimiento</label>
                                                                <input
                                                                    type="text"
                                                                    defaultValue={order.trackingUrl || ""}
                                                                    placeholder="https://t.17track.net/..."
                                                                    onBlur={(e) => handleStatusChange(order.id, order.status, { trackingUrl: e.target.value })}
                                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-xs"
                                                                />
                                                            </div>
                                                            {order.trackingUrl && (
                                                                <a href={order.trackingUrl} target="_blank" className="block text-center py-2 bg-orange-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-colors">
                                                                    Rastrear Paquete ↗
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mt-8">
                                                        <h3 className="font-black text-sm uppercase text-gray-400 mb-2">Datos de Envío Cliente</h3>
                                                        <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm">
                                                            {typeof order.payer.address === 'object' && order.payer.address !== null ? (
                                                                <>
                                                                    <p><strong>Dirección:</strong> {(order.payer.address as any).street} {(order.payer.address as any).number}</p>
                                                                    <p><strong>Ciudad:</strong> {(order.payer.address as any).city}, {(order.payer.address as any).state}</p>
                                                                    <p><strong>CP:</strong> {(order.payer.address as any).zipCode}</p>
                                                                </>
                                                            ) : (
                                                                <p><strong>Dirección Completa:</strong> {order.payer.address as string}</p>
                                                            )}
                                                            <p><strong>Teléfono:</strong> {order.payer.phone || 'No especificado'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Items */}
                                                <div>
                                                    <h3 className="font-black text-sm uppercase text-gray-400 mb-4">Productos</h3>
                                                    <div className="space-y-3">
                                                        {order.items.map((item: any, idx: number) => (
                                                            <div key={idx} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100">
                                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                                    {item.image && (
                                                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-sm text-gray-900">{item.name}</p>
                                                                    <div className="flex items-center gap-3">
                                                                        <p className="text-xs text-gray-500 font-bold">Cant: {item.quantity}</p>
                                                                        {item.cjProductId && (
                                                                            <a
                                                                                href={`https://cjdropshipping.com/product-detail/${item.cjProductId}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-[10px] font-black uppercase text-orange-600 hover:orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 transition-colors"
                                                                            >
                                                                                Comprar en CJ ↗
                                                                            </a>
                                                                        )}
                                                                        {item.cjSku && !item.cjProductId && (
                                                                            <span className="text-[10px] font-bold text-gray-400">SKU: {item.cjSku}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
