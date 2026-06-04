"use client";

import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getCart, getCartTotal, CartItem } from "@/lib/cart";
import { getShippingRate } from "@/app/actions/shop";
import { LOCATION_DATA } from "@/lib/locations";
import { initMercadoPago } from '@mercadopago/sdk-react';
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [shippingCost, setShippingCost] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFreeShipping, setIsFreeShipping] = useState(true);

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
        initMercadoPago(process.env.NEXT_PUBLIC_MP_PRO_PUBLIC_KEY || '', {
            locale: 'es-AR'
        });

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
    }, [router]);

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

    const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newProvince = e.target.value;
        setFormData(prev => ({
            ...prev,
            province: newProvince,
            city: ""
        }));
    };

    const subtotal = getCartTotal();
    const total = subtotal + shippingCost;
    const [showRedirectNotice, setShowRedirectNotice] = useState(false);

    const handleCheckout = (e: FormEvent) => {
        e.preventDefault();
        setShowRedirectNotice(true);
    };

    const proceedToPayment = async () => {
        setIsProcessing(true);

        try {
            const response = await fetch('/api/create-preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart, shippingCost, formData }),
            });

            const data = await response.json();

            if (data.init_point) {
                window.location.href = data.init_point;
            } else {
                throw new Error(data.error || 'No se pudo generar el punto de inicio del pago');
            }
        } catch (error: any) {
            console.error('Error al iniciar checkout:', error);
            alert(`Error: ${error.message || 'Ocurrió un error al procesar el pago. Por favor, intenta de nuevo.'}`);
            setIsProcessing(false);
            setShowRedirectNotice(false);
        }
    };

    if (cart.length === 0) {
        return null;
    }

    return (
        <>
            <Header />
            <main className="bg-[#f8f9fb]">
                <section className="bg-gradient-to-r from-[#0f2044] via-[#1e3a6b] to-[#0f2044] py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="rounded-[3rem] bg-white/10 border border-white/20 p-10 md:p-14 text-white shadow-xl shadow-[#0f2044]/10 backdrop-blur-sm">
                            <span className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 text-[11px] uppercase tracking-[0.35em] font-black text-white/90">Checkout Seguro</span>
                            <h1 className="mt-6 text-4xl md:text-5xl font-black tracking-tight max-w-3xl">Finalizá tu compra con Mercado Pago y envío calculado según tu ubicación.</h1>
                            <p className="mt-4 max-w-2xl text-sm md:text-base text-white/75 leading-relaxed">Completá tus datos a continuación. Pagá con total seguridad y el costo de envío se calcula según tu provincia y ciudad.</p>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_0.95fr] gap-10">
                        <div>
                            <div className="rounded-[2rem] bg-white border border-[#e2e8f0] p-8 shadow-card">
                                <div className="flex items-center justify-between mb-8 gap-4">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.35em] text-[#64748b] font-black">Tus datos</p>
                                        <h2 className="text-3xl font-black text-[#0f2044]">Información de envío</h2>
                                    </div>
                                    <span className="inline-flex rounded-full bg-[#f8fafb] px-4 py-2 text-sm text-[#0f2044] font-bold border border-[#e2e8f0]">{cart.length} artículos</span>
                                </div>

                                <form onSubmit={handleCheckout} className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <label className="space-y-3">
                                            <span className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-bold">Nombre completo</span>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044]"
                                                placeholder="Como figura en tu DNI"
                                            />
                                        </label>
                                        <label className="space-y-3">
                                            <span className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-bold">DNI / CUIL</span>
                                            <input
                                                type="text"
                                                required
                                                value={formData.dni}
                                                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                                className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044]"
                                                placeholder="Número sin puntos ni guiones"
                                            />
                                        </label>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <label className="space-y-3">
                                            <span className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-bold">Email</span>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044]"
                                                placeholder="tu@email.com"
                                            />
                                        </label>
                                        <label className="space-y-3">
                                            <span className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-bold">Teléfono</span>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044]"
                                                placeholder="Cod. área + número"
                                            />
                                        </label>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-3">
                                        <label className="space-y-3">
                                            <span className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-bold">Provincia</span>
                                            <select
                                                required
                                                value={formData.province}
                                                onChange={handleProvinceChange}
                                                className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044]"
                                            >
                                                <option value="">Seleccioná tu provincia</option>
                                                {LOCATION_DATA.map((location) => (
                                                    <option key={location.province} value={location.province}>{location.province}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label className="space-y-3">
                                            <span className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-bold">Ciudad</span>
                                            <select
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044]"
                                            >
                                                <option value="">Seleccioná tu ciudad</option>
                                                {availableCities.map((city) => (
                                                    <option key={city.name} value={city.name}>{city.name}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label className="space-y-3">
                                            <span className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-bold">Código Postal</span>
                                            <input
                                                type="text"
                                                required
                                                value={formData.zipCode}
                                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                                className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044]"
                                                placeholder="Ej. 5000"
                                            />
                                        </label>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <label className="space-y-3">
                                            <span className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-bold">Calle</span>
                                            <input
                                                type="text"
                                                required
                                                value={formData.street}
                                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                                className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044]"
                                                placeholder="Nombre de la calle"
                                            />
                                        </label>
                                        <label className="space-y-3">
                                            <span className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-bold">Número</span>
                                            <input
                                                type="text"
                                                required
                                                value={formData.streetNumber}
                                                onChange={(e) => setFormData({ ...formData, streetNumber: e.target.value })}
                                                className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044]"
                                                placeholder="Número"
                                            />
                                        </label>
                                    </div>

                                    <label className="space-y-3">
                                        <span className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-bold">Departamento / Piso</span>
                                        <input
                                            type="text"
                                            value={formData.apartment}
                                            onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                                            className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044]"
                                            placeholder="Opcional"
                                        />
                                    </label>

                                    <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
                                        <div className="rounded-[2rem] border border-[#e2e8f0] bg-white p-6">
                                            <p className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-black mb-4">Resumen del pago</p>
                                            <div className="space-y-3 text-sm text-[#64748b]">
                                                <div className="flex justify-between">
                                                    <span>Subtotal</span>
                                                    <span>$ {subtotal.toLocaleString('es-AR')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Envío</span>
                                                    <span>$ {shippingCost.toLocaleString('es-AR')}</span>
                                                </div>
                                                <div className="border-t border-[#e2e8f0] pt-4 flex justify-between font-black text-[#0f2044]">
                                                    <span>Total</span>
                                                    <span>$ {total.toLocaleString('es-AR')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-[2rem] border border-[#e2e8f0] bg-[#f8f9fb] p-6 flex flex-col justify-between gap-4">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-black mb-3">Pago seguro</p>
                                                <p className="text-sm text-[#0f2044] font-semibold">Mercado Pago Pro</p>
                                                <p className="text-sm text-[#64748b] leading-relaxed mt-3">Tu pago se procesa en un entorno seguro y protegido.</p>
                                            </div>
                                            <p className="text-xs uppercase tracking-[0.35em] text-[#10b981] font-black">Costo de envío calculado según la dirección ingresada</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <button
                                            type="submit"
                                            className="w-full rounded-3xl bg-[#e8630a] text-white py-4 text-lg font-black transition hover:bg-[#d55708]"
                                        >
                                            Confirmar datos
                                        </button>
                                        <button
                                            type="button"
                                            onClick={proceedToPayment}
                                            disabled={isProcessing}
                                            className="w-full rounded-3xl border border-[#e2e8f0] bg-white py-4 text-lg font-black text-[#0f2044] transition hover:bg-[#f8f9fb]"
                                        >
                                            {isProcessing ? 'Procesando pago...' : 'Ir a Mercado Pago'}
                                        </button>
                                        {showRedirectNotice && (
                                            <p className="text-sm text-[#64748b]">Serás redirigido a Mercado Pago en breve. Si no sucede, revisá tu bloqueador de ventanas emergentes.</p>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        <aside className="lg:sticky lg:top-24">
                            <div className="rounded-[2rem] bg-white border border-[#e2e8f0] p-8 shadow-card">
                                <h3 className="text-xl font-black text-[#0f2044] mb-4">Detalles del pedido</h3>
                                <div className="space-y-4">
                                    {cart.map((item, index) => (
                                        <div key={item.slug || item.name || index} className="flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-bold text-[#0f2044] truncate">{item.name}</p>
                                                <p className="text-xs text-[#64748b]">Cant. {item.quantity}</p>
                                            </div>
                                            <p className="font-black text-[#0f2044]">$ {(item.price * item.quantity).toLocaleString('es-AR')}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 rounded-3xl bg-[#f8fafb] p-5 border border-[#e2e8f0]">
                                    <p className="text-sm font-black uppercase tracking-[0.35em] text-[#64748b] mb-3">Beneficios</p>
                                    <ul className="mt-4 space-y-3 text-sm text-[#64748b]">
                                        <li>• Costo de envío calculado según tu dirección</li>
                                        <li>• Pago 100% seguro con Mercado Pago</li>
                                        <li>• Atención al cliente hasta la entrega</li>
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
