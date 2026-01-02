"use client";

import React, { useState } from "react";
import { Category } from "@/lib/types";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

interface Props {
    initialCategories: Category[];
}

export default function CategoriesClient({ initialCategories }: Props) {
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", description: "" });
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const slug = newCategory.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const res = await createCategoryAction({ ...newCategory, slug });
        setIsSaving(false);
        if (res.success) {
            setIsCreating(false);
            setNewCategory({ name: "", description: "" });
            router.refresh();
        } else {
            alert(res.error);
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        setIsSaving(true);
        const res = await updateCategoryAction(editingCategory);
        setIsSaving(false);
        if (res.success) {
            setEditingCategory(null);
            router.refresh();
        } else {
            alert(res.error);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Borrar esta categoría? Esto no afectará a los productos ya categorizados, pero dejarán de tener este ID.")) return;
        const res = await deleteCategoryAction(id);
        if (res.success) {
            router.refresh();
        } else {
            alert(res.error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                    + Nueva Categoría
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialCategories.map(cat => (
                    <div key={cat.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">📁</div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingCategory(cat)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-colors">✏️</button>
                                <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors">🗑️</button>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-1">{cat.name}</h3>
                        <p className="text-gray-400 text-xs font-medium line-clamp-2">{cat.description || 'Sin descripción'}</p>
                        <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-300">Slug: {cat.slug}</div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">Nueva Categoría</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                placeholder="Nombre"
                                required
                                value={newCategory.name}
                                onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none font-bold"
                            />
                            <textarea
                                placeholder="Descripción (opcional)"
                                value={newCategory.description}
                                onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none font-medium min-h-[100px]"
                            />
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-4 font-black text-xs uppercase text-gray-400">Cancelar</button>
                                <button disabled={isSaving} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-primary/20">
                                    {isSaving ? 'Guardando...' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingCategory && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">Editar Categoría</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input
                                placeholder="Nombre"
                                required
                                value={editingCategory.name}
                                onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none font-bold"
                            />
                            <textarea
                                placeholder="Descripción"
                                value={editingCategory.description}
                                onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none font-medium min-h-[100px]"
                            />
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setEditingCategory(null)} className="flex-1 py-4 font-black text-xs uppercase text-gray-400">Cancelar</button>
                                <button disabled={isSaving} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-primary/20">
                                    {isSaving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
