"use client";

import { useState, useEffect, useMemo } from "react";
import {
    getNewsletterSubscribersAction,
    deleteNewsletterSubscriberAction,
    sendNewsletterCampaignAction,
    sendTestNewsletterCampaignAction,
} from "@/app/actions/admin";
import { Newsletter, Collection, Product } from "@/lib/types";
import { transformImageUrl } from "@/lib/images";
import { toast } from "sonner";
import Image from "next/image";
import {
    Mail,
    Trash2,
    Send,
    Layout,
    List,
    Megaphone,
    Image as ImageIcon,
    Package,
    FlaskConical,
    Search,
    Check,
} from "lucide-react";

interface Props {
    collections: Collection[];
    products: Product[];
}

export default function NewsletterAdminClient({ collections, products }: Props) {
    const [subscribers, setSubscribers] = useState<Newsletter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"subscribers" | "campaign">("subscribers");

    const [campaign, setCampaign] = useState({
        subject: "",
        bannerUrl: "",
        content: "",
        collectionId: "",
        productIds: [] as string[],
    });
    const [testEmail, setTestEmail] = useState("");
    const [productSearch, setProductSearch] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isSendingTest, setIsSendingTest] = useState(false);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        setIsLoading(true);
        try {
            const data = await getNewsletterSubscribersAction();
            setSubscribers(data);
        } catch {
            toast.error("Error al cargar los suscriptores");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (email: string) => {
        if (!confirm("¿Estás seguro de que querés eliminar a este suscriptor?")) return;

        try {
            await deleteNewsletterSubscriberAction(email);
            setSubscribers(subscribers.filter((s) => s.email !== email));
            toast.success("Eliminado correctamente");
        } catch {
            toast.error("Error al eliminar");
        }
    };

    const resolveDirectImageUrl = (url: string) => {
        if (!url) return "";
        if (url.includes("drive.google.com")) {
            const fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1] || url.match(/id=([^\&]+)/)?.[1];
            if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;
        }
        return url;
    };

    const resolvedBannerUrl = resolveDirectImageUrl(campaign.bannerUrl);

    const buildCampaignPayload = () => ({
        ...campaign,
        bannerUrl: resolvedBannerUrl,
    });

    const validateCampaign = () => {
        if (!campaign.subject || !campaign.content) {
            toast.error("El asunto y el contenido son obligatorios");
            return false;
        }
        return true;
    };

    const handleSendTest = async () => {
        if (!validateCampaign()) return;

        if (!testEmail.trim()) {
            toast.error("Ingresá un email para la prueba");
            return;
        }

        setIsSendingTest(true);
        try {
            const result = await sendTestNewsletterCampaignAction(buildCampaignPayload(), testEmail.trim());
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message || "Error al enviar la prueba");
            }
        } catch {
            toast.error("Error al enviar el email de prueba");
        } finally {
            setIsSendingTest(false);
        }
    };

    const handleSendCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateCampaign()) return;

        if (subscribers.length === 0) {
            toast.error("No hay suscriptores a los que enviar");
            return;
        }

        if (!confirm(`¿Enviar esta campaña a ${subscribers.length} suscriptores vía Brevo?`)) return;

        setIsSending(true);
        try {
            const result = await sendNewsletterCampaignAction(buildCampaignPayload());
            if (result.success) {
                toast.success(result.message);
                setCampaign({ subject: "", bannerUrl: "", content: "", collectionId: "", productIds: [] });
            } else {
                toast.error(result.message || "Error al enviar la campaña");
            }
        } catch {
            toast.error("Error al enviar la campaña");
        } finally {
            setIsSending(false);
        }
    };

    const toggleProduct = (productId: string) => {
        setCampaign((prev) => ({
            ...prev,
            productIds: prev.productIds.includes(productId)
                ? prev.productIds.filter((id) => id !== productId)
                : [...prev.productIds, productId],
        }));
    };

    const selectedCollection = collections.find((c) => c.id === campaign.collectionId);
    const selectedProducts = useMemo(
        () => products.filter((p) => campaign.productIds.includes(p.id)),
        [products, campaign.productIds]
    );

    const filteredProducts = useMemo(() => {
        const q = productSearch.toLowerCase().trim();
        if (!q) return products;
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q)
        );
    }, [products, productSearch]);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-10">
                <div>
                    <h1 className="admin-page-title">Newsletter</h1>
                    <p className="admin-page-subtitle">Suscriptores y campañas de email</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Diseñá, probá con un email único y enviá campañas masivas con <strong>Brevo</strong>.
                    </p>
                </div>
                <div className="bg-[#fff4ee] px-6 py-4 rounded-2xl border border-[#ff6b35]/20 shrink-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b35] mb-1">Suscriptores</p>
                    <p className="text-3xl font-black text-[#0a1628]">{subscribers.length}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
                <button
                    onClick={() => setActiveTab("subscribers")}
                    className={`admin-btn ${activeTab === "subscribers" ? "admin-btn-dark" : "admin-btn-ghost"}`}
                >
                    <List size={16} />
                    Suscriptores
                </button>
                <button
                    onClick={() => setActiveTab("campaign")}
                    className={`admin-btn ${activeTab === "campaign" ? "admin-btn-primary" : "admin-btn-ghost"}`}
                >
                    <Megaphone size={16} />
                    Crear campaña
                </button>
            </div>

            {activeTab === "subscribers" ? (
                <div className="admin-card !p-0 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#f8f9fb] border-b border-[#e2e8f0]">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-[#64748b]">Email</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#64748b]">Fecha</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#64748b] text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9]">
                            {isLoading ? (
                                [1, 2, 3].map((i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={3} className="px-6 py-5 h-14 bg-[#f8f9fb]/50" />
                                    </tr>
                                ))
                            ) : subscribers.length > 0 ? (
                                subscribers.map((sub) => (
                                    <tr key={sub.email} className="hover:bg-[#fafbfc]">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#fff4ee] rounded-full flex items-center justify-center text-[#ff6b35]">
                                                    <Mail size={14} />
                                                </div>
                                                <span className="font-medium text-[#0a1628]">{sub.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[#64748b]">
                                            {new Date(sub.createdAt).toLocaleDateString("es-AR")}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(sub.email)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Eliminar suscriptor"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-16 text-center text-[#94a3b8]">
                                        Aún no hay suscriptores.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="admin-card">
                        <h2 className="text-lg font-semibold text-[#0a1628] mb-6 flex items-center gap-2">
                            <Send size={18} className="text-[#ff6b35]" />
                            Diseñar email
                        </h2>

                        <form onSubmit={handleSendCampaign} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">Asunto</label>
                                <input
                                    type="text"
                                    placeholder="Ej: ¡Novedades exclusivas para vos!"
                                    className="w-full px-4 py-3 rounded-xl bg-[#f8f9fb] border border-[#e2e8f0] outline-none focus:border-[#ff6b35]"
                                    value={campaign.subject}
                                    onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">URL del banner</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#f8f9fb] border border-[#e2e8f0] outline-none focus:border-[#ff6b35] text-sm"
                                        value={campaign.bannerUrl}
                                        onChange={(e) => setCampaign({ ...campaign, bannerUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">Cuerpo del mensaje</label>
                                <textarea
                                    rows={5}
                                    placeholder="Escribí el contenido del email..."
                                    className="w-full px-4 py-3 rounded-xl bg-[#f8f9fb] border border-[#e2e8f0] outline-none focus:border-[#ff6b35] resize-none"
                                    value={campaign.content}
                                    onChange={(e) => setCampaign({ ...campaign, content: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
                                    Productos en el email ({campaign.productIds.length})
                                </label>
                                <div className="relative mb-2">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Buscar producto..."
                                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#f8f9fb] border border-[#e2e8f0] outline-none focus:border-[#ff6b35] text-sm"
                                        value={productSearch}
                                        onChange={(e) => setProductSearch(e.target.value)}
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-2 space-y-1">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => {
                                            const isSelected = campaign.productIds.includes(product.id);
                                            return (
                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    onClick={() => toggleProduct(product.id)}
                                                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${
                                                        isSelected
                                                            ? "bg-[#fff4ee] border border-[#ff6b35]/30"
                                                            : "bg-white border border-transparent hover:border-[#e2e8f0]"
                                                    }`}
                                                >
                                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0">
                                                        <Image
                                                            src={transformImageUrl(product.image)}
                                                            alt={product.name}
                                                            fill
                                                            className="object-contain p-1"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-[#0a1628] truncate">{product.name}</p>
                                                        <p className="text-xs text-[#ff6b35] font-semibold">
                                                            ${product.price.toLocaleString("es-AR")}
                                                        </p>
                                                    </div>
                                                    {isSelected && <Check size={16} className="text-[#ff6b35] shrink-0" />}
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm text-[#94a3b8] text-center py-4">No se encontraron productos</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">Colección vinculada (opcional)</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-[#f8f9fb] border border-[#e2e8f0] outline-none focus:border-[#ff6b35]"
                                    value={campaign.collectionId}
                                    onChange={(e) => setCampaign({ ...campaign, collectionId: e.target.value })}
                                >
                                    <option value="">Sin colección</option>
                                    {collections.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Envío de prueba */}
                            <div className="rounded-xl border border-dashed border-[#ff6b35]/40 bg-[#fffaf7] p-4 space-y-3">
                                <p className="text-xs font-semibold text-[#ff6b35] flex items-center gap-2">
                                    <FlaskConical size={14} />
                                    Enviar prueba a un solo email
                                </p>
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#e2e8f0] outline-none focus:border-[#ff6b35] text-sm"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={handleSendTest}
                                    disabled={isSendingTest || isSending}
                                    className="admin-btn admin-btn-ghost w-full !border-[#ff6b35]/30 !text-[#ff6b35] disabled:opacity-50"
                                >
                                    <FlaskConical size={16} />
                                    {isSendingTest ? "Enviando prueba..." : "Enviar email de prueba"}
                                </button>
                            </div>

                            {/* Envío masivo */}
                            <button
                                type="submit"
                                disabled={isSending || isSendingTest}
                                className="admin-btn admin-btn-primary w-full !py-4 disabled:opacity-50"
                            >
                                <Send size={18} />
                                {isSending
                                    ? "Enviando campaña con Brevo..."
                                    : `Enviar campaña a ${subscribers.length} suscriptores`}
                            </button>
                        </form>
                    </div>

                    {/* Preview */}
                    <div>
                        <h2 className="text-lg font-semibold text-[#64748b] mb-6 flex items-center gap-2">
                            <Layout size={18} />
                            Previsualización
                        </h2>

                        <div className="admin-card !p-0 overflow-hidden max-w-md mx-auto">
                            <div className="bg-[#f8f9fb] px-5 py-3 border-b border-[#e2e8f0]">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                                    Para: todos los suscriptores
                                </p>
                                <p className="text-sm font-semibold text-[#0a1628] truncate">
                                    {campaign.subject || "(Sin asunto)"}
                                </p>
                            </div>

                            {resolvedBannerUrl ? (
                                <img src={resolvedBannerUrl} alt="Banner" className="w-full h-44 object-cover" />
                            ) : (
                                <div className="w-full h-44 bg-[#f8f9fb] flex flex-col items-center justify-center text-[#cbd5e1]">
                                    <ImageIcon size={28} />
                                    <span className="text-xs mt-2">Sin banner</span>
                                </div>
                            )}

                            <div className="p-6">
                                <div className="w-10 h-1 bg-[#ff6b35] rounded mb-4" />
                                <h3 className="text-xl font-bold text-[#0a1628] mb-4">
                                    {campaign.subject || "Campaña BoluShop"}
                                </h3>
                                <p className="text-sm text-[#64748b] whitespace-pre-line mb-6">
                                    {campaign.content || "Escribí el contenido para verlo aquí..."}
                                </p>

                                {selectedProducts.length > 0 && (
                                    <div className="mb-6">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff6b35] mb-3">
                                            Productos ({selectedProducts.length})
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedProducts.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="border border-[#e2e8f0] rounded-xl overflow-hidden"
                                                >
                                                    <div className="relative h-20 bg-[#f8f9fb]">
                                                        <Image
                                                            src={transformImageUrl(product.image)}
                                                            alt={product.name}
                                                            fill
                                                            className="object-contain p-2"
                                                        />
                                                    </div>
                                                    <div className="p-2">
                                                        <p className="text-[11px] font-semibold text-[#0a1628] line-clamp-2">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs font-bold text-[#ff6b35]">
                                                            ${product.price.toLocaleString("es-AR")}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedCollection && (
                                    <div className="bg-[#fff4ee] border border-[#ff6b35]/20 rounded-xl p-4 mb-6 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff6b35] mb-1">
                                            Colección
                                        </p>
                                        <h4 className="font-bold text-[#0a1628] mb-1">{selectedCollection.name}</h4>
                                        <p className="text-xs text-[#64748b] mb-3">{selectedCollection.description}</p>
                                        <span className="inline-block px-4 py-2 bg-[#0a1628] text-white rounded-lg text-xs font-bold">
                                            Ver colección
                                        </span>
                                    </div>
                                )}

                                <div className="border-t border-[#e2e8f0] pt-4 text-center">
                                    <div className="w-7 h-7 bg-[#0a1628] rounded-md flex items-center justify-center text-white text-xs font-bold mx-auto mb-2">
                                        B
                                    </div>
                                    <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider">
                                        BoluShop · {new Date().getFullYear()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
