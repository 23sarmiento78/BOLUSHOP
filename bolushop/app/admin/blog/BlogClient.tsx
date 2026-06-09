"use client";

import { useState } from "react";
import { BlogPost, Product } from "@/lib/types";
import { savePostAction, deletePostAction, generateAIArticleAction, generateSocialContentAction, publishToSocialAction } from "@/app/actions/admin";
import { toast } from "sonner";
import { ImagePlus, Trash2, Edit, Plus, Eye, Globe, Search, Package, X as CloseIcon, Bold, Italic, Heading, List, ListOrdered, Type, Sparkles, Instagram, Copy, Download, ExternalLink, Twitter, Share2, Pin, MessageSquare } from "lucide-react";
import { transformImageUrl } from "@/lib/images";
import Image from "next/image";

interface Props {
    initialPosts: BlogPost[];
    allProducts: Product[];
}

export default function BlogClient({ initialPosts, allProducts }: Props) {
    const [posts, setPosts] = useState(initialPosts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProductsForAI, setSelectedProductsForAI] = useState<string[]>([]);

    // Social Assistant States
    const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
    const [socialContent, setSocialContent] = useState({ instagram: "", twitter: "", reddit: "", pinterest: "" });
    const [activePlatform, setActivePlatform] = useState<'instagram' | 'twitter' | 'reddit' | 'pinterest'>('instagram');
    const [socialImageUrl, setSocialImageUrl] = useState("");
    const [currentSocialPost, setCurrentSocialPost] = useState<BlogPost | null>(null);
    const [isAutoPublishing, setIsAutoPublishing] = useState(false);

    const openSocialModal = async (post: BlogPost) => {
        setCurrentSocialPost(post);
        setSocialImageUrl(post.image || "");
        setIsSocialModalOpen(true);
        setActivePlatform('instagram');

        // Cargar todos los contenidos progresivamente
        const platforms: ('instagram' | 'twitter' | 'reddit' | 'pinterest')[] = ['instagram', 'twitter', 'reddit', 'pinterest'];

        for (const platform of platforms) {
            setSocialContent(prev => ({ ...prev, [platform]: "Generando contenido mágico..." }));
            try {
                const res = await generateSocialContentAction(post, platform);
                if (res.success && res.content) {
                    setSocialContent(prev => ({ ...prev, [platform]: res.content }));
                } else {
                    setSocialContent(prev => ({ ...prev, [platform]: `Error al generar para ${platform}` }));
                }
            } catch (e) {
                setSocialContent(prev => ({ ...prev, [platform]: "Error de conexión" }));
            }
        }
    };

    const handleCopyCaption = () => {
        navigator.clipboard.writeText(socialContent[activePlatform as keyof typeof socialContent] || "");
        toast.success(`¡Contenido de ${activePlatform} copiado!`);
    };

    const handleDownloadImage = async () => {
        try {
            const response = await fetch(transformImageUrl(socialImageUrl));
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bolushop-${activePlatform}-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success("Imagen descargada");
        } catch (error) {
            toast.error("Error al descargar");
        }
    };

    const handleAutoPublish = async () => {
        if (!currentSocialPost) return;
        setIsAutoPublishing(true);
        const t = toast.loading("Enviando a Make/Automatización...");
        try {
            const res = await publishToSocialAction(currentSocialPost, socialContent);
            if (res.success) {
                toast.success("¡Enviado con éxito!", { id: t });
                setIsSocialModalOpen(false);
            } else {
                toast.error(res.error || "Error al enviar", { id: t });
            }
        } catch (e) {
            toast.error("Error de conexión", { id: t });
        } finally {
            setIsAutoPublishing(false);
        }
    };

    const handleGenerateAI = async () => {
        if (selectedProductsForAI.length === 0) {
            toast.error("Por favor seleccioná al menos un producto");
            return;
        }

        const products = allProducts.filter(p => selectedProductsForAI.includes(p.id));
        setIsGenerating(true);
        setIsAIModalOpen(false);
        const t = toast.loading("Generando artículo con contenido de valor...");
        try {
            const res = await generateAIArticleAction(products);
            if (res.success && res.data) {
                setEditingPost({
                    title: res.data.title,
                    slug: res.data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                    content: res.data.content,
                    excerpt: res.data.excerpt,
                    image: products[0]?.image || "",
                    category: res.data.category,
                    author: "BoluShop AI",
                    metaTitle: res.data.metaTitle,
                    metaDescription: res.data.metaDescription,
                    productIds: selectedProductsForAI,
                    isPublished: true
                });
                setIsModalOpen(true);
                toast.success("¡Artículo editorial generado!", { id: t });
            } else {
                toast.error(res.error || "Falló la generación", { id: t });
            }
        } catch (error) {
            toast.error("Error inesperado", { id: t });
        } finally {
            setIsGenerating(false);
            setSelectedProductsForAI([]);
        }
    };

    const insertTag = (tag: string, isBlock: boolean = false) => {
        const textarea = document.getElementById("content-textarea") as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selected = text.substring(start, end);

        const before = text.substring(0, start);
        const after = text.substring(end);

        let newContent = "";
        if (isBlock) {
            newContent = before + `\n<${tag}>\n  ${selected || "Texto aquí"}\n</${tag}>\n` + after;
        } else {
            newContent = before + `<${tag}>${selected || "texto"}</${tag}>` + after;
        }

        if (editingPost) {
            setEditingPost({ ...editingPost, content: newContent });
        }

        // Devolver el foco al textarea
        setTimeout(() => {
            textarea.focus();
            const newPos = start + tag.length + 2;
            textarea.setSelectionRange(newPos, newPos + (selected.length || (isBlock ? 10 : 5)));
        }, 10);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await savePostAction(editingPost as Partial<BlogPost>);
            if (res.success) {
                toast.success("Artículo guardado correctamente");
                window.location.reload();
            } else {
                toast.error(res.error);
            }
        } catch (e) {
            toast.error("Error al guardar");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este artículo?")) return;
        try {
            const res = await deletePostAction(id);
            if (res.success) {
                setPosts(posts.filter(p => p.id !== id));
                toast.success("Artículo eliminado");
            }
        } catch (e) {
            toast.error("Error al eliminar");
        }
    };

    const openCreateModal = () => {
        setEditingPost({
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            image: "",
            category: "General",
            author: "BoluShop Team",
            metaTitle: "",
            metaDescription: "",
            productIds: [],
            isPublished: true
        });
        setIsModalOpen(true);
    };

    const openEditModal = (post: BlogPost) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="admin-page-title">Blog</h1>
                    <p className="admin-page-subtitle">Artículos, SEO y contenido para redes</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setIsAIModalOpen(true)}
                        disabled={isGenerating}
                        className="admin-btn admin-btn-ghost !bg-indigo-50 !text-indigo-600 !border-indigo-100 disabled:opacity-50"
                    >
                        <Sparkles size={16} />
                        Generar con IA
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="admin-btn admin-btn-dark"
                    >
                        <Plus size={16} />
                        Nuevo artículo
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold">No hay artículos creados todavía.</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="relative h-48 bg-gray-100">
                                {post.image ? (
                                    <Image src={transformImageUrl(post.image)} alt={post.title} fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 italic text-sm">Sin imagen</div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${post.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                        {post.isPublished ? "Publicado" : "Borrador"}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">{post.category}</p>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(post)} className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-black hover:text-white transition-all" title="Editar">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => openSocialModal(post)} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all" title="Asistente de Redes Sociales">
                                            <Share2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(post.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all" title="Eliminar">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <a href={`/blog/${post.slug}`} target="_blank" className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                        Prev ↗
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Creación/Edición */}
            {isModalOpen && editingPost && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-2xl font-black text-gray-900">{editingPost.id ? "Editar Artículo" : "Crear Artículo"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="bg-white p-2.5 rounded-2xl hover:bg-gray-100 transition-colors">
                                <Globe size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Título del Artículo</label>
                                        <input
                                            required
                                            value={editingPost.title}
                                            onChange={(e) => {
                                                const title = e.target.value;
                                                const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                                setEditingPost({ ...editingPost, title, slug });
                                            }}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 font-bold text-gray-900"
                                            placeholder="Ej: 5 Gadgets que necesitas en 2026"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Slug (URL)</label>
                                        <input
                                            required
                                            value={editingPost.slug}
                                            onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 font-mono text-xs"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Categoría</label>
                                            <input
                                                value={editingPost.category}
                                                onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                                                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 font-bold text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Autor</label>
                                            <input
                                                value={editingPost.author}
                                                onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                                                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Imagen Principal (URL)</label>
                                        <input
                                            value={editingPost.image}
                                            onChange={(e) => setEditingPost({ ...editingPost, image: e.target.value })}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 font-bold text-sm"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Extracto (Resumen)</label>
                                        <textarea
                                            value={editingPost.excerpt}
                                            onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                                            rows={4}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 font-medium text-sm text-gray-600 leading-relaxed"
                                            placeholder="Resumen corto para las tarjetas..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Metatítulo SEO (Opcional)</label>
                                <input
                                    value={editingPost.metaTitle || ""}
                                    onChange={(e) => setEditingPost({ ...editingPost, metaTitle: e.target.value })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 font-bold text-gray-900"
                                    placeholder="Título para Google..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Metadescripción SEO (Opcional)</label>
                                <textarea
                                    value={editingPost.metaDescription || ""}
                                    onChange={(e) => setEditingPost({ ...editingPost, metaDescription: e.target.value })}
                                    rows={2}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 font-medium text-sm text-gray-600"
                                    placeholder="Descripción para Google..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-1">Productos Relacionados (Vincular para vender)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-[2rem] border border-gray-100">
                                    {allProducts.map(product => {
                                        const isSelected = editingPost.productIds?.includes(product.id);
                                        return (
                                            <button
                                                key={product.id}
                                                type="button"
                                                onClick={() => {
                                                    const currentIds = editingPost.productIds || [];
                                                    const nextIds = isSelected
                                                        ? currentIds.filter(id => id !== product.id)
                                                        : [...currentIds, product.id];
                                                    setEditingPost({ ...editingPost, productIds: nextIds });
                                                }}
                                                className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-transparent bg-white hover:border-gray-200'}`}
                                            >
                                                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                    <Image src={transformImageUrl(product.image)} alt={product.name} fill className="object-cover" />
                                                </div>
                                                <div className="text-left overflow-hidden">
                                                    <p className="text-[11px] font-bold text-gray-900 truncate">{product.name}</p>
                                                    <p className="text-[9px] font-black text-primary">${product.price.toLocaleString()}</p>
                                                </div>
                                                {isSelected && <div className="ml-auto w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[8px] text-white font-black">✓</div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1 text-center">Contenido del Artículo</label>

                                {/* Toolbar WYSIWYG */}
                                <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-0 z-10">
                                    <button type="button" onClick={() => insertTag("b")} className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-xs font-bold" title="Negrita">
                                        <Bold size={16} /> <span>B</span>
                                    </button>
                                    <button type="button" onClick={() => insertTag("i")} className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-xs font-bold" title="Itálica">
                                        <Italic size={16} /> <span>I</span>
                                    </button>
                                    <div className="w-px h-6 bg-gray-100 mx-1"></div>
                                    <button type="button" onClick={() => insertTag("h2", true)} className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-xs font-bold" title="Título 2">
                                        <Heading size={16} /> <span>H2</span>
                                    </button>
                                    <button type="button" onClick={() => insertTag("h3", true)} className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-xs font-bold" title="Título 3">
                                        <Heading size={14} /> <span>H3</span>
                                    </button>
                                    <div className="w-px h-6 bg-gray-100 mx-1"></div>
                                    <button type="button" onClick={() => insertTag("ul", true)} className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-xs font-bold" title="Lista">
                                        <List size={16} /> <span>UL</span>
                                    </button>
                                    <button type="button" onClick={() => insertTag("li")} className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-xs font-bold" title="Item de lista">
                                        <ListOrdered size={16} /> <span>LI</span>
                                    </button>
                                    <button type="button" onClick={() => insertTag("p", true)} className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-xs font-bold" title="Párrafo">
                                        <Type size={16} /> <span>P</span>
                                    </button>
                                </div>

                                <textarea
                                    id="content-textarea"
                                    required
                                    value={editingPost.content}
                                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                                    rows={15}
                                    className="w-full px-8 py-6 rounded-[2rem] bg-gray-50 border-none focus:ring-2 focus:ring-black/5 font-medium text-lg text-gray-900 leading-relaxed shadow-inner"
                                    placeholder="Escribe todo el contenido aquí..."
                                />
                            </div>

                            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editingPost.isPublished}
                                        onChange={(e) => setEditingPost({ ...editingPost, isPublished: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                                    />
                                    <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Publicar artículo ahora</span>
                                </label>
                            </div>
                        </form>

                        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-8 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-100 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="flex-[2] px-8 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-800 disabled:opacity-50 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                            >
                                {isLoading ? "Guardando..." : "Guardar Artículo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal de Selección de Producto para IA */}
            {isAIModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-indigo-50/30">
                            <div>
                                <h2 className="text-2xl font-black text-indigo-900 flex items-center gap-2">
                                    <Sparkles className="text-indigo-600" />
                                    Blog Mágico con IA
                                </h2>
                                <p className="text-indigo-600/60 font-medium text-sm">Elegí un producto para que la IA escriba un artículo increíble.</p>
                            </div>
                            <button onClick={() => setIsAIModalOpen(false)} className="bg-white p-2.5 rounded-2xl hover:bg-gray-100 transition-colors">
                                <CloseIcon size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar producto por nombre o categoría..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-transparent focus:border-indigo-500 rounded-2xl transition-all font-bold text-gray-900 shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {allProducts
                                .filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category?.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(product => {
                                    const isSelected = selectedProductsForAI.includes(product.id);
                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                if (isSelected) {
                                                    setSelectedProductsForAI(selectedProductsForAI.filter(id => id !== product.id));
                                                } else {
                                                    setSelectedProductsForAI([...selectedProductsForAI, product.id]);
                                                }
                                            }}
                                            className={`w-full flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border-2 transition-all group text-left ${isSelected ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-100 hover:border-indigo-200'}`}
                                        >
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                                                <Image src={transformImageUrl(product.image)} alt={product.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{product.category}</p>
                                                <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
                                                <p className="text-xs text-gray-500 font-medium">${product.price.toLocaleString()}</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-transparent shadow-lg shadow-indigo-600/20' : 'border-2 border-gray-200 bg-white'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full animate-in zoom-in" />}
                                            </div>
                                        </button>
                                    );
                                })
                            }
                        </div>

                        <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                            <button
                                onClick={() => {
                                    setSelectedProductsForAI([]);
                                    setIsAIModalOpen(false);
                                }}
                                className="flex-1 px-8 py-4 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleGenerateAI}
                                disabled={selectedProductsForAI.length === 0 || isGenerating}
                                className="flex-[2] px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Sparkles size={18} />
                                {isGenerating ? "Generando..." : `Escribir Artículo (${selectedProductsForAI.length})`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Asistente de Redes Sociales Multi-IA */}
            {isSocialModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
                            <div>
                                <h2 className="text-2xl font-black text-indigo-900 flex items-center gap-3">
                                    <div className="bg-indigo-600 p-2 rounded-xl">
                                        <Sparkles className="text-white" size={20} />
                                    </div>
                                    Asistente Multi-IA
                                </h2>
                                <p className="text-indigo-600/60 font-medium text-sm">Cada red social tiene su propio cerebro Gemini trabajando para vos.</p>
                            </div>
                            <button onClick={() => setIsSocialModalOpen(false)} className="bg-white p-3 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
                                <CloseIcon size={20} />
                            </button>
                        </div>

                        {/* Tabs de Redes Sociales */}
                        <div className="flex p-2 bg-gray-50/50 border-b border-gray-100 overflow-x-auto gap-2">
                            {[
                                { id: 'instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50', label: 'Instagram' },
                                { id: 'twitter', icon: Twitter, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Twitter (X)' },
                                { id: 'reddit', icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Reddit' },
                                { id: 'pinterest', icon: Pin, color: 'text-red-600', bg: 'bg-red-50', label: 'Pinterest' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActivePlatform(tab.id as any)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activePlatform === tab.id ? `${tab.bg} ${tab.color} shadow-sm border border-${tab.color}/20` : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh]">
                            <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-gray-100 border-4 border-white shadow-xl group">
                                <Image src={transformImageUrl(socialImageUrl)} alt="Preview Social" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={handleDownloadImage} className="bg-white text-black px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-transform shadow-2xl">
                                        <Download size={18} />
                                        Descargar para {activePlatform}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end px-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contenido Sugerido por IA</label>
                                    <button onClick={handleCopyCaption} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2 hover:opacity-70 bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">
                                        <Copy size={14} />
                                        Copiar Texto
                                    </button>
                                </div>
                                <div className="relative">
                                    <textarea
                                        value={socialContent[activePlatform]}
                                        onChange={(e) => setSocialContent({ ...socialContent, [activePlatform]: e.target.value })}
                                        rows={8}
                                        className="w-full px-6 py-5 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white transition-all font-medium text-gray-800 text-sm leading-relaxed shadow-inner"
                                    />
                                    {socialContent[activePlatform].includes("Generando") && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-[2rem] backdrop-blur-[2px]">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Consultando a Gemini...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleDownloadImage}
                                    className="px-8 py-5 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-3 shadow-sm"
                                >
                                    <Download size={18} />
                                    Bajar Imagen
                                </button>

                                <a
                                    href={activePlatform === 'twitter' ? "https://twitter.com/intent/tweet" : activePlatform === 'reddit' ? "https://www.reddit.com/submit" : "https://www.pinterest.com/"}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={handleCopyCaption}
                                    className="px-8 py-5 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-gray-300 transition-all flex items-center justify-center gap-3"
                                >
                                    <ExternalLink size={18} />
                                    Manual en {activePlatform}
                                </a>
                            </div>

                            <button
                                onClick={handleAutoPublish}
                                disabled={isAutoPublishing || Object.values(socialContent).some(c => c.includes("Generando"))}
                                className="w-full px-8 py-6 bg-black text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <Globe size={20} className="text-indigo-400" />
                                {isAutoPublishing ? "Automatizando..." : "Auto-Publicar en todas las redes"}
                            </button>
                            <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                                Envíalo a un Webhook (Make.com) para publicación 100% automática.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
