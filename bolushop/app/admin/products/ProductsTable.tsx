"use client";

import { useState, useMemo } from "react";
import { Product, Category } from "@/lib/types";
import { transformImageUrl } from "@/lib/images";
import { deleteProductAction, updateProductAction, deleteAllProductsAction, deleteMultipleProductsAction, createProductAction, bulkUpdatePricesAction, bulkResetPricesAction, uploadImageAction, getCategoriesAction, bulkUpdateCategoriesAction } from "@/app/actions/admin";
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
    isActive: false
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
    const [isBulkCategoryModalOpen, setIsBulkCategoryModalOpen] = useState(false);
    const [bulkPercentage, setBulkPercentage] = useState(0);
    const [bulkTargetCategory, setBulkTargetCategory] = useState<{ name: string, id: string }>({ name: "", id: "" });

    const router = useRouter();

    const [globalSettings, setGlobalSettings] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [catsRes, settingsRes] = await Promise.all([
                getCategoriesAction(),
                fetch('/api/admin/settings').then(res => res.json())
            ]);
            if (catsRes) setDbCategories(catsRes as any);
            if (settingsRes && settingsRes.settings) setGlobalSettings(settingsRes.settings);
        };
        fetchData();
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
        const actionText = bulkPercentage > 0 ? `aumentar un ${bulkPercentage}%` : `bajar un ${Math.abs(bulkPercentage)}%`;
        const scopeText = selectedIds.size > 0 ? `los ${selectedIds.size} productos seleccionados` : (selectedCategory === 'all' ? 'TODOS los productos' : `la categoría ${selectedCategory}`);

        if (!confirm(`¿Seguro que querés ${actionText} a ${scopeText}?`)) return;

        setIsSaving(true);
        try {
            const result = await bulkUpdatePricesAction(
                bulkPercentage,
                selectedIds.size > 0 ? Array.from(selectedIds) : undefined,
                selectedCategory !== 'all' ? selectedCategory : undefined
            );
            if (result.success) {
                setIsBulkPriceModalOpen(false);
                setSelectedIds(new Set());
                handleRefresh();
            } else {
                alert(result.error);
            }
        } finally {
            setIsSaving(false);
        }
    }

    const handleBulkReset = async () => {
        const scopeText = selectedIds.size > 0 ? `los ${selectedIds.size} productos seleccionados` : (selectedCategory === 'all' ? 'TODOS los productos' : `la categoría ${selectedCategory}`);

        if (!confirm(`¿Seguro que querés resetear al PRECIO ORIGINAL (Costo + Estrategia) a ${scopeText}?`)) return;

        setIsSaving(true);
        try {
            const result = await bulkResetPricesAction(
                selectedIds.size > 0 ? Array.from(selectedIds) : undefined,
                selectedCategory !== 'all' ? selectedCategory : undefined
            );
            if (result.success) {
                setIsBulkPriceModalOpen(false);
                setSelectedIds(new Set());
                handleRefresh();
            } else {
                alert(result.error);
            }
        } finally {
            setIsSaving(false);
        }
    }

    const handleBulkCategoryUpdate = async () => {
        if (!bulkTargetCategory.name) return;
        if (!confirm(`¿Seguro que querés mover ${selectedIds.size} productos a la categoría "${bulkTargetCategory.name}"?`)) return;

        setIsSaving(true);
        try {
            const result = await bulkUpdateCategoriesAction(Array.from(selectedIds), bulkTargetCategory.name, bulkTargetCategory.id);
            if (result.success) {
                setIsBulkCategoryModalOpen(false);
                setSelectedIds(new Set());
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
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mt-2">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Gestión de Productos</h2>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{filteredProducts.length} productos en catálogo</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={() => setIsBulkPriceModalOpen(true)}
                        className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        📈 Ajuste Masivo
                    </button>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        + Nuevo Producto
                    </button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 items-center">
                <div className="relative flex-grow w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border-none focus:ring-1 focus:ring-primary/20 transition-all font-medium text-xs"
                    />
                </div>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full md:w-44 py-2.5 px-4 rounded-xl bg-gray-50 border-none focus:ring-1 focus:ring-primary/20 transition-all font-bold text-[10px] uppercase tracking-wider text-gray-500"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'all' ? 'Categorías' : cat}</option>
                    ))}
                </select>

                <div className="flex gap-2 w-full md:w-auto">
                    {selectedIds.size > 0 && (
                        <>
                            <button
                                onClick={() => setIsBulkCategoryModalOpen(true)}
                                className="flex-grow md:flex-none px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all"
                            >
                                Mover ({selectedIds.size})
                            </button>
                            <button
                                onClick={handleDeleteSelected}
                                className="flex-grow md:flex-none px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all"
                            >
                                Borrar ({selectedIds.size})
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleDeleteAll}
                        className="flex-grow md:flex-none px-4 py-2 text-gray-400 hover:text-red-500 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
                    >
                        Limpiar Todo
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Mobile Cards View */}
                <div className="md:hidden divide-y divide-gray-50">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className={`p-4 ${selectedIds.has(product.id) ? 'bg-primary/5' : ''}`}>
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(product.id)}
                                    onChange={() => toggleSelect(product.id)}
                                    className="mt-1 w-4 h-4 rounded border-gray-200 text-primary focus:ring-0"
                                />
                                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                    {product.image ? (
                                        <img src={transformImageUrl(product.image)} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl opacity-30">📦</div>
                                    )}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-bold text-gray-900 text-sm mb-0.5 line-clamp-1">{product.name}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-primary text-base">${product.price.toLocaleString("es-AR")}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {product.stock} uts.
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
                            <th className="px-6 py-4 w-12">
                                <input
                                    type="checkbox"
                                    checked={filteredProducts.length > 0 && selectedIds.size === filteredProducts.length}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded border-gray-200 text-primary focus:ring-0"
                                />
                            </th>
                            <th className="px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Producto</th>
                            <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Precio</th>
                            <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Stock</th>
                            <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Estado</th>
                            <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className={`hover:bg-gray-50/30 transition-colors group ${selectedIds.has(product.id) ? 'bg-primary/5' : ''}`}>
                                <td className="px-6 py-3.5">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(product.id)}
                                        onChange={() => toggleSelect(product.id)}
                                        className="w-4 h-4 rounded border-gray-200 text-primary focus:ring-0"
                                    />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                            {product.image ? (
                                                <img src={transformImageUrl(product.image)} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs opacity-20">📦</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-xs mb-0.5 line-clamp-1">{product.name}</div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-[9px] font-medium text-gray-400 uppercase tracking-tight">{product.category}</div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-3.5 text-xs font-bold text-gray-900">
                                    ${product.price.toLocaleString("es-AR")}
                                </td>
                                <td className="px-6 py-3.5">
                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block ${product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {product.stock} uts.
                                    </div>
                                </td>
                                <td className="px-6 py-3.5">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${product.isActive !== false ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                            {product.isActive !== false ? 'Activo' : 'Pausado'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-3.5 text-right">
                                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditingProduct(product)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">✏️</button>
                                        <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">🗑️</button>
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
                    globalSettings={globalSettings}
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
                    globalSettings={globalSettings}
                />
            )}

            {/* Bulk Price Modal */}
            {isBulkPriceModalOpen && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[70] animate-in zoom-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center border border-gray-100">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-6">📉</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Ajuste de Precios</h2>
                        <p className="text-gray-400 text-xs mb-8">
                            Afectará a {selectedIds.size > 0 ? `${selectedIds.size} seleccionados` : (selectedCategory === 'all' ? 'todo el catálogo' : `categoría ${selectedCategory}`)}.
                        </p>

                        <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-4">Ajuste Porcentual (%)</label>
                            <div className="relative flex items-center gap-3">
                                <button
                                    onClick={() => setBulkPercentage(prev => prev - 1)}
                                    className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-100 font-bold text-lg hover:bg-gray-50 transition-colors"
                                >-</button>
                                <div className="relative flex-grow">
                                    <input
                                        type="number"
                                        value={bulkPercentage}
                                        onChange={(e) => setBulkPercentage(Number(e.target.value))}
                                        className={`w-full px-3 py-3 rounded-lg border-none focus:ring-1 font-bold text-xl text-center ${bulkPercentage >= 0 ? 'text-emerald-600 focus:ring-emerald-100' : 'text-red-600 focus:ring-red-100'}`}
                                    />
                                </div>
                                <button
                                    onClick={() => setBulkPercentage(prev => prev + 1)}
                                    className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-100 font-bold text-lg hover:bg-gray-50 transition-colors"
                                >+</button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleBulkPriceUpdate}
                                disabled={isSaving || bulkPercentage === 0}
                                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 ${bulkPercentage >= 0 ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-red-600 text-white shadow-red-200'}`}
                            >
                                {isSaving ? 'Procesando...' : (bulkPercentage >= 0 ? 'Aplicar Aumento' : 'Aplicar Descuento')}
                            </button>

                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-gray-100 flex-grow" />
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">O también</span>
                                <div className="h-px bg-gray-100 flex-grow" />
                            </div>

                            <button
                                onClick={handleBulkReset}
                                disabled={isSaving}
                                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3"
                            >
                                🔄 Restaurar Precio Original
                            </button>

                            <p className="text-[9px] font-bold text-gray-400 italic">Recalcula basado en Costo + Estrategia (Margen y Envío)</p>

                            <button onClick={() => setIsBulkPriceModalOpen(false)} className="w-full py-3 font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-600">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Category Modal */}
            {isBulkCategoryModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70] animate-in zoom-in duration-200">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 text-center">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">🏷️</div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Asignar Categoría</h2>
                        <p className="text-gray-500 text-sm mb-8">Mover {selectedIds.size} productos seleccionados a una nueva categoría.</p>

                        <div className="mb-8">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 text-left px-1">Nueva Categoría</label>
                            <select
                                value={bulkTargetCategory.name}
                                onChange={(e) => {
                                    const cat = dbCategories.find(c => c.name === e.target.value);
                                    if (cat) setBulkTargetCategory({ name: cat.name, id: cat.id });
                                    else if (e.target.value === "Varios") setBulkTargetCategory({ name: "Varios", id: "varios" });
                                }}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-100 border-none focus:ring-4 focus:ring-blue-100 font-bold text-gray-700"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Varios">Varios</option>
                                {dbCategories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setIsBulkCategoryModalOpen(false)} className="flex-1 py-4 font-black text-xs uppercase tracking-widest text-gray-400">Cancelar</button>
                            <button
                                onClick={handleBulkCategoryUpdate}
                                disabled={isSaving || !bulkTargetCategory.name}
                                className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isSaving ? 'Procesando...' : 'Aplicar Categoría'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

// Reusable Modal Component
function ProductFormModal({ title, product, setProduct, onClose, onSubmit, isSaving, isEditing = false, dbCategories = [], globalSettings }: any) {
    const calculateRecommendedPrice = () => {
        if (!product.cost || !globalSettings) return;

        const margin = globalSettings.profitMargin || 1.0;
        const shipping = globalSettings.averageShippingCost || 0;

        // Logic: Price = (Cost * Margin) + Average Shipping
        const recommended = Math.ceil((product.cost * margin) + shipping);
        setProduct({ ...product, price: recommended });
    };
    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col md:flex-row">
                {/* Image Side */}
                {/* Image Side */}
                <div className="w-full md:w-1/3 bg-gray-50 p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100 overflow-y-auto">
                    {/* Main Image */}
                    <div className="w-full mb-6">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Imagen Principal</label>
                        <div className="w-full aspect-square bg-white rounded-2xl shadow-inner overflow-hidden border border-gray-200 mb-3 group relative">
                            {product.image ? (
                                <img src={transformImageUrl(product.image)} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl opacity-10">🖼️</div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label htmlFor="file-upload-main" className="cursor-pointer bg-white px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:scale-105 transition-transform">
                                    Cambiar Imagen
                                </label>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="URL de imagen principal"
                            value={product.image}
                            onChange={(e) => setProduct({ ...product, image: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl bg-white border-none focus:ring-2 focus:ring-primary/20 text-xs font-medium text-gray-500 shadow-sm mb-2"
                        />
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
                            id="file-upload-main"
                        />
                    </div>

                    {/* Additional Images */}
                    <div className="w-full border-t border-gray-200 pt-6">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-1">Galería de Imágenes ({product.images?.length || 0})</label>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {product.images?.map((img: string, idx: number) => (
                                <div key={idx} className="relative aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden group">
                                    <img src={transformImageUrl(img)} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newImages = [...(product.images || [])];
                                            newImages.splice(idx, 1);
                                            setProduct({ ...product, images: newImages });
                                        }}
                                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <label className="aspect-square bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                                <span className="text-xl text-gray-400">+</span>
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
                                            if (result.success) {
                                                const currentImages = product.images || [];
                                                setProduct({ ...product, images: [...currentImages, result.url] });
                                            } else alert(result.error);
                                        } catch (err) { alert('Error al subir imagen'); }
                                    }}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Agregar URL de imagen extra..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = (e.target as HTMLInputElement).value;
                                        if (val) {
                                            const currentImages = product.images || [];
                                            setProduct({ ...product, images: [...currentImages, val] });
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }
                                }}
                                className="w-full px-4 py-3 rounded-2xl bg-white border-none focus:ring-2 focus:ring-primary/20 text-xs font-medium text-gray-500 shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                    if (input.value) {
                                        const currentImages = product.images || [];
                                        setProduct({ ...product, images: [...currentImages, input.value] });
                                        input.value = '';
                                    }
                                }}
                                className="px-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-2/3 p-6 md:p-10 overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
                            {isEditing && <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {product.id}</p>}
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">✕</button>
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
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 bg-emerald-50/30 p-6 rounded-[2rem] border border-emerald-100/50">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 px-1">Costo (ARS)</label>
                                    <input
                                        type="number"
                                        value={product.cost || ""}
                                        onChange={(e) => setProduct({ ...product, cost: Number(e.target.value) })}
                                        className="w-full px-5 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-emerald-500/20 font-black text-emerald-900 text-lg"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={calculateRecommendedPrice}
                                        className="w-full py-4 px-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                                    >
                                        ⚡ Calcular Precio
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Precio Final (ARS)</label>
                                    <input
                                        required
                                        type="number"
                                        value={product.price}
                                        onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                                        className="w-full px-5 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-primary/20 font-black text-gray-900 text-lg"
                                    />
                                </div>
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
