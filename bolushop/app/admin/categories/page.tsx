import { getAllCategories } from "@/lib/db";
import CategoriesClient from "@/app/admin/categories/CategoriesClient";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
    const categories = await getAllCategories();

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Categorías"
                subtitle="Organizá el catálogo por secciones"
            />
            <CategoriesClient initialCategories={categories} />
        </div>
    );
}
