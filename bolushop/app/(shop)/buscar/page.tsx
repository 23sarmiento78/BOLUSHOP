import { searchProducts } from "@/app/actions/shop";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Buscar Productos | BoluShop",
    description: "Encontrá los productos que buscás en BoluShop",
};

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export default async function BuscarPage({ searchParams }: Props) {
    const params = await searchParams;
    const query = params.q || "";
    const results = query ? await searchProducts(query) : [];

    return (
        <>
            <Header />

            <main className="min-h-screen bg-sand-white pt-32 pb-24">
                <div className="container mx-auto px-4">
                    {/* Search Header */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-primary"></div>
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Resultados de Búsqueda</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter text-gray-900">
                            Buscaste: <span className="text-primary italic">"{query}"</span>
                        </h1>
                        <div className="flex items-center gap-4 text-gray-400 text-sm font-black uppercase tracking-widest">
                            {results.length} <span>Coincidencias encontradas</span>
                        </div>
                    </div>

                    {/* Results Grid */}
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {results.map((product) => (
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
                                No hay productos que coincidan con "{query}". Intentá con otros términos o explorá el catálogo completo.
                            </p>
                            <a
                                href="/productos"
                                className="inline-block px-10 py-4 bg-primary text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-primary/20"
                            >
                                Ver Todo el Catálogo
                            </a>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
