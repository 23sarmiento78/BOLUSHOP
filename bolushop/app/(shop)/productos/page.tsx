import { getAllProducts } from "@/lib/db";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import ProductSorter from "@/components/shop/ProductSorter";
import Link from "next/link";
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

            <main className="min-h-screen bg-sand-white pt-32 pb-24">
                <div className="container mx-auto px-4">
                    {/* Page Header */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-primary"></div>
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Catálogo Exclusivo</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter text-gray-900">
                            {categoria ? (
                                <>Colección <span className="text-primary italic">{categoria}</span></>
                            ) : 'Nuestra Tienda'}
                        </h1>
                        <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                            Descubrí una selección curada de productos diseñados para elevar tu estilo de vida. Calidad garantizada en cada detalle.
                        </p>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 pb-12 border-b border-gray-100">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <a
                                href={`/productos${sort ? `?sort=${sort}` : ''}`}
                                className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${!categoria
                                    ? 'bg-gray-900 text-white shadow-2xl shadow-gray-900/20'
                                    : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-100'
                                    }`}
                            >
                                Todos
                            </a>
                            {categories.map((cat) => (
                                <a
                                    key={cat}
                                    href={`/productos?categoria=${encodeURIComponent(cat)}${sort ? `&sort=${sort}` : ''}`}
                                    className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${categoria === cat
                                        ? 'bg-gray-900 text-white shadow-2xl shadow-gray-900/20'
                                        : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-100'
                                        }`}
                                >
                                    {cat}
                                </a>
                            ))}
                        </div>

                        {/* Stats & Sort */}
                        <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-6 lg:pt-0">
                            <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                                {filteredProducts.length} <span className="ml-1">Resultados</span>
                            </div>
                            <ProductSorter />
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 rounded-[3rem] border-2 border-dashed border-gray-100">
                            <div className="text-6xl mb-6">🔍</div>
                            <h2 className="text-2xl font-black text-gray-900 mb-4">
                                No encontramos lo que buscás
                            </h2>
                            <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">
                                Intentá con otra categoría o restablecé los filtros para ver todos nuestros productos.
                            </p>
                            <Link
                                href="/productos"
                                className="inline-block px-10 py-4 bg-primary text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                            >
                                Ver Todo el Catálogo
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
