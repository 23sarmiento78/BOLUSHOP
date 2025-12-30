"use client";
import { useCart } from '@/lib/cart-context';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import PaymentMethodsBrick from '@/components/PaymentMethodsBrick';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { items, total } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'pro' | 'brick' | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        address: '',
        city: '',
        email: '',
        phone: '',
        dni: ''
    });

    const isFormValid = useMemo(() => {
        return !!(formData.name && formData.address && formData.email && formData.email.includes('@') && formData.dni.length >= 7);
    }, [formData]);

    const handleTraditionalPayment = async () => {
        if (!isFormValid) {
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
                // Save Order info in localStorage
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

    const handleBrickSuccess = (result: any) => {
        // Save Order data for success page
        const orderData = {
            id: result.orderId,
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
        localStorage.setItem(`order_${result.orderId}`, JSON.stringify(orderData));

        if (result.status === 'approved') {
            router.push(`/checkout/success?orderId=${result.orderId}`);
        } else if (result.status === 'in_process' || result.status === 'pending') {
            // Redirect to success but with a pending flag or let success page handle status
            router.push(`/checkout/success?orderId=${result.orderId}&status=pending`);
        } else {
            // This case should be handled by onError in PaymentMethodsBrick usually,
            // but as a safety measure:
            alert("El pago no fue aprobado. Por favor intente con otro medio.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    Datos de Envío y Pago
                </h1>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">DNI / CUIL (Requerido para el pago)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.dni}
                                    onChange={(e) => setFormData({ ...formData, dni: e.target.value.replace(/\D/g, '') })}
                                    className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="12345678"
                                    maxLength={11}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Celular / WhatsApp</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-primary outline-none"
                                placeholder="11 1234 5678"
                            />
                        </div>
                    </div>
                </div>

                {isFormValid && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            Elegí cómo pagar
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setPaymentMethod('brick')}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === 'brick' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <div className="font-bold text-gray-900">Tarjeta Directa</div>
                                <div className="text-sm text-gray-500">Crédito o Débito sin salir de la tienda</div>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('pro')}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === 'pro' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <div className="font-bold text-gray-900">Mercado Pago / Otros</div>
                                <div className="text-sm text-gray-500">Pagar con tu app o efectivo (Rapipago)</div>
                            </button>
                        </div>

                        {paymentMethod === 'brick' && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 animate-fade-in">
                                <PaymentMethodsBrick
                                    amount={total}
                                    items={items}
                                    internalPayer={{
                                        name: `${formData.name} ${formData.lastname}`,
                                        email: formData.email,
                                        address: formData.address,
                                        phone: formData.phone
                                    }}
                                    onSuccess={handleBrickSuccess}
                                    onError={(err) => alert("Hubo un error con el pago. Por favor verificá los datos de tu tarjeta.")}
                                />
                            </div>
                        )}

                        {paymentMethod === 'pro' && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-bold text-gray-900">Total:</span>
                                    <span className="text-2xl font-bold text-primary">${total.toLocaleString('es-AR')}</span>
                                </div>
                                <button
                                    onClick={handleTraditionalPayment}
                                    disabled={loading}
                                    className="w-full bg-blue-500 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50"
                                >
                                    {loading ? "Procesando..." : "Ir a Mercado Pago"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <p className="text-center text-xs text-gray-400 mt-8 italic">
                    Tus datos están protegidos por encriptación de grado bancario.
                </p>
                <p className="text-center text-xs font-bold text-primary mt-2">
                    * Al completar el pago, deberás confirmar tu orden por WhatsApp.
                </p>
            </div>
        </div>
    );
}
