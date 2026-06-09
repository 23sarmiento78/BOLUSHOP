import { getAllOrders } from "@/lib/db";
import OrdersTable from "./OrdersTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { Truck, Clock, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    const orders = await getAllOrders();
    const pending = orders.filter((o) => o.status === "pending").length;
    const paid = orders.filter((o) => o.status === "paid").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Pedidos"
                subtitle="Administrá y actualizá el estado de las órdenes"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminStatCard label="Total pedidos" value={orders.length} icon={Truck} />
                <AdminStatCard label="Pendientes" value={pending + paid} icon={Clock} badge={pending > 0 ? <span className="admin-badge admin-badge-warning">{pending} nuevos</span> : undefined} />
                <AdminStatCard label="Entregados" value={delivered} icon={CheckCircle} badge={<span className="admin-badge admin-badge-success">completados</span>} />
            </div>

            <OrdersTable initialOrders={orders} />
        </div>
    );
}
