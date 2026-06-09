import Link from "next/link";
import { getAllProducts } from "@/lib/db";
import ProductsTable from "./ProductsTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { Plus, Download, Package, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsManagerPage() {
    const products = await getAllProducts();
    const categories = new Set(products.map((p) => p.category)).size;
    const inStock = products.filter((p) => p.stock > 0).length;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Productos"
                subtitle="Administrá el inventario de tu tienda"
                actions={
                    <>
                        <Link href="/admin/upload" className="admin-btn admin-btn-ghost">
                            <Download size={15} /> Importar
                        </Link>
                        <span className="admin-btn admin-btn-primary cursor-default opacity-80">
                            <Plus size={15} /> Crear desde tabla
                        </span>
                    </>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminStatCard label="Total SKUs" value={products.length} icon={Package} />
                <AdminStatCard label="Categorías" value={categories} icon={Filter} />
                <AdminStatCard label="En stock" value={inStock} badge={<span className="admin-badge admin-badge-success">activos</span>} />
            </div>

            <div className="admin-card !p-0 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#e2e8f0] bg-[#f8f9fb] flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#0a1628]">Listado completo</h3>
                    <span className="text-xs text-[#94a3b8]">{products.length} productos</span>
                </div>
                <div className="p-4 md:p-6">
                    <ProductsTable initialProducts={products} />
                </div>
            </div>
        </div>
    );
}
