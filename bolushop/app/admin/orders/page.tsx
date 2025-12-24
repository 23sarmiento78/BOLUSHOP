"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock type since we are client side fetching via server component usually, 
// but for simplicity in this admin panel we might fetch or pass data.
// In a real App Router app, this should probably be a Server Component scanning the DB,
// but for interactivity (buttons), we use client features. 
// We will implement as Client Component fetching from an API to allow dynamic updates without refresh tricks.

// Since the DB is local JSON, we can also just make this a Server Component if we use Server Actions,
// but let's stick to the consistent API pattern used so far.

export default function OrdersPage() {
    // Note: In a real app we would fetch this. For this demo, we might need an API to GET orders too.
    // Let's assume we create a GET endpoint or pass data initially. 
    // For simplicity, let's create a quick API endpoint to GET orders.
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        fetch('/api/admin/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data.orders);
                setLoading(false);
            });
    }, []);

    const handleCancel = async (id: string) => {
        if (!confirm('¿Estás seguro de cancelar este pedido y solicitar reembolso?')) return;

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: id, action: 'cancel' }),
            });

            if (res.ok) {
                alert('Pedido cancelado. Se envió el correo al cliente.');
                // Refresh list locally
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
            } else {
                alert('Error al cancelar');
            }
        } catch (e) {
            console.error(e);
            alert('Error de conexión');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando pedidos...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Gestión de Pedidos</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Fecha</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Cliente</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Total</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Estado</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50/50">
                                <td className="p-4 text-sm font-mono text-gray-500">#{order.id.slice(0, 8)}</td>
                                <td className="p-4 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <div className="text-sm font-medium">{order.payer?.name || 'Anónimo'}</div>
                                    <div className="text-xs text-gray-400">{order.payer?.email || '-'}</div>
                                </td>
                                <td className="p-4 text-sm font-bold">${order.total.toLocaleString('es-AR')}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                        ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}
                                    `}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {order.status !== 'cancelled' && (
                                        <button
                                            onClick={() => handleCancel(order.id)}
                                            className="text-red-500 text-xs font-bold hover:underline"
                                        >
                                            Cancelar / Reembolsar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="p-8 text-center text-gray-400">No hay pedidos registrados.</div>
                )}
            </div>
        </div>
    );
}
