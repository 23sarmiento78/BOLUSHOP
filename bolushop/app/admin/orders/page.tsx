import { getAllOrders } from "@/lib/db";
import OrdersTable from "./OrdersTable";

export default async function AdminOrdersPage() {
    const orders = await getAllOrders();

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black mb-2">Gestión de Órdenes</h1>
                    <p className="text-gray-500">Administrá y actualizá el estado de los pedidos.</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-gray-900">{orders.length}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Órdenes</p>
                </div>
            </div>

            <OrdersTable initialOrders={orders} />
        </div>
    );
}
