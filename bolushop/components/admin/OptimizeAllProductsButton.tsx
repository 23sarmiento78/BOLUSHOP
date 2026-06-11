"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Megaphone } from "lucide-react";

interface OptimizeResult {
    success: boolean;
    optimized: number;
    total: number;
    skipped?: number;
    alreadyOptimized?: number;
    pending?: number;
    quotaExceeded?: boolean;
    errors?: string[];
}

export default function OptimizeAllProductsButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function runOptimize(force: boolean) {
        setLoading(true);
        setMessage(force ? "Reoptimizando catálogo..." : "Optimizando pendientes con Gemini...");
        setError(null);

        try {
            const res = await fetch("/api/admin/products/optimize-all", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ force }),
            });
            const data: OptimizeResult = await res.json();

            const parts: string[] = [];
            if (data.optimized > 0) parts.push(`${data.optimized} optimizados`);
            if (data.alreadyOptimized) parts.push(`${data.alreadyOptimized} ya estaban listos`);
            if (data.pending) parts.push(`${data.pending} pendientes`);
            if (data.skipped) parts.push(`${data.skipped} referidos ML omitidos`);

            if (data.optimized > 0 || data.success) {
                setMessage(parts.join(" · ") || "Proceso completado");
            }

            if (data.quotaExceeded) {
                setError(
                    data.errors?.[0] ??
                    "Cuota diaria de Gemini agotada (~20 req/día en plan gratuito). Volvé a correr mañana.",
                );
            } else if (data.errors?.length) {
                const nonInfo = data.errors.filter((e) => !e.includes("ya están optimizados"));
                if (nonInfo.length) setError(nonInfo.slice(0, 3).join("\n"));
            }

            if (!data.success && data.optimized === 0 && !data.alreadyOptimized) {
                throw new Error(data.errors?.[0] || "Error al optimizar productos");
            }

            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
            if (!message) setMessage(null);
        } finally {
            setLoading(false);
        }
    }

    async function handleOptimize() {
        const confirmed = confirm(
            "¿Optimizar productos pendientes con Gemini?\n\n" +
            "• Solo procesa productos que aún NO tienen keywords SEO\n" +
            "• 1 producto cada ~5 seg (respeta cuota API)\n" +
            "• Plan gratuito: ~20 requests/día por modelo\n\n" +
            "Los referidos de Mercado Libre no se modifican.\n\n¿Continuar?",
        );
        if (!confirmed) return;
        await runOptimize(false);
    }

    async function handleForceOptimize() {
        const confirmed = confirm(
            "¿REOPTIMIZAR TODOS los productos?\n\n" +
            "Esto sobrescribe título, descripción y keywords de todo el catálogo.\n" +
            "En plan gratuito puede tardar varios días (20 productos/día).\n\n¿Continuar?",
        );
        if (!confirmed) return;
        await runOptimize(true);
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap gap-2 justify-end">
                <button
                    type="button"
                    onClick={handleOptimize}
                    disabled={loading}
                    className="admin-btn admin-btn-dark disabled:opacity-50"
                >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Megaphone size={15} />}
                    {loading ? "Optimizando..." : "Optimizar para Google Ads"}
                </button>
            </div>
            <button
                type="button"
                onClick={handleForceOptimize}
                disabled={loading}
                className="text-[10px] text-[#64748b] hover:text-[#0a1628] underline disabled:opacity-50"
            >
                Reoptimizar todos (sobrescribir)
            </button>
            {message && (
                <p className="text-xs text-green-700 font-medium max-w-xs text-right">{message}</p>
            )}
            {error && (
                <p className="text-xs text-amber-700 font-medium max-w-xs text-right whitespace-pre-line">{error}</p>
            )}
        </div>
    );
}
