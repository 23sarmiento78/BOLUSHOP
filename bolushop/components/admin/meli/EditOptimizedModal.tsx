"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Save, Loader2 } from "lucide-react";
import type { OptimizedProduct } from "@/lib/types/meli-scout";

interface Props {
    product: OptimizedProduct;
    onClose: () => void;
    onSaved: () => void;
}

export default function EditOptimizedModal({ product, onClose, onSaved }: Props) {
    const [seoTitle, setSeoTitle] = useState(product.seo_title);
    const [seoDescription, setSeoDescription] = useState(product.seo_description);
    const [adsenseKeywords, setAdsenseKeywords] = useState(product.adsense_keywords ?? "");
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
                    ml_item_id: product.ml_item_id,
                    original_title: product.original_title,
                    original_price: product.original_price,
                    thumbnail: product.thumbnail,
                    permalink: product.permalink,
                    sold_quantity: product.sold_quantity,
                    seo_title: seoTitle,
                    seo_description: seoDescription,
                    adsense_keywords: adsenseKeywords,
                    status: product.status === "published" ? "published" : "saved",
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al guardar");

            onSaved();
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
                <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between">
                    <h3 className="font-black text-gray-900 text-lg">Editar producto optimizado</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1E5BC6]">Título SEO</label>
                        <input
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 font-semibold outline-none focus:border-[#1E5BC6]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1E5BC6]">Descripción</label>
                        <textarea
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            rows={8}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 font-medium text-sm outline-none focus:border-[#1E5BC6] resize-y"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1E5BC6]">Keywords</label>
                        <input
                            value={adsenseKeywords}
                            onChange={(e) => setAdsenseKeywords(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#1E5BC6]"
                        />
                    </div>
                    {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-4 rounded-2xl bg-[#1E5BC6] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
