"use client";

import { useState, useMemo } from "react";
import { Product, Category } from "@/lib/types";
import { deleteProductAction, updateProductAction, deleteAllProductsAction, deleteMultipleProductsAction, createProductAction, bulkUpdatePricesAction, uploadImageAction, getCategoriesAction } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    collections: [],
    isActive: true
};

export default function ProductsTable({ initialProducts }: Props) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isSaving, setIsSaving] = useState(false);
    const [dbCategories, setDbCategories] = useState<Category[]>([]);
    const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false);
    const [bulkPercentage, setBulkPercentage] = useState(0);

    const router = useRouter();

    useEffect(() => {
        const fetchCats = async () => {
            const res = await getCategoriesAction() as any;
            if (res) setDbCategories(res);
        };
        fetchCats();
    }, []);

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

    const handleBulkPriceUpdate = async () => {
        if (!confirm(`¿Seguro que querés aplicar un aumento del ${bulkPercentage}% a los productos seleccionados?`)) return;
        setIsSaving(true);
        try {
            const result = await bulkUpdatePricesAction(bulkPercentage, selectedCategory !== 'all' ? selectedCategory : undefined);
            if (result.success) {
                setIsBulkPriceModalOpen(false);
                handleRefresh();
            } else {
                alert(result.error);
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header / Actions Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mt-2">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Gestión de Productos</h2>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{filteredProducts.length} productos en catálogo</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => setIsBulkPriceModalOpen(true)}
                        className="px-6 py-4 bg-gray-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3"
                    >
                        📈 Ajuste Masivo
                    </button>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <span className="text-xl">+</span> Nuevo Producto
                    </button>
                </div>
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
                {/* Mobile Cards View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className={`p-4 ${selectedIds.has(product.id) ? 'bg-primary/5' : ''}`}>
                            <div className="flex items-start gap-4">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(product.id)}
                                    onChange={() => toggleSelect(product.id)}
                                    className="mt-1 w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary/20"
                                />
                                <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                    {product.image ? (
                                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">📦</div>
                                    )}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-black text-gray-900 text-base mb-1 line-clamp-2">{product.name}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-black text-primary text-lg">${product.price.toLocaleString("es-AR")}</span>
                                        <span className={`text-xs font-black px-2 py-1 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.stock} uts.
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`w-2 h-2 rounded-full ${product.isActive !== false ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                        <span className="text-xs font-bold text-gray-600">
                                            {product.isActive !== false ? 'Activo' : 'Pausado'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingProduct(product)}
                                            className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold text-sm"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold text-sm"
                                        >
                                            🗑️ Borrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="p-16 text-center">
                            <div className="text-6xl mb-4 opacity-10">🔎</div>
                            <p className="text-gray-500 font-bold text-sm">No se encontraron productos</p>
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <table className="hidden md:table w-full text-left border-collapse">
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
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</th>
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
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${product.isActive !== false ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-300'}`}></span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            {product.isActive !== false ? 'Activo' : 'Pausado'}
                                        </span>
                                    </div>
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
                    dbCategories={dbCategories}
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
                    dbCategories={dbCategories}
                />
            )}

            {/* Bulk Price Modal */}
            {isBulkPriceModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70] animate-in zoom-in duration-200">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 text-center">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">📈</div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Ajuste Masivo de Precios</h2>
                        <p className="text-gray-500 text-sm mb-8">Aplicar aumento porcentual a {selectedCategory === 'all' ? 'todos los productos' : `categoría ${selectedCategory}`}.</p>

                        <div className="mb-8">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Porcentaje de aumento (%)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={bulkPercentage}
                                    onChange={(e) => setBulkPercentage(Number(e.target.value))}
                                    className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-emerald-100 font-black text-3xl text-center text-emerald-600"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black text-emerald-200">%</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setIsBulkPriceModalOpen(false)} className="flex-1 py-4 font-black text-xs uppercase tracking-widest text-gray-400">Cancelar</button>
                            <button
                                onClick={handleBulkPriceUpdate}
                                disabled={isSaving}
                                className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 hover:scale-105 transition-all"
                            >
                                {isSaving ? 'Procesando...' : 'Aplicar Aumento'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Reusable Modal Component
function ProductFormModal({ title, product, setProduct, onClose, onSubmit, isSaving, isEditing = false, dbCategories = [] }: any) {
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
                                const result = await uploadImageAction(formData);
                                if (result.success) setProduct({ ...product, image: result.url });
                                else alert(result.error);
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
                                <select
                                    required
                                    value={product.category}
                                    onChange={(e) => {
                                        const cat = dbCategories?.find((c: any) => c.name === e.target.value);
                                        setProduct({ ...product, category: e.target.value, categoryId: cat?.id });
                                    }}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-gray-900"
                                >
                                    <option value="">Seleccionar Categoría</option>
                                    <option value="Varios">Varios</option>
                                    {dbCategories?.map((cat: any) => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2 flex items-center justify-between bg-gray-50 p-6 rounded-2xl">
                                <div>
                                    <div className="text-sm font-black text-gray-900">Producto Activo</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">¿Mostrar en la tienda?</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setProduct({ ...product, isActive: !product.isActive })}
                                    className={`w-14 h-8 rounded-full p-1 transition-colors ${product.isActive !== false ? 'bg-primary' : 'bg-gray-200'}`}
                                >
                                    <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${product.isActive !== false ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2 px-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Descripción</label>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!product.name) {
                                            alert('Por favor ingresá un nombre de producto primero');
                                            return;
                                        }
                                        const btn = event?.target as HTMLButtonElement;
                                        if (btn) {
                                            btn.disabled = true;
                                            btn.textContent = '⏳ Optimizando...';
                                        }
                                        try {
                                            const res = await fetch('/api/optimize-product', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ product })
                                            });
                                            const data = await res.json();
                                            if (data.success) {
                                                const confirmed = confirm(
                                                    `✨ IA SUGIERE:\n\nDescripción:\n${data.suggestions.description}\n\nCaracterísticas:\n${data.suggestions.features.join('\n')}\n\n¿Aplicar estas sugerencias?`
                                                );
                                                if (confirmed) {
                                                    setProduct({
                                                        ...product,
                                                        description: data.suggestions.description,
                                                        features: data.suggestions.features
                                                    });
                                                }
                                            } else {
                                                alert('Error: ' + data.error);
                                            }
                                        } catch (err) {
                                            alert('Error al optimizar producto');
                                        } finally {
                                            if (btn) {
                                                btn.disabled = false;
                                                btn.textContent = '✨ Optimizar con IA';
                                            }
                                        }
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                                >
                                    ✨ Optimizar con IA
                                </button>
                            </div>
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
