import { getAllOrders, getAllProducts } from '@/lib/db';
import Link from 'next/link';

export default function AdminPage() {
    const products = getAllProducts();
    const orders = getAllOrders();

    // Stats calculation
    const paidOrders = orders.filter(o => o.status === 'paid' || o.status === 'shipped');
    const totalSales = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const lowStockProducts = products.filter(p => p.stock !== undefined && p.stock <= 5);

    // Analytics: Sales by day (Last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const salesData = last7Days.map(day => {
        const dayTotal = paidOrders
            .filter(o => o.date.startsWith(day))
            .reduce((sum, o) => sum + o.total, 0);
        return { day: day.split('-').slice(1).reverse().join('/'), amount: dayTotal };
    });

    const maxAmount = Math.max(...salesData.map(d => d.amount), 1000);

    const stats = [
        { title: 'Ventas Totales', value: `$${totalSales.toLocaleString('es-AR')}`, icon: '💰', color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
        { title: 'Pedidos Totales', value: orders.length, icon: '🛒', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
        { title: 'Pendientes', value: pendingOrders, icon: '⏳', color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
        { title: 'Stock Bajo', value: lowStockProducts.length, icon: '⚠️', color: 'bg-red-50 text-red-600', border: 'border-red-100' },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Comando Central</h1>
                    <p className="text-gray-500 font-medium">Control total de tu ecosistema BoluShop.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Sistema Online</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className={`bg-white p-7 rounded-[2.5rem] shadow-sm border ${stat.border} hover:shadow-xl transition-all group`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className={`p-4 rounded-2xl ${stat.color} font-bold text-2xl group-hover:scale-110 transition-transform`}>{stat.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Resumen</span>
                        </div>
                        <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.title}</h3>
                        <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Chart Section */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                            <span className="w-2 h-8 bg-primary rounded-full"></span>
                            Rendimiento de Ventas
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Últimos 7 días</span>
                    </div>

                    <div className="flex-grow flex items-end justify-between gap-4 h-64 px-4">
                        {salesData.map((data, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group relative">
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl z-10 whitespace-nowrap">
                                    ${data.amount.toLocaleString()}
                                </div>
                                <div
                                    style={{ height: `${(data.amount / maxAmount) * 100}%` }}
                                    className={`w-full max-w-[40px] rounded-t-2xl transition-all duration-1000 ${data.amount > 0 ? 'bg-primary' : 'bg-gray-100'} group-hover:brightness-110 group-hover:shadow-lg group-hover:shadow-primary/20`}
                                />
                                <div className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-tighter">{data.day}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vertical Sidebar on Dashboard */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                        <span className="w-2 h-8 bg-orange-400 rounded-full"></span>
                        Alertas Críticas
                    </h2>

                    {lowStockProducts.length > 0 ? (
                        <div className="space-y-3">
                            {lowStockProducts.slice(0, 3).map(p => (
                                <div key={p.id} className="bg-red-50 p-5 rounded-3xl border border-red-100 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">⚠️</div>
                                    <div>
                                        <div className="text-xs font-black text-red-900 line-clamp-1">{p.name}</div>
                                        <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Quedan {p.stock} unidades</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-green-50 p-8 rounded-[2rem] border border-green-100 text-center">
                            <span className="text-4xl block mb-4">✅</span>
                            <p className="text-xs font-black text-green-700 uppercase tracking-widest">Stock en niveles óptimos</p>
                        </div>
                    )}

                    <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Acceso Rápido</div>
                            <h3 className="text-2xl font-black mb-6">Gestionar Colecciones</h3>
                            <Link href="/admin/collections" className="inline-block bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
                                Abrir Panel →
                            </Link>
                        </div>
                        <div className="absolute -right-6 -bottom-6 text-8xl opacity-10 group-hover:scale-110 transition-transform">🏷️</div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                        <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                        Últimos Movimientos
                    </h2>
                    <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Ver Historial Completo</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="pb-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Pedido</th>
                                <th className="pb-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Cliente</th>
                                <th className="pb-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</th>
                                <th className="pb-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.slice(0, 5).map(order => (
                                <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="py-5">
                                        <div className="font-black text-gray-900 text-sm">#{order.id.slice(0, 8).toUpperCase()}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{new Date(order.date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="py-5 font-bold text-gray-800 text-sm">{order.payer?.name || 'Cliente'}</td>
                                    <td className="py-5">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm
                                            ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                                order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}
                                        `}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-5 text-right font-black text-gray-900">${order.total.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
