import { getAllProducts } from "@/lib/db";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import ProductSorter from "@/components/shop/ProductSorter";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Productos | BoluShop",
    description: "Explorá nuestro catálogo completo de productos con envío a todo Argentina.",
};

interface Props {
    searchParams: Promise<{
        categoria?: string;
        sort?: string;
    }>;
}

export default async function ProductosPage({ searchParams }: Props) {
    const allProducts = await getAllProducts();
    const activeProducts = allProducts.filter(p => p.isActive !== false);

    // Filtering
    const { categoria, sort } = await searchParams;
    let filteredProducts = categoria
        ? activeProducts.filter(p => p.category.toLowerCase() === categoria.toLowerCase())
        : activeProducts;

    // Sorting
    if (sort) {
        filteredProducts = [...filteredProducts].sort((a, b) => {
            switch (sort) {
                case 'price_asc':
                    return a.price - b.price;
                case 'price_desc':
                    return b.price - a.price;
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });
    } else {
        // Default sort: newest
        filteredProducts = [...filteredProducts].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    const categories = Array.from(new Set(activeProducts.map(p => p.category)));

    return (
        <>
            <Header />

            <main className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-12">
                    {/* Header */}
                    <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <h1 className="text-5xl font-black mb-4">
                                {categoria ? categoria : 'Todos los Productos'}
                            </h1>
                            <p className="text-gray-600 text-lg">
                                {filteredProducts.length} productos disponibles
                            </p>
                        </div>

                        {/* Sort Dropdown */}
                        <ProductSorter />
                    </div>

                    {/* Filters */}
                    <div className="mb-8 flex flex-wrap gap-3">
                        <a
                            href={`/productos${sort ? `?sort=${sort}` : ''}`}
                            className={`px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all ${!categoria
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Todos
                        </a>
                        {categories.map((cat) => (
                            <a
                                key={cat}
                                href={`/productos?categoria=${encodeURIComponent(cat)}${sort ? `&sort=${sort}` : ''}`}
                                className={`px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all ${categoria === cat
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {cat}
                            </a>
                        ))}
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-8xl mb-6 opacity-20">🔍</div>
                            <h2 className="text-2xl font-black text-gray-400 mb-2">
                                No se encontraron productos
                            </h2>
                            <p className="text-gray-500">Probá con otra categoría</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
