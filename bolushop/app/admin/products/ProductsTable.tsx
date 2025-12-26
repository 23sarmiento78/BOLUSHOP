"use client";

import { useState } from "react";
import { Product } from "@/lib/db";
import { deleteProductAction, updateProductAction, deleteAllProductsAction, deleteMultipleProductsAction } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

interface Props {
    initialProducts: Product[];
}

export default function ProductsTable({ initialProducts }: Props) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const router = useRouter();

    const handleRefresh = () => {
        // Force hard reload to update UI
        window.location.reload();
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
        if (confirm("⚠ ¡ATENCIÓN! ⚠\n\n¿Estás seguro de que querés borrar TODOS los productos de la base de datos?\n\nEsta acción no se puede deshacer.")) {
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

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        updateProductAction(editingProduct).then((result) => {
            if (result && !result.success) {
                alert(result.error);
            } else {
                setEditingProduct(null);
                window.location.reload();
            }
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === initialProducts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(initialProducts.map(p => p.id)));
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
        <div>
            {/* Bulk Actions Bar */}
            <div className="flex gap-4 mb-4 items-center flex-wrap">
                <button
                    onClick={handleDeleteAll}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded font-bold text-sm hover:bg-red-200 border border-red-200 transition-colors"
                >
                    🗑️ Borrar TODO
                </button>

                {selectedIds.size > 0 && (
                    <button
                        onClick={handleDeleteSelected}
                        className="bg-red-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-red-700 transition-colors animate-pulse"
                    >
                        Borrar {selectedIds.size} seleccionados
                    </button>
                )}

                <div className="ml-auto text-sm text-gray-500">
                    Total: {initialProducts.length} productos
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 w-10">
                                <input
                                    type="checkbox"
                                    checked={initialProducts.length > 0 && selectedIds.size === initialProducts.length}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Nombre</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Precio</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Categoría</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {initialProducts.map((product) => (
                            <tr key={product.id} className={`hover:bg-gray-50/50 ${selectedIds.has(product.id) ? 'bg-blue-50' : ''}`}>
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(product.id)}
                                        onChange={() => toggleSelect(product.id)}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                </td>
                                <td className="p-4 text-sm font-medium text-gray-900">
                                    {product.name}
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    ${product.price.toLocaleString("es-AR")}
                                </td>
                                <td className="p-4 text-sm text-gray-600 capitalize">
                                    {product.category}
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={() => setEditingProduct(product)}
                                        className="text-blue-600 text-sm hover:underline font-bold"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-500 text-sm hover:underline"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-xl max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700">Nombre</label>
                                <input
                                    value={editingProduct.name}
                                    onChange={(e) =>
                                        setEditingProduct({ ...editingProduct, name: e.target.value })
                                    }
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700">Precio</label>
                                <input
                                    type="number"
                                    value={editingProduct.price}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            price: Number(e.target.value),
                                        })
                                    }
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700">Categoría</label>
                                <input
                                    value={editingProduct.category}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            category: e.target.value,
                                        })
                                    }
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-2">Imagen del Producto</label>

                                {editingProduct.image && (
                                    <div className="mb-3 relative w-full aspect-video bg-gray-50 rounded-lg overflow-hidden border">
                                        <img
                                            src={editingProduct.image}
                                            alt="Preview"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="URL de la imagen"
                                        value={editingProduct.image}
                                        onChange={(e) =>
                                            setEditingProduct({ ...editingProduct, image: e.target.value })
                                        }
                                        className="w-full border p-2 rounded text-sm"
                                    />

                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const formData = new FormData();
                                                formData.append('file', file);

                                                try {
                                                    const res = await fetch('/api/upload', {
                                                        method: 'POST',
                                                        body: formData,
                                                    });
                                                    const data = await res.json();
                                                    if (data.success) {
                                                        setEditingProduct({ ...editingProduct, image: data.url });
                                                    } else {
                                                        alert(data.error || 'Error al subir imagen');
                                                    }
                                                } catch (err) {
                                                    alert('Error de conexión al subir imagen');
                                                }
                                            }}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded cursor-pointer text-sm font-semibold transition-colors border border-dashed border-gray-400"
                                        >
                                            📁 Subir desde PC
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700">Descripción</label>
                                <textarea
                                    value={editingProduct.description}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full border p-2 rounded h-24 text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="px-4 py-2 text-gray-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
