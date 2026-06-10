"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Search, Package, Plus, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Zap } from 'lucide-react';

export default function MercadoLibreAdmin() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError('');
        setPreviewData(null);
        setSuccess('');

        try {
            const res = await fetch('/api/ml-fetch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error fetching data');
            }

            setPreviewData({
                ...data.data,
                originalUrl: url
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!previewData) return;
        setSaving(true);
        setError('');

        try {
            const finalPictures = [...(previewData.pictures || [])];
            if (previewData.mainImageIndex && previewData.mainImageIndex > 0) {
                const selected = finalPictures.splice(previewData.mainImageIndex, 1)[0];
                finalPictures.unshift(selected);
            }

            const res = await fetch('/api/admin/products/ml', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...previewData,
                    pictures: finalPictures
                })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Error al guardar');

            setSuccess('¡Producto sincronizado con éxito!');
            setTimeout(() => {
                setPreviewData(null);
                setUrl('');
                setSuccess('');
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Importar de <span className="text-[#1E5BC6]">Mercado Libre</span></h1>
                    <p className="text-gray-500 font-medium italic">Sincroniza productos externos con un solo click usando el motor de scraping de BoluShop.</p>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href={`https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_MELI_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL || '')}/api/auth/callback`}
                        className="bg-[#FFE600] text-gray-900 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg"
                    >
                        <ExternalLink size={18} />
                        Conectar Cuenta ML
                    </a>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#FFE600]/20 border border-[#FFE600]/40 rounded-2xl">
                        <Zap className="text-[#8B7E00]" size={20} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Auto-Sincronización Activa</span>
                    </div>
                </div>
            </div>

            {/* URL Search Card */}
            <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <ExternalLink size={32} className="text-[#1E5BC6]" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Link del Producto</h2>
                        <p className="text-gray-500 text-sm font-semibold">Pegá la URL completa del artículo de Mercado Libre para previsualizar sus datos.</p>
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 p-2 bg-gray-50 rounded-3xl border border-gray-200/60 transition-all focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-blue-500/10">
                        <input
                            type="url"
                            required
                            placeholder="https://articulo.mercadolibre.com.ar/MLA-..."
                            className="bg-transparent border-none w-full px-6 py-4 outline-none font-bold text-gray-900 placeholder:text-gray-400"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#1E5BC6] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                        >
                            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                            {loading ? 'Consultando...' : 'Obtener Datos'}
                        </button>
                    </form>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 flex items-center gap-4 font-bold text-sm animate-in slide-in-from-top-2">
                            <AlertCircle size={24} />
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Live Preview Section */}
            {previewData && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-700">
                    {/* Left: Gallery & Data */}
                    <div className="lg:col-span-8 bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="p-10 md:p-14 space-y-10">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                                <div className="space-y-1">
                                    <h3 className="font-black text-gray-900 text-lg tracking-tight">Previsualización del Ítem</h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">ID: {previewData.id}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${previewData.condition === 'new' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {previewData.condition === 'new' ? '✨ Artículo Nuevo' : '📦 Artículo Usado'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div className="relative aspect-square rounded-[3rem] bg-gray-50 border border-gray-100 overflow-hidden shadow-inner group">
                                        {previewData.pictures?.[previewData.mainImageIndex || 0] ? (
                                            <Image
                                                src={previewData.pictures[previewData.mainImageIndex || 0]}
                                                alt="Main"
                                                fill
                                                className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : <div className="absolute inset-0 flex items-center justify-center text-gray-300">No Image</div>}
                                    </div>

                                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                        {previewData.pictures?.map((pic: string, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => setPreviewData({ ...previewData, mainImageIndex: idx })}
                                                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-4 flex-shrink-0 transition-all ${(previewData.mainImageIndex || 0) === idx ? 'border-[#1E5BC6]' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                                            >
                                                <Image src={pic} alt="Thumb" fill className="object-cover p-1" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8 flex flex-col justify-center">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight italic">
                                            {previewData.title}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-[#D4AF37]">★★★★★</div>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Verified ML Data</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-[#1E5BC6] uppercase tracking-[0.3em] block">Precio Final en BoluShop</label>
                                        <div className="flex items-center gap-3 p-8 bg-gray-900 rounded-[2rem] shadow-2xl shadow-gray-200">
                                            <span className="text-3xl font-black text-white/30">$</span>
                                            <input
                                                type="number"
                                                value={previewData.price || 0}
                                                onChange={(e) => setPreviewData({ ...previewData, price: Number(e.target.value) })}
                                                className="bg-transparent border-none text-4xl mb-1 font-black w-full outline-none focus:ring-0 p-0 text-white"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 italic">Podés editar este precio antes de publicar.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions & Stats */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-900/20">
                            <h3 className="text-xl font-black mb-6 italic">Publicar</h3>
                            <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium">Al publicar, el item se añadirá automáticamente a la sección <b>Imperdibles ML</b> y estará disponible para tus clientes de inmediato.</p>

                            {success ? (
                                <div className="bg-green-600 text-white p-6 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest animate-bounce">
                                    <CheckCircle2 size={24} /> {success}
                                </div>
                            ) : (
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full bg-primary text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    {saving ? <RefreshCw className="animate-spin" /> : <Plus size={20} />}
                                    {saving ? 'Publicando...' : 'Confirmar & Publicar'}
                                </button>
                            )}
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 space-y-6">
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Información Técnica</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                    <span className="text-gray-500 text-xs font-bold uppercase">Stock ML</span>
                                    <span className="text-gray-900 font-extrabold">{previewData.initial_quantity || 1} u.</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                    <span className="text-gray-500 text-xs font-bold uppercase">Categoría</span>
                                    <span className="text-gray-900 font-extrabold">{previewData.category_id || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-gray-500 text-xs font-bold uppercase">Envío</span>
                                    <span className="text-green-600 font-extrabold">Gratis</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
