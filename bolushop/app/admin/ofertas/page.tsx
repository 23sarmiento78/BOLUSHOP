import { getAllCollections, getAllProducts } from "@/lib/db";
import OfertasClient from "./OfertasClient";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function OfertasAdminPage() {
    const collections = await getAllCollections();
    const products = await getAllProducts();

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Ofertas y descuentos"
                subtitle="Creá promociones temáticas manualmente o generá ofertas automáticas con IA"
            />
            <OfertasClient initialCollections={collections} initialProducts={products} />
        </div>
    );
}
