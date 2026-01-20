"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getCart, getCartTotal, clearCart, CartItem } from "@/lib/cart";
import { getShippingRate } from "@/app/actions/shop";
import { LOCATION_DATA } from "@/lib/locations";
import { initMercadoPago } from '@mercadopago/sdk-react';

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [shippingCost, setShippingCost] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFreeShipping, setIsFreeShipping] = useState(true); // Default to true as per new strategy

    const [formData, setFormData] = useState({
        name: "",
        dni: "",
        email: "",
        phone: "",
        street: "",
        streetNumber: "",
        apartment: "",
        city: "",
        province: "",
        zipCode: "",
    });

    useEffect(() => {
        // Inicializar con la nueva Public Key de Pro
        initMercadoPago(process.env.NEXT_PUBLIC_MP_PRO_PUBLIC_KEY || '', {
            locale: 'es-AR'
        });

        // Fetch settings to check free shipping status and min purchase
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    setIsFreeShipping(data.settings.isFreeShippingEnabled ?? true);
                    const minAmount = data.settings.minPurchaseAmount ?? 35000;
                    if (getCartTotal() < minAmount) {
                        router.push('/carrito');
                    }
                }
            });
    }, []);

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
            city: ""
        }));
    };

    const subtotal = getCartTotal();
    const total = subtotal + shippingCost;

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const response = await fetch('/api/create-preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cart,
                    shippingCost,
                    formData
                }),
            });

            const data = await response.json();

            if (data.init_point) {
                // Redirigir al Checkout Pro de Mercado Pago
                console.log("Redirigiendo a Mercado Pago...");
                window.location.href = data.init_point;
            } else {
                throw new Error(data.error || 'No se pudo generar el punto de inicio del pago');
            }
        } catch (error: any) {
            console.error('Error al iniciar checkout:', error);
            alert(`Error: ${error.message || 'Ocurrió un error al procesar el pago. Por favor, intenta de nuevo.'}`);
        } finally {
            setIsProcessing(false);
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
                    <div className="flex items-center gap-4 mb-12 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                        <span className="text-2xl">🔒</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Checkout Seguro · Mercado Pago Pro</span>
                    </div>

                    <h2 className="text-3xl font-black mb-8 text-gray-900">Datos de Envío</h2>

                    <form onSubmit={handleCheckout} className="space-y-8">
                        <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 mb-8 border border-gray-100">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Resumen de tu pedido</h3>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-3xl font-black text-gray-900">${total.toLocaleString('es-AR')}</span>
                                <span className="text-sm font-medium text-gray-500">{cart.length} productos</span>
                            </div>
                            {isFreeShipping ? (
                                <p className="text-xs text-emerald-600 font-black mt-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    ¡Tenés ENVÍO GRATIS asegurado!
                                </p>
                            ) : (
                                shippingCost === 0 && (
                                    <p className="text-xs text-orange-500 font-bold mt-2">Calculando envío según tu dirección...</p>
                                )
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

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    DNI / CUIL
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.dni}
                                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                    className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-100 focus:border-black focus:ring-0 transition-all outline-none font-medium text-lg placeholder-gray-300"
                                    placeholder="Número sin puntos ni guiones"
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
                                    Calle
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.street}
                                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-100 focus:border-black focus:ring-0 transition-all outline-none font-medium text-lg placeholder-gray-300"
                                    placeholder="Nombre de la calle"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                        Número
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.streetNumber}
                                        onChange={(e) => setFormData({ ...formData, streetNumber: e.target.value })}
                                        className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-100 focus:border-black focus:ring-0 transition-all outline-none font-medium text-lg placeholder-gray-300"
                                        placeholder="Altura"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                        Piso / Depto / Casa
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.apartment}
                                        onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                                        className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-100 focus:border-black focus:ring-0 transition-all outline-none font-medium text-lg placeholder-gray-300"
                                        placeholder="Piso, torre o casa"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        <button
                            type="submit"
                            disabled={isProcessing || !formData.province || !formData.city || !formData.name || !formData.dni || !formData.email || !formData.street || !formData.streetNumber || !formData.phone}
                            className="w-full mt-8 py-5 bg-black text-white rounded-xl font-black text-lg uppercase tracking-widest hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:translate-y-px flex items-center justify-center gap-3 shadow-2xl shadow-black/10"
                        >
                            {isProcessing ? (
                                <>
                                    <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Procesando...
                                </>
                            ) : (
                                "Pagar con Mercado Pago"
                            )}
                        </button>

                        {/* Improved Checkout Notice */}
                        <div className="mt-8 relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-200 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex gap-5 p-6 bg-white rounded-2xl border border-amber-100 shadow-sm transition-all duration-300 group-hover:border-amber-200">
                                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:rotate-12 transition-transform shadow-inner">
                                    🚀
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-[0.15em] text-amber-800 flex items-center gap-2">
                                        Pasos a seguir después del pago
                                    </p>
                                    <p className="text-sm font-bold text-gray-600 leading-relaxed italic">
                                        "Al completar el pago, mantené la ventana abierta. La web te redirigirá automáticamente a la confirmación de WhatsApp, necesaria para procesar tu envío."
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-8 border-t border-gray-100 text-center">
                            <a href="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Volver a la tienda</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

