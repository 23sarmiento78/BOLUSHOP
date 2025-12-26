"use client";

import { useState } from "react";
import { Collection } from "@/lib/db";
import { createCollectionAction, deleteCollectionAction, updateCollectionAction } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

interface Props {
    initialCollections: Collection[];
}

export default function CollectionsClient({ initialCollections }: Props) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
    const [newCollection, setNewCollection] = useState({ name: "", description: "", slug: "" });
    const [isSaving, setIsSaving] = useState(false);

    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const slug = newCollection.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const res = await createCollectionAction({ ...newCollection, slug });
        setIsSaving(false);
        if (res.success) {
            setIsCreating(false);
            setNewCollection({ name: "", description: "", slug: "" });
            router.refresh();
        } else {
            alert(res.error);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar esta colección?")) return;
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

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-sm uppercase tracking-widest"
                >
                    + Nueva Colección
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialCollections.length === 0 && (
                    <div className="col-span-full bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 text-center">
                        <p className="text-gray-400 font-bold uppercase tracking-widest">No hay colecciones creadas</p>
                    </div>
                )}
                {initialCollections.map(col => (
                    <div key={col.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl">🏷️</div>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingCollection(col)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-colors">✏️</button>
                                <button onClick={() => handleDelete(col.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors">🗑️</button>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">{col.name}</h3>
                        <p className="text-gray-400 text-sm font-medium line-clamp-2 mb-4">{col.description || 'Sin descripción'}</p>
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">Slug: {col.slug}</div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleCreate} className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-3xl font-black mb-6">Nueva Colección</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Nombre</label>
                                <input
                                    required
                                    value={newCollection.name}
                                    onChange={e => setNewCollection({ ...newCollection, name: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Descripción</label>
                                <textarea
                                    value={newCollection.description}
                                    onChange={e => setNewCollection({ ...newCollection, description: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium h-32"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-4 font-black text-gray-400 uppercase tracking-widest text-xs">Cancelar</button>
                            <button disabled={isSaving} type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                                {isSaving ? 'Guardando...' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Modal (simplified reuse) */}
            {editingCollection && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleUpdate} className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-3xl font-black mb-6">Editar Colección</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Nombre</label>
                                <input
                                    required
                                    value={editingCollection.name}
                                    onChange={e => setEditingCollection({ ...editingCollection, name: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Slug</label>
                                <input
                                    required
                                    value={editingCollection.slug}
                                    onChange={e => setEditingCollection({ ...editingCollection, slug: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Descripción</label>
                                <textarea
                                    value={editingCollection.description}
                                    onChange={e => setEditingCollection({ ...editingCollection, description: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium h-32"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button type="button" onClick={() => setEditingCollection(null)} className="flex-1 py-4 font-black text-gray-400 uppercase tracking-widest text-xs">Cancelar</button>
                            <button disabled={isSaving} type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                                {isSaving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
