"use client";
import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        profitMargin: 1.05,
        shippingCost: 5000,
        shippingJson: {
            caba: 3000,
            gba1: 5000,
            gba2: 5500,
            gba3: 8500,
            rest: 9000
        },
        siteName: "BoluShop",
        siteDescription: "",
        whatsappNumber: ""
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

            if (res.ok) {
                setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
            } else {
                setMessage({ type: 'error', text: 'Error al guardar configuración' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Cargando configuración...</p>
        </div>
    );

    return (
        <div className="max-w-4xl">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Configuración Global</h1>
                <p className="text-gray-500 font-medium">Ajustá los parámetros base de tu tienda.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Rentabilidad y Envío */}
                <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <span className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">💰</span>
                        Rentabilidad y Envío Regional
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Margen de Ganancia (Multiplicador)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={settings.profitMargin}
                                    onChange={(e) => setSettings({ ...settings, profitMargin: Number(e.target.value) })}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-black text-gray-900"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Ej: 1.05 = 5%</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Costo de Envío Base (Fallback)</label>
                            <input
                                type="number"
                                value={settings.shippingCost}
                                onChange={(e) => setSettings({ ...settings, shippingCost: Number(e.target.value) })}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-black text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-gray-50">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4 px-1 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                            Tarifas por Zonas (Argentina)
                        </h3>

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
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-600">$</span>
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
                <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <span className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">🌐</span>
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
                        className="w-full md:w-auto px-12 py-5 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50 active:scale-95"
                    >
                        {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                </div>
            </form>
        </div>
    );
}
