"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Loader2,
    AlertCircle,
    CheckCircle2,
    ExternalLink,
    Pencil,
    Trash2,
    Upload,
    Package,
    Radar,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EditOptimizedModal from "@/components/admin/meli/EditOptimizedModal";
import type { OptimizedProduct } from "@/lib/types/meli-scout";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    saved: { label: "Guardado", className: "bg-blue-50 text-blue-700" },
    draft: { label: "Borrador", className: "bg-gray-100 text-gray-600" },
    published: { label: "Publicado", className: "bg-green-50 text-green-700" },
};

export default function OptimizedProductsClient() {
    const [products, setProducts] = useState<OptimizedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [publishingId, setPublishingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editing, setEditing] = useState<OptimizedProduct | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/meli/optimized-products");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al cargar");
            setProducts(data.products ?? []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al cargar productos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    async function handlePublish(product: OptimizedProduct) {
        if (product.status === "published") return;
        if (!confirm(`¿Publicar "${product.seo_title}" como borrador pausado en Meli?`)) return;

        setPublishingId(product.id);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/admin/meli/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ optimizedProductId: product.id, asPaused: true }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al publicar");

            setSuccess(
                data.alreadyPublished
                    ? "Este producto ya estaba publicado en Meli."
                    : `Borrador creado en Meli: ${data.item_id}`,
            );
            await loadProducts();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al publicar en Meli");
        } finally {
            setPublishingId(null);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("¿Eliminar este producto optimizado?")) return;

        setDeletingId(id);
        setError("");

        try {
            const res = await fetch(`/api/admin/meli/optimized-products?id=${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al eliminar");

            setSuccess("Producto eliminado");
            await loadProducts();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al eliminar");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <AdminPageHeader
                title="Productos Optimizados"
                subtitle="Productos investigados y optimizados con IA, listos para publicar en Meli"
                actions={
                    <Link
                        href="/admin/meli/research"
                        className="inline-flex items-center gap-2 bg-[#FFE600] text-gray-900 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-all"
                    >
                        <Radar size={14} />
                        Nuevo Scout
                    </Link>
                }
            />

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

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-16 flex items-center justify-center text-gray-400 gap-3">
                        <Loader2 size={24} className="animate-spin" />
                        Cargando productos...
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-16 text-center">
                        <Package size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-500 font-medium mb-4">No hay productos optimizados aún.</p>
                        <Link
                            href="/admin/meli/research"
                            className="inline-flex items-center gap-2 text-[#1E5BC6] font-bold text-sm hover:underline"
                        >
                            Ir a Product Scout <ExternalLink size={14} />
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <th className="px-6 py-4">Producto</th>
                                    <th className="px-4 py-4">Estado</th>
                                    <th className="px-4 py-4">Precio</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((item) => {
                                    const statusInfo = STATUS_LABELS[item.status] ?? STATUS_LABELS.saved;
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3 min-w-[300px]">
                                                    {item.thumbnail && (
                                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                            <Image src={item.thumbnail} alt="" fill className="object-contain p-0.5" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-gray-900 text-sm line-clamp-2">{item.seo_title}</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">{item.ml_item_id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${statusInfo.className}`}>
                                                    {statusInfo.label}
                                                </span>
                                                {item.published_permalink && (
                                                    <a
                                                        href={item.published_permalink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block text-[10px] text-[#1E5BC6] font-bold mt-1 hover:underline"
                                                    >
                                                        Ver en Meli
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 font-black text-gray-900 whitespace-nowrap">
                                                ${(item.original_price ?? 0).toLocaleString("es-AR")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditing(item)}
                                                        className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    {item.status !== "published" && (
                                                        <button
                                                            onClick={() => handlePublish(item)}
                                                            disabled={publishingId === item.id}
                                                            className="inline-flex items-center gap-1.5 bg-[#1E5BC6] text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50"
                                                        >
                                                            {publishingId === item.id ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <Upload size={14} />
                                                            )}
                                                            Publicar
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        disabled={deletingId === item.id}
                                                        className="p-2.5 rounded-xl border border-red-100 hover:bg-red-50 text-red-500 disabled:opacity-50"
                                                        title="Eliminar"
                                                    >
                                                        {deletingId === item.id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={14} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {editing && (
                <EditOptimizedModal
                    product={editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => {
                        setSuccess("Cambios guardados");
                        loadProducts();
                    }}
                />
            )}
        </div>
    );
}
