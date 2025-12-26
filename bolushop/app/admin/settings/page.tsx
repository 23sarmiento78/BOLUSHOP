"use client";
import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        profitMargin: 1.05,
        shippingCost: 5000,
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
                if (data.settings) setSettings(data.settings);
                setLoading(false);
            });
    }, []);

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
                {/* Rentabilidad */}
                <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <span className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">💰</span>
                        Rentabilidad y Envío
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                            <p className="mt-2 text-[10px] text-gray-400 font-medium px-1">Este valor se aplica al importar productos nuevos.</p>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Costo de Envío Base (ARS)</label>
                            <input
                                type="number"
                                value={settings.shippingCost}
                                onChange={(e) => setSettings({ ...settings, shippingCost: Number(e.target.value) })}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-black text-gray-900"
                            />
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
