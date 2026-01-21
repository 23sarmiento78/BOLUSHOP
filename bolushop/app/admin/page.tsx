import Link from "next/link";
import Image from "next/image";
import { getAllProducts, getAllOrders, saveCategories } from "@/lib/db";

export const dynamic = "force-dynamic";
import fs from 'fs';
import path from 'path';
import {
    Package,
    ShoppingCart,
    AlertTriangle,
    TrendingUp,
    ArrowRight,
    Search,
    PlusCircle,
    Settings,
    Mail,
    Tags,
    Truck
} from 'lucide-react';

export default async function AdminDashboard() {
    const products = await getAllProducts();
    const orders = await getAllOrders();

    // Force fix for category images
    try {
        const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');
        if (fs.existsSync(categoriesPath)) {
            const localCategories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
            await saveCategories(localCategories);
        }
    } catch (e) {
        console.error("Error syncing categories:", e);
    }

    const lowStockProducts = products.filter((p) => p.stock < 5);
    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 leading-none">
                        Dashboard <span className="text-primary/20">Overview</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
                        Bienvenido al centro de control de BoluShop
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/products" className="bg-primary text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
                        <PlusCircle size={16} /> Nuevo Producto
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <Package size={80} />
                    </div>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-4">Total Productos</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold text-gray-900">{products.length}</p>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">Activos</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <ShoppingCart size={80} />
                    </div>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-4">Órdenes Totales</p>
                    <p className="text-4xl font-bold text-gray-900">{orders.length}</p>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <AlertTriangle size={80} />
                    </div>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-4">Stock Crítico</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold text-rose-500">{lowStockProducts.length}</p>
                        <span className="text-[10px] font-bold uppercase text-rose-400 bg-rose-50 px-2 py-0.5 rounded-full">Atención</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp size={80} className="text-primary" />
                    </div>
                    <p className="text-primary font-bold uppercase text-[10px] tracking-widest mb-4">Ventas Brutas</p>
                    <p className="text-3xl font-bold text-white">
                        ${totalRevenue.toLocaleString('es-AR')}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">Pesos Argentinos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Actions */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center text-sm">⚡</span>
                        Accesos Directos
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { href: "/admin/products", label: "Gestión Productos", icon: Package, color: "text-amber-500", bg: "bg-amber-50" },
                            { href: "/admin/orders", label: "Ver Pedidos", icon: Truck, color: "text-blue-500", bg: "bg-blue-50" },
                            { href: "/admin/collections", label: "Colecciones", icon: Tags, color: "text-purple-500", bg: "bg-purple-50" },
                            { href: "/admin/newsletter", label: "Marketing", icon: Mail, color: "text-pink-500", bg: "bg-pink-50" },
                            { href: "/admin/settings", label: "Configuración", icon: Settings, color: "text-slate-500", bg: "bg-slate-50" },
                        ].map((action) => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="group bg-white p-6 rounded-3xl border-2 border-transparent hover:border-gray-100 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className={`w-14 h-14 ${action.bg} ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <action.icon size={28} />
                                </div>
                                <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{action.label}</p>
                                <div className="mt-4 flex items-center gap-2 text-gray-300 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    Abrir Módulo <ArrowRight size={12} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Stock List */}
                <div>
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center text-sm">🚨</span>
                        Alertas
                    </h2>
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                        {lowStockProducts.length > 0 ? (
                            <div className="space-y-6">
                                {lowStockProducts.slice(0, 4).map(p => (
                                    <div key={p.id} className="group flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4 truncate">
                                            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                                <Image src={p.image || "/icon.png"} alt={p.name} fill className="object-cover" />
                                            </div>
                                            <div className="truncate">
                                                <p className="font-bold text-gray-900 truncate">{p.name}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Solo {p.stock} unidades</p>
                                            </div>
                                        </div>
                                        <Link href={`/admin/products?search=${p.id}`} className="p-2 bg-gray-100 rounded-lg text-gray-400 hover:bg-primary hover:text-white transition-all">
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                ))}
                                {lowStockProducts.length > 4 && (
                                    <Link href="/admin/products" className="block text-center pt-4 border-t border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
                                        Ver todos los repuestos ({lowStockProducts.length})
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20 grayscale opacity-30">
                                <Search size={40} className="mx-auto mb-4" />
                                <p className="text-xs font-black uppercase tracking-[0.2em]">Todo excelente</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
