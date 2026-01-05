"use client";

import { useState, useEffect } from "react";
import {
    getNewsletterSubscribersAction,
    deleteNewsletterSubscriberAction,
    sendNewsletterCampaignAction
} from "@/app/actions/admin";
import { Newsletter, Collection } from "@/lib/types";
import { toast } from "sonner";
import { Mail, Trash2, Send, Layout, List, Megaphone, Image as ImageIcon, Link as LinkIcon, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Props {
    collections: Collection[];
}

export default function NewsletterAdminClient({ collections }: Props) {
    const [subscribers, setSubscribers] = useState<Newsletter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'subscribers' | 'campaign'>('subscribers');

    // Campaign State
    const [campaign, setCampaign] = useState({
        subject: "",
        bannerUrl: "",
        content: "",
        collectionId: ""
    });
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        setIsLoading(true);
        try {
            const data = await getNewsletterSubscribersAction();
            setSubscribers(data);
        } catch (error) {
            toast.error("Error al cargar los suscriptores");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (email: string) => {
        if (!confirm("¿Estás seguro de que querés eliminar a este suscriptor?")) return;

        try {
            await deleteNewsletterSubscriberAction(email);
            setSubscribers(subscribers.filter(s => s.email !== email));
            toast.success("Eliminado correctamente");
        } catch (error) {
            toast.error("Error al eliminar");
        }
    };

    const handleSendCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!campaign.subject || !campaign.content) {
            toast.error("El asunto y el contenido son obligatorios");
            return;
        }

        if (subscribers.length === 0) {
            toast.error("No hay suscriptores a los que enviar");
            return;
        }

        setIsSending(true);
        try {
            const result = await sendNewsletterCampaignAction({
                ...campaign,
                bannerUrl: resolvedBannerUrl
            });
            if (result.success) {
                toast.success(result.message);
                // Clear campaign after success
                setCampaign({ subject: "", bannerUrl: "", content: "", collectionId: "" });
            }
        } catch (error) {
            toast.error("Error al enviar la campaña");
        } finally {
            setIsSending(false);
        }
    };

    const selectedCollection = collections.find(c => c.id === campaign.collectionId);

    const resolveDirectImageUrl = (url: string) => {
        if (!url) return "";
        // Google Drive Link Resolver
        if (url.includes('drive.google.com')) {
            const fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1] || url.match(/id=([^\&]+)/)?.[1];
            if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;
        }
        return url;
    };

    const resolvedBannerUrl = resolveDirectImageUrl(campaign.bannerUrl);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black mb-2">Newsletter Center</h1>
                    <p className="text-gray-500 font-medium">Gestioná tus suscriptores y enviá campañas de Email Marketing.</p>
                </div>
                <div className="bg-primary/5 px-6 py-4 rounded-2xl border border-primary/10">
                    <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Total Suscriptores</p>
                    <p className="text-3xl font-black text-primary">{subscribers.length}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('subscribers')}
                    className={`px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all ${activeTab === 'subscribers'
                        ? 'bg-primary text-white shadow-xl shadow-primary/20'
                        : 'bg-white text-gray-400 hover:text-gray-600 border border-gray-100'
                        }`}
                >
                    <List size={18} />
                    Lista de Suscriptores
                </button>
                <button
                    onClick={() => setActiveTab('campaign')}
                    className={`px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all ${activeTab === 'campaign'
                        ? 'bg-primary text-white shadow-xl shadow-primary/20'
                        : 'bg-white text-gray-400 hover:text-gray-600 border border-gray-100'
                        }`}
                >
                    <Megaphone size={18} />
                    Crear Campaña
                </button>
            </div>

            {activeTab === 'subscribers' ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Email</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Fecha Suscripción</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={3} className="px-8 py-6 h-16 bg-gray-50/50"></td>
                                    </tr>
                                ))
                            ) : subscribers.length > 0 ? (
                                subscribers.map((sub) => (
                                    <tr key={sub.email} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                                    <Mail size={14} />
                                                </div>
                                                <span className="font-bold text-gray-900">{sub.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-gray-500 font-medium">
                                            {new Date(sub.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => handleDelete(sub.email)}
                                                className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                title="Eliminar suscriptor"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-bold">
                                        Aún no hay suscriptores.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Campaign Form */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                            <Send className="text-primary" />
                            Diseñar Email
                        </h2>

                        <form onSubmit={handleSendCampaign} className="space-y-6">
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Asunto del Email</label>
                                <input
                                    type="text"
                                    placeholder="Ej: ¡Novedades exclusivas para vos!"
                                    className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none"
                                    value={campaign.subject}
                                    onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">URL del Banner (Imagen)</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="url"
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full pl-16 pr-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-mono text-sm"
                                        value={campaign.bannerUrl}
                                        onChange={(e) => setCampaign({ ...campaign, bannerUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Cuerpo del Mensaje</label>
                                <textarea
                                    rows={6}
                                    placeholder="Escribí el contenido de tu email aquí..."
                                    className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none resize-none"
                                    value={campaign.content}
                                    onChange={(e) => setCampaign({ ...campaign, content: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Vincular Colección (Promoción)</label>
                                <select
                                    className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none"
                                    value={campaign.collectionId}
                                    onChange={(e) => setCampaign({ ...campaign, collectionId: e.target.value })}
                                >
                                    <option value="">Ninguna colección vinculada</option>
                                    {collections.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full py-6 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSending ? "Enviando..." : `Enviar a ${subscribers.length} suscriptores`}
                                <Send size={20} />
                            </button>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div>
                        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-gray-400">
                            <Layout />
                            Previsualización
                        </h2>

                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden max-w-md mx-auto">
                            {/* Email Container Emulator */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Para: Todos los suscriptores</p>
                                <p className="text-sm font-bold text-gray-900 truncate">Asunto: {campaign.subject || '(Sin asunto)'}</p>
                            </div>

                            <div className="bg-white">
                                {resolvedBannerUrl ? (
                                    <img src={resolvedBannerUrl} alt="Banner Preview" className="w-full h-48 object-cover" />
                                ) : (
                                    <div className="w-full h-48 bg-gray-50 flex flex-col items-center justify-center text-gray-300 gap-2">
                                        <ImageIcon size={32} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Sin Banner</span>
                                    </div>
                                )}

                                <div className="p-8">
                                    <div className="w-12 h-1 bg-primary mb-6" />
                                    <h3 className="text-2xl font-black text-gray-900 mb-6 leading-tight">
                                        {campaign.subject || 'Campaña de BoluShop'}
                                    </h3>
                                    <div className="text-gray-600 font-medium whitespace-pre-line mb-10">
                                        {campaign.content || 'Escribí el contenido para verlo aquí...'}
                                    </div>

                                    {selectedCollection && (
                                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-8 text-center group">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Colección Destacada</p>
                                            <h4 className="text-xl font-black text-gray-900 mb-4">{selectedCollection.name}</h4>
                                            <p className="text-sm text-gray-500 mb-6">{selectedCollection.description}</p>
                                            <a
                                                href={`/productos?coleccion=${selectedCollection.id}`}
                                                target="_blank"
                                                className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest"
                                            >
                                                Ver Colección
                                            </a>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-100 pt-8 text-center">
                                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xs mx-auto mb-4">B</div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                                            BoluShop Argentina · {new Date().getFullYear()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
