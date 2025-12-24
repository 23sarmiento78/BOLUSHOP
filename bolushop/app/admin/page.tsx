import { getAllOrders, getAllProducts } from '@/lib/db';
import Link from 'next/link';

export default function AdminPage() {
    const products = getAllProducts();
    const orders = getAllOrders();
    const totalSales = orders
        .filter(o => o.status === 'paid' || o.status === 'shipped')
        .reduce((sum, o) => sum + o.total, 0);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Panel de Administración</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Ventas Totales</h3>
                    <p className="text-3xl font-bold text-gray-900">${totalSales.toLocaleString('es-AR')}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Pedidos</h3>
                    <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-100">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Productos Activos</h3>
                    <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Actions */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Gestión de Catálogo</h2>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-600 mb-6">Subí tu Excel de Dropers acá para actualizar precios y stock automáticamente.</p>

                        <Link href="/admin/upload" className="block w-full bg-primary text-white text-center font-bold py-3 rounded-lg hover:bg-emerald-600 transition-colors">
                            📤 Subir Excel de Productos
                        </Link>

                        <div className="mt-4 border-t pt-4">
                            <Link href="/admin/products" className="text-primary hover:underline text-sm font-semibold">
                                Ver listado completo de productos &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Últimos Pedidos</h2>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        {orders.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">No hay pedidos recientes.</p>
                        ) : (
                            <ul className="space-y-3">
                                {orders.slice(0, 5).map(order => (
                                    <li key={order.id} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                                        <div>
                                            <div className="font-bold text-gray-800">#{order.id.slice(0, 8)}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {order.status.toUpperCase()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {orders.length > 0 && (
                            <div className="mt-4 border-t pt-4">
                                <Link href="/admin/orders" className="text-primary hover:underline text-sm font-semibold">
                                    Gestionar Pedidos y Devoluciones &rarr;
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
