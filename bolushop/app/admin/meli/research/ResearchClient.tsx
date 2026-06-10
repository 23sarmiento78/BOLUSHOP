"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    Sparkles,
    ExternalLink,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Radar,
    List,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import OptimizePreviewModal from "@/components/admin/meli/OptimizePreviewModal";
import type { GeminiSeoResult, MeliSearchResult } from "@/lib/types/meli-scout";

export default function ResearchClient() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [optimizingId, setOptimizingId] = useState<string | null>(null);
    const [results, setResults] = useState<MeliSearchResult[]>([]);
    const [total, setTotal] = useState(0);
    const [searchedQuery, setSearchedQuery] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [preview, setPreview] = useState<{
        product: MeliSearchResult;
        seo: GeminiSeoResult;
    } | null>(null);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(
                `/api/admin/meli/search?query=${encodeURIComponent(query.trim())}`,
            );
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Error en la búsqueda");

            setResults(data.results ?? []);
            setTotal(data.total ?? 0);
            setSearchedQuery(data.query ?? query);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al buscar");
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleOptimize(product: MeliSearchResult) {
        setOptimizingId(product.id);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/admin/meli/optimize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Error al optimizar");

            setPreview({ product, seo: data.seo });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al optimizar con AI");
        } finally {
            setOptimizingId(null);
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <AdminPageHeader
                title="Product Scout"
                subtitle="Investigá tendencias en Mercado Libre y optimizá productos con IA"
                actions={
                    <Link
                        href="/admin/meli/optimized"
                        className="inline-flex items-center gap-2 border border-gray-200 bg-white text-gray-700 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                    >
                        <List size={14} />
                        Ver optimizados
                    </Link>
                }
            />

            <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl border border-gray-200 shadow-sm"
            >
                <div className="flex items-center gap-3 flex-1 px-4">
                    <Radar size={20} className="text-[#1E5BC6] shrink-0" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ej: organizador hogar, auriculares bluetooth..."
                        className="w-full py-3 outline-none font-semibold text-gray-900 placeholder:text-gray-400 bg-transparent"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="bg-[#1E5BC6] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    {loading ? "Buscando..." : "Investigar"}
                </button>
            </form>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 flex items-center gap-3 font-semibold text-sm">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 flex items-center gap-3 font-semibold text-sm">
                    <CheckCircle2 size={20} />
                    {success}
                </div>
            )}

            {searchedQuery && (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-700">
                            Resultados para <span className="text-[#1E5BC6]">&quot;{searchedQuery}&quot;</span>
                        </p>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                            {total.toLocaleString("es-AR")} en MLA · top 20
                        </span>
                    </div>

                    {results.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 font-medium">
                            No se encontraron productos para esta búsqueda.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        <th className="px-6 py-4">Producto</th>
                                        <th className="px-4 py-4">Precio</th>
                                        <th className="px-4 py-4">Vendidos</th>
                                        <th className="px-4 py-4">Link</th>
                                        <th className="px-6 py-4 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {results.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3 min-w-[280px]">
                                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                        <Image
                                                            src={item.thumbnail}
                                                            alt=""
                                                            fill
                                                            className="object-contain p-0.5"
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-gray-900 text-sm line-clamp-2">
                                                            {item.title}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                                            {item.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 font-black text-gray-900 whitespace-nowrap">
                                                ${item.price.toLocaleString("es-AR")}
                                            </td>
                                            <td className="px-4 py-4 font-bold text-gray-600 whitespace-nowrap">
                                                {item.sold_quantity.toLocaleString("es-AR")}
                                            </td>
                                            <td className="px-4 py-4">
                                                <a
                                                    href={item.permalink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[#1E5BC6] hover:underline text-xs font-bold"
                                                >
                                                    Ver <ExternalLink size={12} />
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleOptimize(item)}
                                                    disabled={optimizingId === item.id}
                                                    className="inline-flex items-center gap-2 bg-[#FFE600] text-gray-900 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-all disabled:opacity-50"
                                                >
                                                    {optimizingId === item.id ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <Sparkles size={14} />
                                                    )}
                                                    Optimizar con AI
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {preview && (
                <OptimizePreviewModal
                    product={preview.product}
                    seo={preview.seo}
                    onClose={() => setPreview(null)}
                    onSaved={() => setSuccess("Producto guardado. Verlo en Optimizados ML →")}
                />
            )}
        </div>
    );
}
