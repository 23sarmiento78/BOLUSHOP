"use client";
import React, { useState, useEffect } from 'react';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetch('/api/admin/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data.orders || []);
                setLoading(false);
            });
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: id, action: 'update_status', status }),
            });

            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
            }
        } catch (e) {
            alert('Error al actualizar estado');
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('¿Estás seguro de cancelar este pedido y solicitar reembolso?')) return;

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: id, action: 'cancel' }),
            });

            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
            }
        } catch (e) {
            alert('Error al cancelar');
        }
    };

    const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Cargando pedidos...</p>
        </div>
    );

    return (
        <div>
            <div className="mb-10 lg:flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Gestión de Pedidos</h1>
                    <p className="text-gray-500 font-medium">Controlá y actualizá el estado de todas tus ventas.</p>
                </div>

                <div className="mt-6 lg:mt-0 flex p-1.5 bg-gray-100 rounded-2xl gap-1">
                    {['all', 'pending', 'paid', 'cancelled'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                ${filter === f ? 'bg-white text-gray-900 shadow-sm scale-[1.05]' : 'text-gray-500 hover:text-gray-700'}
                            `}
                        >
                            {f === 'all' ? 'Todos' : f === 'paid' ? 'Pagados' : f === 'pending' ? 'Pendientes' : 'Cancelados'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Orden</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Fecha</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Cliente</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="font-black text-gray-900 text-sm">#{order.id.slice(0, 8).toUpperCase()}</div>
                                    <div className="text-[10px] font-bold text-primary uppercase tracking-tighter">MercadoPago ID: {order.paymentId?.split('-').pop() || 'N/A'}</div>
                                </td>
                                <td className="px-8 py-6 text-sm font-medium text-gray-600">
                                    {new Date(order.date).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-sm font-black text-gray-800">{order.payer?.name || 'Anónimo'}</div>
                                    <div className="text-xs text-gray-400 font-medium">{order.payer?.email || '-'}</div>
                                </td>
                                <td className="px-8 py-6 text-sm font-black text-gray-900">
                                    ${order.total.toLocaleString('es-AR')}
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm
                                        ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                            order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                'bg-red-100 text-red-700'}
                                    `}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'paid')}
                                                className="bg-emerald-50 text-emerald-600 p-2 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all text-xs font-black uppercase tracking-tighter"
                                            >
                                                Confirmar Pago
                                            </button>
                                        )}
                                        {order.status !== 'cancelled' && (
                                            <button
                                                onClick={() => handleCancel(order.id)}
                                                className="bg-red-50 text-red-600 p-2 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all text-xs font-black uppercase tracking-tighter"
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="text-6xl mb-4 opacity-10">🔍</div>
                        <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No se encontraron pedidos con este filtro</p>
                    </div>
                )}
            </div>
        </div>
    );
}
