"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { getCart, getCartTotal, clearCart, CartItem } from "@/lib/cart";
import { getShippingRate } from "@/app/actions/shop";

const PROVINCIAS_ARGENTINA = [
    "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba",
    "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja",
    "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan",
    "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
    "Tierra del Fuego", "Tucumán"
];

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [shippingCost, setShippingCost] = useState(0);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        province: "",
        zipCode: "",
    });

    useEffect(() => {
        const cartItems = getCart();
        if (cartItems.length === 0) {
            router.push('/carrito');
        }
        setCart(cartItems);
    }, [router]);

    useEffect(() => {
        if (formData.province) {
            getShippingRate(formData.province).then(setShippingCost);
        }
    }, [formData.province]);

    const subtotal = getCartTotal();
    const total = subtotal + shippingCost;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    payer: formData,
                    shippingCost,
                }),
            });

            const data = await response.json();

            if (data.success && data.initPoint) {
                // Redirect to Mercado Pago
                window.location.href = data.initPoint;
            } else {
                alert('Error al procesar el pago. Por favor, intentá de nuevo.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Error al procesar el pago. Por favor, intentá de nuevo.');
            setIsLoading(false);
        }
    };

    if (cart.length === 0) {
        return null;
    }

    return (
        <>
            <Header />

            <main className="min-h-screen relative">
                {/* Video Background */}
                <div className="fixed inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-20"
                    >
                        <source src="/videohero.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white/90" />
                </div>

                <div className="relative z-10 container mx-auto px-4 py-12">
                    <h1 className="text-5xl font-black text-center mb-12">
                        Finalizá tu <span className="text-primary italic">Compra</span>
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-[3rem] p-8 shadow-2xl">
                                <h2 className="text-2xl font-black mb-6">Datos de Envío</h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-2">
                                            Nombre Completo *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-medium"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-medium"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-2">
                                                Teléfono *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-2">
                                            Dirección *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-medium"
                                            placeholder="Calle y número"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-2">
                                                Ciudad *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-medium"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-2">
                                                Provincia *
                                            </label>
                                            <select
                                                required
                                                value={formData.province}
                                                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-medium"
                                            >
                                                <option value="">Seleccioná</option>
                                                {PROVINCIAS_ARGENTINA.map((prov) => (
                                                    <option key={prov} value={prov}>{prov}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-2">
                                                CP
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.zipCode}
                                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !formData.province}
                                    className="w-full mt-8 py-5 bg-primary text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-primary/40 disabled:opacity-50 disabled:scale-100"
                                >
                                    {isLoading ? '⏳ Procesando...' : '💳 Pagar con Mercado Pago'}
                                </button>
                            </form>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/95 backdrop-blur-sm rounded-[3rem] p-8 shadow-2xl sticky top-24">
                                <h2 className="text-2xl font-black mb-6">Resumen</h2>

                                <div className="space-y-3 mb-6">
                                    {cart.map((item) => (
                                        <div key={item.productId} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {item.name} x{item.quantity}
                                            </span>
                                            <span className="font-bold">
                                                ${(item.price * item.quantity).toLocaleString('es-AR')}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-bold">${subtotal.toLocaleString('es-AR')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Envío</span>
                                        <span className="font-bold">
                                            {shippingCost > 0 ? `$${shippingCost.toLocaleString('es-AR')}` : 'Seleccioná provincia'}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="flex justify-between text-2xl">
                                        <span className="font-black">Total</span>
                                        <span className="font-black text-primary">
                                            ${total.toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-green-50 rounded-2xl">
                                    <p className="text-sm text-green-900 font-medium text-center">
                                        🔒 Pago 100% seguro con Mercado Pago
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
