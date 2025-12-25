import { getAllProducts } from '@/lib/db'; // Direct DB access for Server Component
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const dynamic = 'force-dynamic';

type Props = {
    searchParams: Promise<{ cat?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { cat } = await searchParams;
    const activeCategoryName = cat ? decodeURIComponent(cat) : 'Todos los Productos';

    return {
        title: activeCategoryName,
        description: `Explorá nuestra selección de ${activeCategoryName.toLowerCase()} en ${SITE_NAME}. Calidad garantizada y envíos gratis.`,
    };
}


export default async function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ cat?: string }>
}) {
    const { cat } = await searchParams;
    const allProducts = getAllProducts();

    // 1. Extract Unique Categories Dynamically
    // We get a Set of category strings
    const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category))).filter(Boolean);

    // Sort them alphabetically
    uniqueCategories.sort();

    // 2. Filter Products based on selection
    let displayProducts = allProducts;
    if (cat) {
        // Decode URI component just in case
        const decodedCat = decodeURIComponent(cat);
        displayProducts = allProducts.filter(p => p.category === decodedCat);
    }

    const activeCategoryName = cat ? decodeURIComponent(cat) : 'Todos los Productos';

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header & Filters */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 capitalize">{activeCategoryName}</h1>

                {/* Simple Filter Pills */}
                <div className="flex flex-wrap gap-2">
                    <Link
                        href="/categorias"
                        className={`px-4 py-2 rounded-full border transition-colors ${!cat ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                    >
                        Todos
                    </Link>
                    {uniqueCategories.map((c) => (
                        <Link
                            key={c}
                            href={`/categorias?cat=${encodeURIComponent(c)}`}
                            className={`px-4 py-2 rounded-full border transition-colors capitalize ${cat === encodeURIComponent(c) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                        >
                            {/* Simple Icon Mapping fallback or just text */}
                            🏷️ {c.toLowerCase()}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {displayProducts.length > 0 ? (
                    displayProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-gray-500">
                        No encontramos productos en esta categoría por ahora. 🧉
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper needed because lib/db exports getAllProducts as getAllProducts, but imports above use getProducts.
// Checking lib/db.ts content from previous turns: it exports `getAllProducts`.
// I will fix the import to match lib/db.ts
