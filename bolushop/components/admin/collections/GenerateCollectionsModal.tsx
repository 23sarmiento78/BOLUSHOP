"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, X, Megaphone } from "lucide-react";
import type { Product } from "@/lib/types";
import type { CollectionProposalDraft } from "@/lib/types/collection-ai";
import { proposalToCollection } from "@/lib/types/collection-ai";
import { publishCollectionsBatchAction } from "@/app/actions/admin";
import { transformImageUrl } from "@/lib/images";
import { HOLIDAYS } from "@/lib/holidays";

interface Props {
    products: Product[];
    onClose: () => void;
}

function withProductImages(
    proposals: CollectionProposalDraft[],
    products: Product[],
): CollectionProposalDraft[] {
    return proposals.map((p) => {
        const first = products.find((prod) => p.productIds.includes(prod.id));
        return { ...p, image: first?.image, selected: true };
    });
}

export default function GenerateCollectionsModal({ products, onClose }: Props) {
    const [proposals, setProposals] = useState<CollectionProposalDraft[]>([]);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const productMap = new Map(products.map((p) => [p.id, p]));

    const generate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/admin/collections/generate", { method: "POST" });
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Error al generar ofertas");
            }

            const drafts: CollectionProposalDraft[] = data.proposals.map(
                (p: CollectionProposalDraft) => ({ ...p, selected: true }),
            );
            setProposals(withProductImages(drafts, products));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
            setProposals([]);
        } finally {
            setLoading(false);
        }
    }, [products]);

    useEffect(() => {
        generate();
    }, [generate]);

    function updateProposal(index: number, patch: Partial<CollectionProposalDraft>) {
        setProposals((prev) =>
            prev.map((p, i) => (i === index ? { ...p, ...patch } : p)),
        );
    }

    async function handlePublish() {
        const selected = proposals.filter((p) => p.selected);
        if (selected.length === 0) {
            alert("Seleccioná al menos una oferta para publicar");
            return;
        }

        const confirmed = confirm(
            `¿Publicar ${selected.length} colección(es) en la tienda?\n\nAparecerán en /colecciones y en la home si están destacadas.`,
        );
        if (!confirmed) return;

        setPublishing(true);
        setError(null);

        try {
            const payload = selected.map((p) => {
                const col = proposalToCollection(p);
                const first = products.find((prod) => p.productIds.includes(prod.id));
                return { ...col, image: first?.image };
            });

            const result = await publishCollectionsBatchAction(payload);
            if (!result.success) {
                throw new Error(result.error || "Error al publicar");
            }

            router.refresh();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al publicar");
        } finally {
            setPublishing(false);
        }
    }

    const selectedCount = proposals.filter((p) => p.selected).length;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#1E5BC6]/10 flex items-center justify-center">
                            <Sparkles className="text-[#1E5BC6]" size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Ofertas generadas con IA</h2>
                            <p className="text-xs text-gray-500 font-medium">
                                Vista previa · editá y publicá las que quieras
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl text-gray-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#1E5BC6]">
                            <Loader2 className="animate-spin" size={32} />
                            <p className="font-semibold text-sm">Analizando catálogo con Gemini...</p>
                        </div>
                    )}

                    {!loading && error && proposals.length === 0 && (
                        <div className="text-center py-16 space-y-4">
                            <p className="text-red-600 font-semibold text-sm">{error}</p>
                            <button
                                type="button"
                                onClick={generate}
                                className="admin-btn admin-btn-primary"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {!loading &&
                        proposals.map((proposal, index) => {
                            const holiday = HOLIDAYS.find((h) => h.id === proposal.holiday);
                            return (
                                <div
                                    key={`${proposal.slug}-${index}`}
                                    className={`rounded-[1.5rem] border-2 p-6 transition-all ${
                                        proposal.selected
                                            ? "border-[#1E5BC6]/30 bg-[#1E5BC6]/5"
                                            : "border-gray-100 bg-gray-50/50 opacity-70"
                                    }`}
                                >
                                    <div className="flex items-start gap-4 mb-5">
                                        <input
                                            type="checkbox"
                                            checked={proposal.selected}
                                            onChange={(e) =>
                                                updateProposal(index, { selected: e.target.checked })
                                            }
                                            className="mt-1 w-5 h-5 rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <input
                                                value={proposal.name}
                                                onChange={(e) =>
                                                    updateProposal(index, { name: e.target.value })
                                                }
                                                className="w-full text-lg font-black text-gray-900 bg-transparent border-b border-transparent focus:border-gray-200 outline-none mb-2"
                                            />
                                            <p className="text-xs text-[#1E5BC6] font-medium mb-2">
                                                💡 {proposal.reason}
                                            </p>
                                            <textarea
                                                value={proposal.description}
                                                onChange={(e) =>
                                                    updateProposal(index, {
                                                        description: e.target.value,
                                                    })
                                                }
                                                rows={2}
                                                className="w-full text-sm text-gray-600 bg-white rounded-xl p-3 border border-gray-100"
                                            />
                                        </div>
                                        {proposal.discountType !== "none" && (
                                            <span className="shrink-0 bg-emerald-500 text-white px-4 py-2 rounded-xl font-black text-xs">
                                                {proposal.discountType === "percentage"
                                                    ? `${proposal.discountValue}% OFF`
                                                    : `$${proposal.discountValue} OFF`}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400">
                                                Descuento
                                            </label>
                                            <select
                                                value={proposal.discountType}
                                                onChange={(e) =>
                                                    updateProposal(index, {
                                                        discountType: e.target.value as CollectionProposalDraft["discountType"],
                                                    })
                                                }
                                                className="w-full mt-1 rounded-xl p-2 text-sm font-bold bg-white border border-gray-100"
                                            >
                                                <option value="none">Sin descuento</option>
                                                <option value="percentage">Porcentaje</option>
                                                <option value="fixed">Monto fijo</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400">
                                                Valor
                                            </label>
                                            <input
                                                type="number"
                                                value={proposal.discountValue}
                                                disabled={proposal.discountType === "none"}
                                                onChange={(e) =>
                                                    updateProposal(index, {
                                                        discountValue: Number(e.target.value),
                                                    })
                                                }
                                                className="w-full mt-1 rounded-xl p-2 text-sm font-bold bg-white border border-gray-100 disabled:opacity-40"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400">
                                                Festividad
                                            </label>
                                            <select
                                                value={proposal.holiday}
                                                onChange={(e) =>
                                                    updateProposal(index, { holiday: e.target.value })
                                                }
                                                className="w-full mt-1 rounded-xl p-2 text-sm font-bold bg-white border border-gray-100"
                                            >
                                                <option value="none">Ninguna</option>
                                                {HOLIDAYS.map((h) => (
                                                    <option key={h.id} value={h.id}>
                                                        {h.icon} {h.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-end">
                                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer pb-2">
                                                <input
                                                    type="checkbox"
                                                    checked={proposal.isFeatured}
                                                    onChange={(e) =>
                                                        updateProposal(index, {
                                                            isFeatured: e.target.checked,
                                                        })
                                                    }
                                                />
                                                Destacar 🔥
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {proposal.productIds.map((id) => {
                                            const prod = productMap.get(id);
                                            if (!prod) return null;
                                            return (
                                                <div
                                                    key={id}
                                                    className="flex items-center gap-2 bg-white rounded-xl px-2 py-1.5 border border-gray-100"
                                                >
                                                    <img
                                                        src={transformImageUrl(prod.image)}
                                                        alt=""
                                                        className="w-8 h-8 rounded-lg object-cover"
                                                    />
                                                    <span className="text-[10px] font-bold text-gray-700 max-w-[120px] truncate">
                                                        {prod.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {holiday && (
                                        <p className="text-[10px] text-gray-400 mt-3 font-medium">
                                            Tema: {holiday.icon} {holiday.label}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                </div>

                <div className="px-8 py-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-center shrink-0 bg-gray-50/80">
                    <div className="text-xs text-gray-500 font-medium">
                        {loading
                            ? "Generando..."
                            : `${selectedCount} de ${proposals.length} seleccionadas`}
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={generate}
                            disabled={loading || publishing}
                            className="admin-btn admin-btn-ghost flex-1 sm:flex-none disabled:opacity-50"
                        >
                            Regenerar
                        </button>
                        <button
                            type="button"
                            onClick={handlePublish}
                            disabled={loading || publishing || selectedCount === 0}
                            className="admin-btn admin-btn-dark flex-1 sm:flex-none disabled:opacity-50"
                        >
                            {publishing ? (
                                <Loader2 size={15} className="animate-spin" />
                            ) : (
                                <Megaphone size={15} />
                            )}
                            {publishing ? "Publicando..." : `Publicar (${selectedCount})`}
                        </button>
                    </div>
                </div>

                {error && proposals.length > 0 && (
                    <p className="px-8 pb-4 text-xs text-amber-700 font-medium">{error}</p>
                )}
            </div>
        </div>
    );
}
