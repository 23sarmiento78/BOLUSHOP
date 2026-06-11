import { getAllCollections, getAllProducts } from "@/lib/db";
import CollectionsClient from "./CollectionsClient";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
    const collections = await getAllCollections();
    const products = await getAllProducts();

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Colecciones"
                subtitle="Agrupá productos para landings temáticas o generá ofertas automáticas con IA"
            />
            <CollectionsClient initialCollections={collections} initialProducts={products} />
        </div>
    );
}
