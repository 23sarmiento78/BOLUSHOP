import Link from "next/link";
import Image from "next/image";
import { getAllProducts, getAllOrders, saveCategories } from "@/lib/db";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import fs from "fs";
import path from "path";
import {
    Package,
    ShoppingCart,
    AlertTriangle,
    TrendingUp,
    ArrowRight,
    PlusCircle,
    Settings,
    Mail,
    Tags,
    Truck,
    FileText,
    FolderTree,
    Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const products = await getAllProducts();
    const orders = await getAllOrders();

    try {
        const categoriesPath = path.join(process.cwd(), "data", "categories.json");
        if (fs.existsSync(categoriesPath)) {
            const rawCategories = fs.readFileSync(categoriesPath, "utf-8").trim();
            if (rawCategories) {
                await saveCategories(JSON.parse(rawCategories));
            }
        }
    } catch (e) {
        console.error("Error syncing categories:", e);
    }

    const lowStockProducts = products.filter((p) => p.stock < 5);
    const activeProducts = products.filter((p) => p.isActive !== false);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const monthlyOrders = orders.filter((o) => {
        const d = new Date(o.date);
        return d >= monthStart && d < nextMonthStart;
    });

    const totalRevenue = orders
        .filter((o) => ["paid", "shipped", "delivered"].includes(o.status))
        .filter((o) => {
            const d = new Date(o.date);
            return d >= monthStart && d < nextMonthStart;
        })
        .reduce((acc, o) => acc + o.total, 0);

    const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "paid").length;

    const quickActions = [
        { href: "/admin/products", label: "Productos", desc: "Gestionar inventario", icon: Package, color: "bg-orange-50 text-orange-500" },
        { href: "/admin/orders", label: "Pedidos", desc: "Ver y actualizar", icon: Truck, color: "bg-blue-50 text-blue-500" },
        { href: "/admin/collections", label: "Colecciones", desc: "Landings temáticas", icon: Tags, color: "bg-purple-50 text-purple-500" },
        { href: "/admin/blog", label: "Blog", desc: "Artículos y SEO", icon: FileText, color: "bg-emerald-50 text-emerald-500" },
        { href: "/admin/categories", label: "Categorías", desc: "Organizar catálogo", icon: FolderTree, color: "bg-cyan-50 text-cyan-600" },
        { href: "/admin/newsletter", label: "Newsletter", desc: "Campañas email", icon: Mail, color: "bg-pink-50 text-pink-500" },
        { href: "/admin/mercado-libre", label: "Mercado Libre", desc: "Afiliados ML", icon: Layers, color: "bg-yellow-50 text-yellow-600" },
        { href: "/admin/settings", label: "Configuración", desc: "Precios y envíos", icon: Settings, color: "bg-slate-50 text-slate-500" },
    ];

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Dashboard"
                subtitle="Resumen de tu tienda BoluShop"
                actions={
                    <Link href="/admin/products" className="admin-btn admin-btn-primary">
                        <PlusCircle size={16} />
                        Nuevo producto
                    </Link>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <AdminStatCard
                    label="Productos activos"
                    value={activeProducts.length}
                    icon={Package}
                    badge={<span className="admin-badge admin-badge-success">de {products.length}</span>}
                />
                <AdminStatCard
                    label="Pedidos del mes"
                    value={monthlyOrders.length}
                    icon={ShoppingCart}
                    badge={pendingOrders > 0 ? <span className="admin-badge admin-badge-warning">{pendingOrders} pendientes</span> : undefined}
                />
                <AdminStatCard
                    label="Stock crítico"
                    value={lowStockProducts.length}
                    icon={AlertTriangle}
                    badge={lowStockProducts.length > 0 ? <span className="admin-badge admin-badge-danger">Atención</span> : <span className="admin-badge admin-badge-success">OK</span>}
                />
                <AdminStatCard
                    label="Ventas del mes"
                    value={`$${totalRevenue.toLocaleString("es-AR")}`}
                    icon={TrendingUp}
                    accent
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Accesos rápidos */}
                <div className="lg:col-span-2">
                    <h3 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider mb-4">Accesos rápidos</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link key={action.href + action.label} href={action.href} className="admin-action-tile">
                                    <div className={`admin-action-icon ${action.color}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#0a1628]">{action.label}</p>
                                        <p className="text-[11px] text-[#94a3b8]">{action.desc}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Alertas stock */}
                <div>
                    <h3 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider mb-4">Alertas de stock</h3>
                    <div className="admin-card">
                        {lowStockProducts.length > 0 ? (
                            <div className="space-y-3">
                                {lowStockProducts.slice(0, 5).map((p) => (
                                    <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f8f9fb] transition-colors group">
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#f0f1f5] shrink-0">
                                            <Image src={p.image || "/icon.png"} alt={p.name} fill className="object-cover" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-[#0a1628] truncate">{p.name}</p>
                                            <p className="text-[11px] text-red-500 font-medium">{p.stock} unidades</p>
                                        </div>
                                        <Link
                                            href="/admin/products"
                                            className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#0a1628] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                ))}
                                {lowStockProducts.length > 5 && (
                                    <Link href="/admin/products" className="block text-center text-xs font-semibold text-[#ff6b35] pt-3 border-t border-[#e2e8f0]">
                                        Ver todos ({lowStockProducts.length})
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-[#94a3b8]">
                                <Package size={32} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm font-medium">Stock en orden</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pedidos recientes */}
            {orders.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Últimos pedidos</h3>
                        <Link href="/admin/orders" className="text-xs font-semibold text-[#ff6b35] hover:underline flex items-center gap-1">
                            Ver todos <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="admin-card overflow-hidden !p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb]">
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b]">Cliente</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] hidden sm:table-cell">Fecha</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b]">Total</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b]">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map((order) => (
                                        <tr key={order.id} className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#fafbfc]">
                                            <td className="px-4 py-3 font-medium text-[#0a1628]">{order.payer.name}</td>
                                            <td className="px-4 py-3 text-[#64748b] hidden sm:table-cell">
                                                {new Date(order.date).toLocaleDateString("es-AR")}
                                            </td>
                                            <td className="px-4 py-3 font-semibold">${order.total.toLocaleString("es-AR")}</td>
                                            <td className="px-4 py-3">
                                                <span className={`admin-badge ${
                                                    order.status === "delivered" ? "admin-badge-success" :
                                                    order.status === "cancelled" ? "admin-badge-danger" :
                                                    order.status === "pending" ? "admin-badge-warning" : "admin-badge-info"
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
