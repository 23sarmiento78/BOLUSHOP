import Link from 'next/link';
import { getAllProducts } from '@/lib/db';
import ProductsTable from './ProductsTable';

export const dynamic = 'force-dynamic'; // Force dynamic rendering on the server

export default function ProductsManagerPage() {
    // Read directly from DB file - Single Source of Truth
    const products = getAllProducts();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Gestión de Productos</h1>

            <div className="flex justify-end mb-4">
                <Link href="/admin/upload" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                    + Importar Excel/CSV
                </Link>
            </div>

            <ProductsTable initialProducts={products} />
        </div>
    );
}
