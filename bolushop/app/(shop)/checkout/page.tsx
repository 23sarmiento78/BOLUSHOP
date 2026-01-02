"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getCart, getCartTotal, clearCart, CartItem } from "@/lib/cart";
import { getShippingRate } from "@/app/actions/shop";
import { LOCATION_DATA } from "@/lib/locations";
import { initMercadoPago, Wallet, Payment } from '@mercadopago/sdk-react';

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [shippingCost, setShippingCost] = useState(0);
    const [showPaymentBrick, setShowPaymentBrick] = useState(false);

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
        initMercadoPago(process.env.NEXT_PUBLIC_MP_BRICKS_PUBLIC_KEY || '', {
            locale: 'es-AR'
        });
    }, []);

    // Derived state for available cities based on selected province
    const availableCities = useMemo(() => {
        const provinceData = LOCATION_DATA.find(p => p.province === formData.province);
        return provinceData ? provinceData.cities : [];
    }, [formData.province]);

    useEffect(() => {
        const cartItems = getCart();
        if (cartItems.length === 0) {
            router.push('/carrito');
        }
        setCart(cartItems);
    }, [router]);

    // Recalculate shipping when Province OR City changes
    useEffect(() => {
        if (formData.province && formData.city) {
            getShippingRate(formData.province, formData.city).then(setShippingCost);
        } else {
            setShippingCost(0);
        }
    }, [formData.province, formData.city]);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProvince = e.target.value;
        setFormData(prev => ({
            ...prev,
            province: newProvince,
            city: "" // Reset city when province changes
        }));
    };

    const subtotal = getCartTotal();
    const total = subtotal + shippingCost;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowPaymentBrick(true);
        // Scroll to payment
        setTimeout(() => {
            document.getElementById('payment_container')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const processPayment = async (param: any) => {
        console.log("🎁 Payment Brick Params:", param);
        const deviceId = (window as any).MP_DEVICE_SESSION_ID;

        try {
            const response = await fetch('/api/process_payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...param,
                    deviceId,
                    metadata: {
                        items: cart,
                        payer: formData
                    }
                }),
            });

            const data = await response.json();

            if (data.status === 'approved') {
                router.push(`/exito?order_id=${data.orderId}`);
            } else if (data.status === 'in_process' || data.status === 'pending') {
                router.push(`/exito?order_id=${data.orderId}&status=pending`);
            } else if (data.status === 'rejected') {
                router.push(`/rechazado?status_detail=${data.status_detail || ''}`);
            } else {
                const errorMsg = data.details || data.error || 'Error al procesar el pago';
                alert(`Error: ${errorMsg}`);
                throw new Error(errorMsg);
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            throw error; // Re-throw for Brick internal handling
        }
    };

    if (cart.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Left Side - Video (Fixed on Desktop) */}
            <div className="lg:w-1/2 relative lg:fixed lg:inset-y-0 lg:left-0 h-[30vh] lg:h-full overflow-hidden bg-black">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-80"
                >
                    <source src="/videohero.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12 text-center">
                    <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter">
                        BOLU<span className="text-primary">SHOP</span>
                    </h1>
                    <p className="text-lg lg:text-2xl font-medium max-w-md leading-relaxed opacity-90">
                        Estás a un paso de tener lo mejor. Completá tus datos y recibilo en casa.
                    </p>
                </div>
            </div>

            {/* Right Side - Scrollable Form */}
            <div className="lg:w-1/2 lg:ml-[50%] min-h-screen bg-white">
                <div className="p-6 lg:p-12 xl:p-20 max-w-3xl mx-auto">
                    {/* Simplified Header for Trust */}
                    <div className="flex items-center gap-4 mb-12 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                        <span className="text-2xl">🔒</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Checkout Seguro · Encriptado 256-bit</span>
                    </div>

                    <h2 className="text-3xl font-black mb-8 text-gray-900">Datos de Envío</h2>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Summary at top for mobile/desktop context */}
                        <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 mb-8 border border-gray-100">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Resumen de tu pedido</h3>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-3xl font-black text-gray-900">${total.toLocaleString('es-AR')}</span>
                                <span className="text-sm font-medium text-gray-500">{cart.length} productos</span>
                            </div>
                            {shippingCost === 0 && (
                                <p className="text-xs text-orange-500 font-bold mt-2">Calculando envío según tu dirección...</p>
                            )}
                            <div className="mt-4 flex -space-x-2 overflow-hidden">
                                {cart.slice(0, 5).map((item, i) => (
                                    <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src={item.image || "/placeholder.png"} alt={item.name} />
                                ))}
                                {cart.length > 5 && (
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 text-xs font-bold text-gray-600">
                                        +{cart.length - 5}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-100 focus:border-black focus:ring-0 transition-all outline-none font-medium text-lg placeholder-gray-300"
                                    placeholder="Como figura en tu DNI"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-100 focus:border-black focus:ring-0 transition-all outline-none font-medium text-lg placeholder-gray-300"
                                        placeholder="tu@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-100 focus:border-black focus:ring-0 transition-all outline-none font-medium text-lg placeholder-gray-300"
                                        placeholder="Cod. Área + Número"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Dirección de Entrega
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-100 focus:border-black focus:ring-0 transition-all outline-none font-medium text-lg placeholder-gray-300"
                                    placeholder="Calle, Altura, Piso/Depto"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Province Select */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                        Provincia
                                    </label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={formData.province}
                                            onChange={handleProvinceChange}
                                            className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-100 focus:border-black focus:ring-0 transition-all outline-none font-medium text-lg appearance-none cursor-pointer"
                                        >
                                            <option value="">Seleccionar</option>
                                            {LOCATION_DATA.map((loc) => (
                                                <option key={loc.province} value={loc.province}>
                                                    {loc.province}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                    </div>
                                </div>

                                {/* City Select (Dependent) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                        Localidad
                                    </label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            disabled={!formData.province}
                                            className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-100 focus:border-black focus:ring-0 transition-all outline-none font-medium text-lg appearance-none cursor-pointer disabled:bg-gray-50"
                                        >
                                            <option value="">{formData.province ? 'Seleccionar Localidad' : '...'}</option>
                                            {availableCities.map((city) => (
                                                <option key={city.name} value={city.name}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Código Postal
                                </label>
                                <input
                                    type="text"
                                    value={formData.zipCode}
                                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                    className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-100 focus:border-black focus:ring-0 transition-all outline-none font-medium text-lg placeholder-gray-300"
                                    placeholder="CPA o Numérico"
                                />
                            </div>
                        </div>

                        {!showPaymentBrick ? (
                            <button
                                type="submit"
                                disabled={isLoading || !formData.province || !formData.city || !formData.name || !formData.email || !formData.address || !formData.phone}
                                className="w-full mt-8 py-5 bg-black text-white rounded-xl font-black text-lg uppercase tracking-widest hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:translate-y-px"
                            >
                                Continuar al Pago
                            </button>
                        ) : (
                            <div id="payment_container" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <p className="text-center text-xs mb-4 font-bold text-gray-400 uppercase tracking-widest">
                                    Seleccioná tu método de pago
                                </p>
                                <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-100">
                                    <Payment
                                        initialization={{
                                            amount: total,
                                            payer: {
                                                email: formData.email,
                                            }
                                        }}
                                        customization={{
                                            visual: {
                                                style: {
                                                    theme: "default",
                                                },
                                            },
                                            paymentMethods: {
                                                maxInstallments: 12,
                                                creditCard: "all",
                                                debitCard: "all",
                                                prepaidCard: "all",
                                                ticket: "all",
                                                bankTransfer: "all",
                                                atm: "all",
                                                mercadoPago: "all",
                                            }
                                        }}
                                        onSubmit={processPayment}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentBrick(false)}
                                    className="w-full mt-6 py-3 text-gray-400 font-bold hover:text-black transition-colors text-xs uppercase tracking-widest"
                                >
                                    ← Modificar datos
                                </button>
                            </div>
                        )}

                        <div className="pt-8 mt-8 border-t border-gray-100 text-center">
                            <a href="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Volver a la tienda</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
