"use client";

import { useState } from "react";
import { Collection, Product } from "@/lib/types";
import { createCollectionAction, deleteCollectionAction, updateCollectionAction } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { HOLIDAYS } from "@/lib/holidays"; // Import new holidays config
import { transformImageUrl } from "@/lib/images";
import GenerateCollectionsModal from "@/components/admin/collections/GenerateCollectionsModal";
import { Sparkles } from "lucide-react";

interface Props {
    initialCollections: Collection[];
    initialProducts: Product[];
}

export default function OfertasClient({ initialCollections, initialProducts }: Props) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
    const [newCollection, setNewCollection] = useState<Partial<Collection>>({
        name: "",
        description: "",
        slug: "",
        discountType: 'none',
        discountValue: 0,
        isFeatured: false,
        productIds: [],
        holiday: 'none' // Init
    });
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAiModal, setShowAiModal] = useState(false);

    const router = useRouter();

    const toggleProductInCollection = (productId: string, isEditing: boolean) => {
        if (isEditing && editingCollection) {
            const currentIds = editingCollection.productIds || [];
            const newIds = currentIds.includes(productId)
                ? currentIds.filter(id => id !== productId)
                : [...currentIds, productId];
            setEditingCollection({ ...editingCollection, productIds: newIds });
        } else {
            const currentIds = newCollection.productIds || [];
            const newIds = currentIds.includes(productId)
                ? currentIds.filter(id => id !== productId)
                : [...currentIds, productId];
            setNewCollection({ ...newCollection, productIds: newIds });
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const slug = newCollection.name?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || "";
        const res = await createCollectionAction({ ...newCollection, slug } as Collection);
        setIsSaving(false);
        if (res.success) {
            setIsCreating(false);
            setNewCollection({ name: "", description: "", slug: "", discountType: 'none', discountValue: 0, isFeatured: false, productIds: [], holiday: 'none' });
            router.refresh();
        } else {
            alert(res.error);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar esta oferta?")) return;
        const res = await deleteCollectionAction(id);
        if (res.success) router.refresh();
        else alert(res.error);
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCollection) return;
        setIsSaving(true);
        const res = await updateCollectionAction(editingCollection);
        setIsSaving(false);
        if (res.success) {
            setEditingCollection(null);
            router.refresh();
        } else {
            alert(res.error);
        }
    }

    const filteredProducts = initialProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                    type="button"
                    onClick={() => setShowAiModal(true)}
                    className="admin-btn admin-btn-dark px-8 py-4 !rounded-2xl !text-sm !uppercase !tracking-widest"
                >
                    <Sparkles size={16} /> Generar ofertas con IA
                </button>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-sm uppercase tracking-widest"
                >
                    + Nueva oferta manual
                </button>
            </div>

            {showAiModal && (
                <GenerateCollectionsModal
                    products={initialProducts}
                    onClose={() => setShowAiModal(false)}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialCollections.length === 0 && (
                    <div className="col-span-full bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 text-center">
                        <p className="text-gray-400 font-bold uppercase tracking-widest">No hay ofertas creadas</p>
                    </div>
                )}
                {initialCollections.map(col => {
                    const holidayInfo = HOLIDAYS.find(h => h.id === col.holiday);
                    return (
                        <div key={col.id} className={`${col.isFeatured ? 'ring-4 ring-primary/20 bg-primary/5' : 'bg-white'} p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all relative overflow-hidden`}>
                            {col.discountType !== 'none' && (
                                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-2 font-black text-[10px] uppercase tracking-widest rounded-bl-2xl">
                                    {col.discountType === 'percentage' ? `${col.discountValue}% OFF` : `$${col.discountValue} OFF`}
                                </div>
                            )}
                            {holidayInfo && (
                                <div className="absolute top-0 left-0 bg-gradient-to-r text-white px-6 py-2 font-black text-[10px] uppercase tracking-widest rounded-br-2xl" style={{ backgroundImage: `linear-gradient(to right, ${holidayInfo.colors.primary}, ${holidayInfo.colors.secondary})` }}>
                                    {holidayInfo.icon} {holidayInfo.label}
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-4 mt-8">
                                <div className={`${col.isFeatured ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400'} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-colors`}>
                                    {col.isFeatured ? '🔥' : '🏷️'}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingCollection(col)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-colors">✏️</button>
                                    <button onClick={() => handleDelete(col.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors">🗑️</button>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">{col.name}</h3>
                            <p className="text-gray-400 text-sm font-medium line-clamp-2 mb-4">{col.description || 'Sin descripción'}</p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gray-500">
                                    {col.productIds?.length || 0} Productos
                                </span>
                                {col.isFeatured && (
                                    <span className="px-3 py-1 bg-primary/20 rounded-full text-[10px] font-black uppercase text-primary">
                                        Destacado
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-2 mt-2">
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">/{col.slug}</div>
                                <a
                                    href={`/oferta/${col.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-[#1E5BC6] hover:underline"
                                >
                                    Ver en tienda →
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create & Edit Modals (Unified UI logic) */}
            {(isCreating || editingCollection) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black">{isCreating ? 'Nueva oferta' : 'Editar oferta'}</h2>
                            <button onClick={() => { setIsCreating(false); setEditingCollection(null); }} className="text-gray-400 hover:text-gray-900 font-black">CERRAR</button>
                        </div>

                        <form onSubmit={isCreating ? handleCreate : handleUpdate} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Left Column: Details */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-8 rounded-[2.5rem] space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Información Básica</h3>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Nombre</label>
                                        <input
                                            required
                                            value={isCreating ? newCollection.name : editingCollection?.name}
                                            onChange={e => isCreating ? setNewCollection({ ...newCollection, name: e.target.value }) : setEditingCollection({ ...editingCollection!, name: e.target.value })}
                                            className="w-full bg-white border-none rounded-2xl p-4 font-bold shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Descripción</label>
                                        <textarea
                                            value={isCreating ? newCollection.description : editingCollection?.description}
                                            onChange={e => isCreating ? setNewCollection({ ...newCollection, description: e.target.value }) : setEditingCollection({ ...editingCollection!, description: e.target.value })}
                                            className="w-full bg-white border-none rounded-2xl p-4 font-medium shadow-sm h-24"
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-8 rounded-[2.5rem] space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Promoción y Visibilidad</h3>

                                    {/* Holiday Selector */}
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-purple-600 mb-2">🎈 Asignar Festividad / Evento</label>
                                        <select
                                            value={isCreating ? (newCollection.holiday || 'none') : (editingCollection?.holiday || 'none')}
                                            onChange={e => isCreating ? setNewCollection({ ...newCollection, holiday: e.target.value }) : setEditingCollection({ ...editingCollection!, holiday: e.target.value })}
                                            className="w-full bg-purple-50 border-2 border-purple-100 rounded-2xl p-4 font-bold shadow-sm text-sm text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                        >
                                            <option value="none">Ninguna (Estándar)</option>
                                            {HOLIDAYS.map(h => (
                                                <option key={h.id} value={h.id}>
                                                    {h.icon} {h.label} ({h.startDay}/{h.startMonth + 1})
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                            Si asignás un evento, esta oferta tendrá un diseño especial durante las fechas correspondientes.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tipo de Descuento</label>
                                            <select
                                                value={isCreating ? newCollection.discountType : editingCollection?.discountType}
                                                onChange={e => isCreating ? setNewCollection({ ...newCollection, discountType: e.target.value as any }) : setEditingCollection({ ...editingCollection!, discountType: e.target.value as any })}
                                                className="w-full bg-white border-none rounded-2xl p-4 font-bold shadow-sm text-sm"
                                            >
                                                <option value="none">Sin Descuento</option>
                                                <option value="percentage">Porcentaje (%)</option>
                                                <option value="fixed">Fijo ($)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Valor</label>
                                            <input
                                                type="number"
                                                value={isCreating ? newCollection.discountValue : editingCollection?.discountValue}
                                                onChange={e => isCreating ? setNewCollection({ ...newCollection, discountValue: Number(e.target.value) }) : setEditingCollection({ ...editingCollection!, discountValue: Number(e.target.value) })}
                                                disabled={(isCreating ? newCollection.discountType : editingCollection?.discountType) === 'none'}
                                                className="w-full bg-white border-none rounded-2xl p-4 font-bold shadow-sm disabled:opacity-30"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                                        <input
                                            type="checkbox"
                                            id="featured-toggle"
                                            checked={isCreating ? newCollection.isFeatured : editingCollection?.isFeatured}
                                            onChange={e => isCreating ? setNewCollection({ ...newCollection, isFeatured: e.target.checked }) : setEditingCollection({ ...editingCollection!, isFeatured: e.target.checked })}
                                            className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-none bg-gray-100"
                                        />
                                        <label htmlFor="featured-toggle" className="text-sm font-bold text-gray-700 cursor-pointer">Destacar en la tienda 🔥</label>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Product Picker */}
                            <div className="space-y-4 flex flex-col h-full">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Seleccionar Productos ({isCreating ? newCollection.productIds?.length : editingCollection?.productIds?.length})</h3>
                                <input
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-sm"
                                />
                                <div className="flex-1 bg-gray-50 rounded-3xl p-4 overflow-y-auto space-y-2 max-h-[400px]">
                                    {filteredProducts.map(product => {
                                        const isSelected = isCreating
                                            ? newCollection.productIds?.includes(product.id)
                                            : editingCollection?.productIds?.includes(product.id);
                                        return (
                                            <div
                                                key={product.id}
                                                onClick={() => toggleProductInCollection(product.id, !!editingCollection)}
                                                className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${isSelected ? 'bg-primary text-white shadow-lg' : 'bg-white hover:bg-gray-100'}`}
                                            >
                                                <img src={transformImageUrl(product.image)} className="w-10 h-10 rounded-lg object-cover" />
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>{product.name}</p>
                                                    <p className={`text-[10px] font-bold ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>{product.category}</p>
                                                </div>
                                                {isSelected && <span className="text-xl">✅</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="lg:col-span-2 flex gap-4 pt-6 border-t border-gray-100">
                                <button type="button" onClick={() => { setIsCreating(false); setEditingCollection(null); }} className="px-10 py-5 font-black text-gray-400 uppercase tracking-widest text-xs">Cancelar</button>
                                <button disabled={isSaving} type="submit" className="flex-1 bg-gray-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                                    {isSaving ? 'Guardando...' : (isCreating ? 'Crear Promoción' : 'Guardar Cambios')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
