import React from 'react';
import { getAllCategories } from "@/lib/db";
import CategoriesClient from "@/app/admin/categories/CategoriesClient";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const categories = await getAllCategories();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Gestión de Categorías</h1>
            <CategoriesClient initialCategories={categories} />
        </div>
    );
}
