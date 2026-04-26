"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Search, Package, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

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
            // Reordenar fotos si se eligió una distinta como principal
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

            setSuccess('¡Producto agredado a la tienda con éxito!');
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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-[#FFE600] rounded-3xl p-8 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <Package size={48} className="text-[#3483FA]" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-[#2D3277] mb-2 tracking-tight">Referidos Mercado Libre</h1>
                    <p className="text-[#2D3277]/80 font-medium">
                        Pegá el link de un producto y traelo automáticamente a tu tienda con nuestro sistema de compra segura.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="url"
                            required
                            placeholder="Ej: https://articulo.mercadolibre.com.ar/MLA-1111111-termo..."
                            className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-200 rounded-2xl focus:border-[#3483FA] focus:ring-0 focus:bg-white text-gray-900 transition-all font-medium border"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#3483FA] text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 whitespace-nowrap min-w-[200px]"
                    >
                        {loading ? 'Buscando API...' : 'Obtener Live View'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 font-medium">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}
            </div>

            {previewData && (
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <div className="border-b border-gray-100 bg-gray-50 px-8 py-4 flex items-center justify-between">
                        <h3 className="font-bold text-gray-700 uppercase tracking-widest text-xs">👀 Live View API ML</h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#00A650]">
                            <CheckCircle2 size={16} /> API Conectada Exitosamente
                        </div>
                    </div>

                    <div className="p-8 flex flex-col lg:flex-row gap-10">
                        {/* Imagestage Layout - ML Style */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-4">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 flex-shrink-0 cursor-zoom-in">
                                {previewData.pictures && previewData.pictures[previewData.mainImageIndex || 0] ? (
                                    <Image
                                        src={previewData.pictures[previewData.mainImageIndex || 0]}
                                        alt="Preview"
                                        fill
                                        className="object-contain p-4 hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">Sin foto principal</div>
                                )}
                            </div>

                            {/* MINI GALLERY */}
                            {previewData.pictures && previewData.pictures.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {previewData.pictures.map((pic: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setPreviewData({ ...previewData, mainImageIndex: idx })}
                                            className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${(previewData.mainImageIndex || 0) === idx ? 'border-[#3483FA]' : 'border-transparent bg-gray-50'}`}
                                        >
                                            <Image src={pic} alt={`Thumb ${idx}`} fill className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col justify-start text-left">
                            <span className="text-xs font-medium text-gray-400 mb-2">Condición: {previewData.condition === 'new' ? 'Nuevo' : 'Usado'}</span>

                            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{previewData.title}</h2>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex text-[#3483FA] text-sm">★★★★★</div>
                                <span className="text-xs text-gray-400 font-medium tracking-wide">COMPRA PROTEGIDA</span>
                            </div>
                            <div className="mb-8">
                                <label className="text-xs font-bold text-[#3483FA] uppercase tracking-widest mb-2 block flex items-center gap-1">💰 Precio detectado (Puedes editarlo manual)</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-4xl font-light text-gray-900">$</span>
                                    <input
                                        type="number"
                                        value={previewData.price || 0}
                                        onChange={(e) => setPreviewData({ ...previewData, price: Number(e.target.value) })}
                                        className="text-4xl font-black text-gray-900 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 focus:border-[#3483FA] w-48 outline-none focus:ring-2 focus:ring-[#3483FA]/20 px-3 py-1 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-gray-100">
                                {success ? (
                                    <div className="bg-[#00A650]/10 text-[#00A650] py-4 rounded-2xl text-center font-bold flex items-center justify-center gap-2 shadow-sm">
                                        <CheckCircle2 /> {success}
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-[#3483FA] text-white w-full py-5 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                                    >
                                        {saving ? 'Guardando producto...' : <><Plus size={24} /> Publicar este producto en mi tienda</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
