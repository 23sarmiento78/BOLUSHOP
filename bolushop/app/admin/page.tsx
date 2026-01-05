import Link from "next/link";
import { getAllProducts, getAllOrders } from "@/lib/db";

export default async function AdminDashboard() {
    const products = await getAllProducts();
    const orders = await getAllOrders();
    const lowStockProducts = products.filter((p) => p.stock < 5);

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-black mb-8">Panel de Administración</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Stat Cards */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-2">Total Productos</p>
                    <p className="text-4xl font-black text-primary">{products.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-2">Total Órdenes</p>
                    <p className="text-4xl font-black text-blue-500">{orders.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-2">Stock Bajo</p>
                    <p className="text-4xl font-black text-yellow-500">{lowStockProducts.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-2">Ingresos (Est.)</p>
                    <p className="text-2xl font-black text-green-500">
                        ${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString('es-AR')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        ⚡ Acciones Rápidas
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/products" className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-primary hover:shadow-lg transition-all group text-center">
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📦</div>
                            <span className="font-bold text-gray-700">Gestionar Productos</span>
                        </Link>
                        <Link href="/admin/orders" className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all group text-center">
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🚚</div>
                            <span className="font-bold text-gray-700">Gestionar Órdenes</span>
                        </Link>
                        <Link href="/admin/collections" className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-purple-500 hover:shadow-lg transition-all group text-center">
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">✨</div>
                            <span className="font-bold text-gray-700">Colecciones</span>
                        </Link>
                        <Link href="/admin/settings" className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-gray-500 hover:shadow-lg transition-all group text-center">
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
                            <span className="font-bold text-gray-700">Configuración</span>
                        </Link>
                        <Link href="/admin/newsletter" className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-pink-500 hover:shadow-lg transition-all group text-center">
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📧</div>
                            <span className="font-bold text-gray-700">Email Marketing</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 className="text-xl font-bold mb-4">🔔 Alertas de Stock</h2>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        {lowStockProducts.length > 0 ? (
                            <ul className="space-y-4">
                                {lowStockProducts.slice(0, 5).map(p => (
                                    <li key={p.id} className="flex justify-between items-center text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                        <span className="font-medium text-gray-700 truncate max-w-[200px]">{p.name}</span>
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                                            Quedan {p.stock}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-center py-4">Todo en orden ✅</p>
                        )}
                        {lowStockProducts.length > 5 && (
                            <div className="mt-4 text-center">
                                <Link href="/admin/products" className="text-primary text-sm font-bold hover:underline">
                                    Ver todos ({lowStockProducts.length})
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
