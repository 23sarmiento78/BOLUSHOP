"use client";
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, total } = useCart();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        address: '',
        city: '', // Optional but good
        email: '',
        phone: ''
    });

    const handlePayment = async () => {
        if (!formData.name || !formData.address || !formData.email) {
            alert("Por favor completá los datos de envío.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    payer: {
                        name: `${formData.name} ${formData.lastname}`,
                        email: formData.email,
                        address: formData.address,
                        phone: formData.phone
                    }
                }),
            });
            const data = await response.json();
            if (data.init_point) {
                // Save Order info in localStorage for Vercel/persistence fallback
                const orderData = {
                    id: data.orderId,
                    items,
                    payer: {
                        name: `${formData.name} ${formData.lastname}`,
                        email: formData.email,
                        address: formData.address,
                        phone: formData.phone
                    },
                    total: total,
                    date: new Date().toISOString()
                };
                localStorage.setItem(`order_${data.orderId}`, JSON.stringify(orderData));

                window.location.href = data.init_point;
            } else {
                alert('Error al iniciar el pago: ' + (data.details || 'Desconocido'));
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión con el servidor.');
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    Datos de Envío y Pago
                </h1>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Juan"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                                <input
                                    type="text"
                                    value={formData.lastname}
                                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                    className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Pérez"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Completa (Calle, Altura, Ciudad)</label>
                            <input
                                type="text"
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Av. Corrientes 1234, CABA"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="juan@ejemplo.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Celular / WhatsApp (Ej: 11 1234 5678)</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="11 1234 5678"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-900">Total a pagar:</span>
                                <span className="text-2xl font-bold text-primary">${total.toLocaleString('es-AR')}</span>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loading || items.length === 0}
                                className="w-full bg-blue-500 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span>Procesando...</span>
                                ) : (
                                    <>
                                        <span>Pagar con</span>
                                        <span className="font-extrabold">Mercado Pago</span>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-3">Transacción 100% segura y encriptada</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
