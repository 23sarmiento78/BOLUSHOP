"use client";
import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        profitMargin: 1.0,
        shippingCost: 0,
        averageShippingCost: 6000,
        isFreeShippingEnabled: true,
        shippingJson: {
            caba: 3000,
            gba1: 5000,
            gba2: 5500,
            gba3: 8500,
            rest: 9000
        },
        siteName: "BoluShop",
        siteDescription: "",
        whatsappNumber: "",
        minPurchaseAmount: 35000
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    setSettings(prev => ({
                        ...prev,
                        ...data.settings,
                        shippingJson: data.settings.shippingJson || prev.shippingJson
                    }));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const updateShippingZone = (zone: string, value: number) => {
        setSettings({
            ...settings,
            shippingJson: {
                ...settings.shippingJson,
                [zone as keyof typeof settings.shippingJson]: value
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
            } else {
                setMessage({ type: 'error', text: `Error: ${data.details || data.error || 'Error al guardar configuración'}` });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: `Error de conexión: ${error.message}` });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-2 border-[#ff6b35] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-[#64748b] font-medium">Cargando configuración...</p>
        </div>
    );

    return (
        <div className="max-w-3xl space-y-6">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Configuración</h2>
                <p className="admin-page-subtitle">Margen, envíos, identidad y SEO de la tienda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Lógica de Precios y Envío Gratis */}
                <div className="admin-card">
                    <h2 className="text-base font-semibold text-[#0a1628] mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-sm">🚀</span>
                        Envío gratis y precios
                    </h2>

                    <div className="mb-10 p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-black text-emerald-900">Activar Envío Gratis en toda la tienda</p>
                                <p className="text-xs font-bold text-emerald-600">Al activar esto, el costo de envío en el checkout será $0.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSettings({ ...settings, isFreeShippingEnabled: !settings.isFreeShippingEnabled })}
                                className={`w-14 h-8 rounded-full transition-all relative ${settings.isFreeShippingEnabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.isFreeShippingEnabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Margen de Ganancia (Multiplicador)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={settings.profitMargin}
                                    onChange={(e) => setSettings({ ...settings, profitMargin: Number(e.target.value) })}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-black text-gray-900 text-lg"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Ej: 1.35 = 35%</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Costo de Envío Promedio (Bundled)</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg font-black text-emerald-600">$</span>
                                <input
                                    type="number"
                                    value={settings.averageShippingCost}
                                    onChange={(e) => setSettings({ ...settings, averageShippingCost: Number(e.target.value) })}
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-black text-gray-900 text-lg"
                                />
                            </div>
                            <p className="mt-2 text-[10px] font-bold text-gray-400 px-1 italic">Monto a sumar directamente al precio final para absorber el flete.</p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Compra Mínima Requerida</label>
                        <div className="relative max-w-xs">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg font-black text-primary">$</span>
                            <input
                                type="number"
                                value={settings.minPurchaseAmount}
                                onChange={(e) => setSettings({ ...settings, minPurchaseAmount: Number(e.target.value) })}
                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-black text-gray-900 text-lg"
                            />
                        </div>
                        <p className="mt-2 text-[10px] font-bold text-gray-400 px-1 italic">El cliente no podrá avanzar al checkout si el total del carrito es menor a este valor.</p>
                    </div>

                    {/* Tarifas Regionales (Solo se usan si el envío gratis está desactivado) */}
                    <div className={`mt-10 space-y-6 pt-10 border-t border-gray-100 transition-opacity ${settings.isFreeShippingEnabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 px-1 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                                Tarifas por Zonas (Manual)
                            </h3>
                            {settings.isFreeShippingEnabled && <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full text-gray-400 uppercase">Desactivado por Envío Gratis</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { key: 'caba', label: 'CABA', price: settings.shippingJson?.caba },
                                { key: 'gba1', label: 'GBA 1 (Primer Cordón)', price: settings.shippingJson?.gba1 },
                                { key: 'gba2', label: 'GBA 2 (Segundo Cordón)', price: settings.shippingJson?.gba2 },
                                { key: 'gba3', label: 'GBA 3 (Tercer Cordón)', price: settings.shippingJson?.gba3 },
                                { key: 'rest', label: 'Resto del País', price: settings.shippingJson?.rest },
                            ].map((zone) => (
                                <div key={zone.key}>
                                    <label className="block text-[9px] font-black uppercase tracking-[0.1em] text-gray-400 mb-2 px-1">{zone.label}</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={zone.price}
                                            onChange={(e) => updateShippingZone(zone.key, Number(e.target.value))}
                                            className="w-full pl-10 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-black text-gray-900"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Identidad y SEO */}
                <div className="admin-card">
                    <h2 className="text-base font-semibold text-[#0a1628] mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-sm">🌐</span>
                        Identidad y SEO
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Nombre de la Tienda</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">WhatsApp de Contacto (con 549...)</label>
                            <input
                                type="text"
                                value={settings.whatsappNumber}
                                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Descripción Meta (SEO)</label>
                            <textarea
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-medium text-gray-700 min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>


                {message.text && (
                    <div className={`p-6 rounded-2xl font-bold text-sm text-center animate-in zoom-in duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="admin-btn admin-btn-primary !px-8 !py-3 disabled:opacity-50"
                    >
                        {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                </div>
            </form>
        </div>
    );
}
