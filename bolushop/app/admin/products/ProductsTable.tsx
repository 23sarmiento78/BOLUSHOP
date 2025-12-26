"use client";

import { useState, useMemo } from "react";
import { Product } from "@/lib/db";
import { deleteProductAction, updateProductAction, deleteAllProductsAction, deleteMultipleProductsAction, createProductAction } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

interface Props {
    initialProducts: Product[];
}

const EMPTY_PRODUCT: Omit<Product, 'id' | 'createdAt'> = {
    name: "",
    slug: "",
    price: 0,
    image: "",
    category: "",
    description: "",
    features: [],
    stock: 99,
    collections: []
};

export default function ProductsTable({ initialProducts }: Props) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isSaving, setIsSaving] = useState(false);

    const router = useRouter();

    const categories = useMemo(() => {
        const cats = new Set(initialProducts.map(p => p.category));
        return ["all", ...Array.from(cats)];
    }, [initialProducts]);

    const filteredProducts = useMemo(() => {
        return initialProducts.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [initialProducts, searchTerm, selectedCategory]);

    const handleRefresh = () => {
        router.refresh();
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que querés eliminar este producto?")) return;
        const result = await deleteProductAction(id);
        if (result && !result.success) {
            alert(result.error);
        } else {
            handleRefresh();
        }
    };

    const handleDeleteAll = async () => {
        if (confirm("⚠ ¡ATENCIÓN! ⚠\n\n¿Estás seguro de que querés borrar TODOS los productos?\n\nEsta acción no se puede deshacer.")) {
            if (confirm("Confirmación final: ¿Borrar TODO?")) {
                const result = await deleteAllProductsAction();
                if (result && !result.success) {
                    alert(result.error);
                } else {
                    handleRefresh();
                }
            }
        }
    }

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`¿Borrar los ${selectedIds.size} productos seleccionados?`)) return;

        const result = await deleteMultipleProductsAction(Array.from(selectedIds));
        if (result && !result.success) {
            alert(result.error);
        } else {
            setSelectedIds(new Set());
            handleRefresh();
        }
    }

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        setIsSaving(true);
        try {
            const result = await updateProductAction(editingProduct);
            if (result && !result.success) {
                alert(result.error);
            } else {
                setEditingProduct(null);
                handleRefresh();
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const slug = newProduct.name.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');

            const result = await createProductAction({ ...newProduct, slug });
            if (result && !result.success) {
                alert(result.error);
            } else {
                setIsCreating(false);
                setNewProduct(EMPTY_PRODUCT);
                handleRefresh();
            }
        } finally {
            setIsSaving(false);
        }
    }

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredProducts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredProducts.map(p => p.id)));
        }
    }

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    }

    return (
        <div className="space-y-6">
            {/* Header / Actions Bar */}
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mt-2">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Gestión de Productos</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{filteredProducts.length} productos en catálogo</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                    <span className="text-xl">+</span> Nuevo Producto
                </button>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                    />
                </div>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full md:w-48 py-3 px-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs uppercase tracking-widest text-gray-500"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'all' ? 'Todas las Categorías' : cat}</option>
                    ))}
                </select>

                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={handleDeleteAll}
                        className="flex-grow md:flex-none px-4 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                    >
                        Borrar Todo
                    </button>
                    {selectedIds.size > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            className="flex-grow md:flex-none px-4 py-3 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-red-200"
                        >
                            Eliminar ({selectedIds.size})
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5 w-16">
                                <input
                                    type="checkbox"
                                    checked={filteredProducts.length > 0 && selectedIds.size === filteredProducts.length}
                                    onChange={toggleSelectAll}
                                    className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary/20"
                                />
                            </th>
                            <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Producto</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Precio</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Categoría</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.has(product.id) ? 'bg-primary/5' : ''}`}>
                                <td className="px-8 py-5">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(product.id)}
                                        onChange={() => toggleSelect(product.id)}
                                        className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary/20"
                                    />
                                </td>
                                <td className="px-4 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 shadow-inner">
                                            {product.image ? (
                                                <img src={product.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xl grayscale opacity-30">📦</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900 text-sm mb-0.5 line-clamp-1">{product.name}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">ID: {product.id.slice(0, 8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="font-black text-gray-900">${product.price.toLocaleString("es-AR")}</div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className={`text-xs font-black px-3 py-1 rounded-full inline-block ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.stock} uts.
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{product.category}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setEditingProduct(product)}
                                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <div className="p-24 text-center">
                        <div className="text-7xl mb-6 opacity-10">🔎</div>
                        <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No se encontraron productos</p>
                    </div>
                )}
            </div>

            {/* Create Product Modal */}
            {isCreating && (
                <ProductFormModal
                    title="Nuevo Producto"
                    product={newProduct}
                    setProduct={setNewProduct}
                    onClose={() => setIsCreating(false)}
                    onSubmit={handleCreateProduct}
                    isSaving={isSaving}
                />
            )}

            {/* Edit Modal */}
            {editingProduct && (
                <ProductFormModal
                    title="Editar Producto"
                    product={editingProduct}
                    setProduct={setEditingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSubmit={handleSaveEdit}
                    isSaving={isSaving}
                    isEditing={true}
                />
            )}
        </div>
    );
}

// Reusable Modal Component
function ProductFormModal({ title, product, setProduct, onClose, onSubmit, isSaving, isEditing = false }: any) {
    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col md:flex-row">
                {/* Image Side */}
                <div className="w-full md:w-2/5 bg-gray-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="w-full aspect-square bg-white rounded-[2.5rem] shadow-inner overflow-hidden border-4 border-white mb-6 group relative">
                        {product.image ? (
                            <img src={product.image} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl opacity-10">🖼️</div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label htmlFor="file-upload" className="cursor-pointer bg-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-110 transition-transform">
                                Subir Imagen
                            </label>
                        </div>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('file', file);
                            try {
                                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                const data = await res.json();
                                if (data.success) setProduct({ ...product, image: data.url });
                            } catch (err) { alert('Error al subir imagen'); }
                        }}
                        className="hidden"
                        id="file-upload"
                    />

                    <input
                        type="text"
                        placeholder="O pegá una URL aquí"
                        value={product.image}
                        onChange={(e) => setProduct({ ...product, image: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-white border-none focus:ring-2 focus:ring-primary/20 text-xs font-medium text-gray-500 shadow-sm"
                    />
                </div>

                {/* Form Side */}
                <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h2>
                            {isEditing && <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {product.id}</p>}
                        </div>
                        <button onClick={onClose} className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors text-xl">✕</button>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Nombre del Producto</label>
                                <input
                                    required
                                    value={product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Precio (ARS)</label>
                                <input
                                    required
                                    type="number"
                                    value={product.price}
                                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-black text-gray-900 text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Stock disponible</label>
                                <input
                                    required
                                    type="number"
                                    value={product.stock}
                                    onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-black text-gray-900 text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Categoría</label>
                                <input
                                    required
                                    value={product.category}
                                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Descripción</label>
                            <textarea
                                required
                                value={product.description}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-medium text-gray-700 min-h-[120px]"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-[2] py-4 px-6 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                {isSaving ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
