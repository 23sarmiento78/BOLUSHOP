"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { saveProducts } from "@/lib/db";
import { toast } from "sonner";
import { Globe, Plus, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";

interface Props {
    initialProducts: Product[];
}

export default function InternacionalClient({ initialProducts }: Props) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isAdding, setIsAdding] = useState(false);

    // CJ Importer State
    const [formData, setFormData] = useState({
        name: "",
        cjSku: "",
        category: "Internacional",
        usdPrice: 0,
        shippingUsd: 0,
        exchangeRate: 1100, // Estimated ARS
        margin: 1.5, // 50% profit
        image: "",
        description: ""
    });

    const calculateFinalPrice = () => {
        const totalUsd = Number(formData.usdPrice) + Number(formData.shippingUsd);
        return Math.ceil(totalUsd * formData.exchangeRate * formData.margin);
    };

    const handleCjSync = async () => {
        if (!formData.cjSku) {
            toast.error("Ingresá un SKU de CJ primero");
            return;
        }

        const toastId = toast.loading("Buscando producto en CJ...");

        try {
            const res = await fetch(`/api/admin/cj/sync?sku=${formData.cjSku}`);
            const data = await res.json();

            if (res.ok && data) {
                setFormData({
                    ...formData,
                    name: data.productNameEn || data.productName || formData.name,
                    image: data.productImage || formData.image,
                    description: data.description || formData.description,
                    usdPrice: data.lowPrice || formData.usdPrice,
                    shippingUsd: data.shippingEstimate?.shippingFee || formData.shippingUsd
                });
                toast.success("¡Datos sincronizados! Precio y envío actualizados.", { id: toastId });
            } else {
                toast.error(data.error || "No se encontró el producto", { id: toastId });
            }
        } catch (error) {
            toast.error("Error de conexión", { id: toastId });
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct: Product = {
            id: crypto.randomUUID(),
            name: formData.name,
            slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            price: calculateFinalPrice(),
            cost: (Number(formData.usdPrice) + Number(formData.shippingUsd)) * formData.exchangeRate,
            image: formData.image,
            images: [formData.image],
            category: formData.category,
            categoryId: "internacional",
            description: formData.description,
            features: ["Compra Internacional 🌏", "Envío Directo", "Calidad Garantizada"],
            stock: 99,
            createdAt: new Date().toISOString(),
            isActive: true,
            isInternational: true,
            cjSku: formData.cjSku,
            usdPrice: formData.usdPrice,
            shippingUsd: formData.shippingUsd
        };

        try {
            const updated = [...products, newProduct];
            // We need to save to all products but filter for view
            // In a real app we'd fetch all, add, and save all
            // For now, let's assume we need to get ALL first
            const res = await fetch('/api/products');
            const allProducts: Product[] = await res.json();
            const allUpdated = [...allProducts, newProduct];

            const saveRes = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    products: allUpdated,
                    source: 'manual'
                })
            });

            if (saveRes.ok) {
                setProducts(updated);
                setIsAdding(false);
                toast.success("Producto Internacional agregado!");
            }
        } catch (error) {
            toast.error("Error al guardar");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                >
                    {isAdding ? <Plus className="rotate-45" /> : <Plus />}
                    {isAdding ? "Cancelar" : "Importar de CJ Dropshipping"}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAdd} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6 animate-in slide-in-from-top duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nombre del Producto</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-gray-50 border-transparent focus:border-blue-500 rounded-xl p-3 outline-none"
                                placeholder="Ej: Smartwatch Pro CJ"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">SKU CJ Dropshipping</label>
                            <div className="flex gap-2">
                                <input
                                    required
                                    value={formData.cjSku}
                                    onChange={e => setFormData({ ...formData, cjSku: e.target.value })}
                                    className="flex-1 bg-gray-50 border-transparent focus:border-blue-500 rounded-xl p-3 outline-none"
                                    placeholder="CJXXXXX-XXXXX"
                                />
                                <button
                                    type="button"
                                    onClick={handleCjSync}
                                    className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition-colors"
                                    title="Sincronizar datos de CJ"
                                >
                                    ✨
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">URL Imagen (Directa)</label>
                            <input
                                required
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                className="w-full bg-gray-50 border-transparent focus:border-blue-500 rounded-xl p-3 outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Precio Producto (USD)</label>
                            <input
                                type="number" step="0.01" required
                                value={formData.usdPrice}
                                onChange={e => setFormData({ ...formData, usdPrice: Number(e.target.value) })}
                                className="w-full bg-gray-50 border-transparent focus:border-blue-500 rounded-xl p-3 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Envío CJ (USD)</label>
                            <input
                                type="number" step="0.01" required
                                value={formData.shippingUsd}
                                onChange={e => setFormData({ ...formData, shippingUsd: Number(e.target.value) })}
                                className="w-full bg-gray-50 border-transparent focus:border-blue-500 rounded-xl p-3 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Dólar Blue/Tarjeta (ARS)</label>
                            <input
                                type="number" required
                                value={formData.exchangeRate}
                                onChange={e => setFormData({ ...formData, exchangeRate: Number(e.target.value) })}
                                className="w-full bg-gray-50 border-transparent focus:border-blue-500 rounded-xl p-3 outline-none"
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 font-black text-sm uppercase">Precio Final Calculado</p>
                                <p className="text-3xl font-black text-blue-900">${calculateFinalPrice().toLocaleString()}</p>
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all">
                                Guardar Producto Internacional
                            </button>
                        </div>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(p => (
                    <div key={p.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className="relative aspect-square">
                            <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-lg px-4 py-2 rounded-full flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase text-blue-600">CJ SKU: {p.cjSku}</span>
                            </div>
                        </div>
                        <div className="p-8">
                            <h3 className="text-xl font-black text-gray-900 mb-2 truncate">{p.name}</h3>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Costo Total</p>
                                    <p className="font-bold text-gray-600">USD {((p.usdPrice || 0) + (p.shippingUsd || 0)).toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Precio Venta</p>
                                    <p className="text-2xl font-black text-gray-900">${p.price.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                                    <ExternalLink size={16} /> Ver en CJ
                                </button>
                                <button className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
