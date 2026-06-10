"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Save, Sparkles, Loader2 } from "lucide-react";
import type { GeminiSeoResult, MeliSearchResult } from "@/lib/types/meli-scout";

interface Props {
    product: MeliSearchResult;
    seo: GeminiSeoResult;
    onClose: () => void;
    onSaved: (message: string) => void;
}

export default function OptimizePreviewModal({ product, seo, onClose, onSaved }: Props) {
    const [seoTitle, setSeoTitle] = useState(seo.seo_title);
    const [seoDescription, setSeoDescription] = useState(seo.seo_description);
    const [adsenseKeywords, setAdsenseKeywords] = useState(seo.adsense_keywords);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSave() {
        setSaving(true);
        setError("");

        try {
            const res = await fetch("/api/admin/meli/optimized-products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ml_item_id: product.id,
                    original_title: product.title,
                    original_price: product.price,
                    thumbnail: product.thumbnail,
                    permalink: product.permalink,
                    sold_quantity: product.sold_quantity,
                    seo_title: seoTitle,
                    seo_description: seoDescription,
                    adsense_keywords: adsenseKeywords,
                    status: "saved",
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al guardar");

            onSaved("Producto optimizado guardado en Supabase");
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al guardar");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-100">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between rounded-t-[2rem]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FFE600]/30 rounded-xl flex items-center justify-center">
                            <Sparkles size={20} className="text-[#8B7E00]" />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 text-lg">Vista previa SEO</h3>
                            <p className="text-xs text-gray-500 font-medium">Editá antes de guardar</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0">
                            <Image src={product.thumbnail} alt="" fill className="object-contain p-1" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Original</p>
                            <p className="font-bold text-gray-900 text-sm line-clamp-2">{product.title}</p>
                            <p className="text-xs text-gray-500 mt-1">${product.price.toLocaleString("es-AR")} · {product.sold_quantity} vendidos</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1E5BC6]">
                            Título SEO (Mercado Libre)
                        </label>
                        <input
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 font-semibold text-gray-900 outline-none focus:border-[#1E5BC6] focus:ring-2 focus:ring-[#1E5BC6]/20"
                        />
                        <p className="text-[10px] text-gray-400">{seoTitle.length} caracteres</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1E5BC6]">
                            Descripción (Google Merchant Center)
                        </label>
                        <textarea
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            rows={8}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 font-medium text-gray-800 text-sm outline-none focus:border-[#1E5BC6] focus:ring-2 focus:ring-[#1E5BC6]/20 resize-y"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1E5BC6]">
                            Keywords (AdSense)
                        </label>
                        <input
                            value={adsenseKeywords}
                            onChange={(e) => setAdsenseKeywords(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 font-medium text-gray-800 outline-none focus:border-[#1E5BC6] focus:ring-2 focus:ring-[#1E5BC6]/20"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-semibold border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl border border-gray-200 font-black text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !seoTitle.trim() || !seoDescription.trim()}
                            className="flex-1 py-4 rounded-2xl bg-[#1E5BC6] text-white font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {saving ? "Guardando..." : "Guardar en Supabase"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
