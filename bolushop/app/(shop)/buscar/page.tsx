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

            <main className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="mb-12">
                        <h1 className="text-5xl font-black mb-4">
                            Resultados para: <span className="text-primary italic">"{query}"</span>
                        </h1>
                        <p className="text-gray-600 text-lg">
                            {results.length} {results.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                        </p>
                    </div>

                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {results.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-9xl mb-6 opacity-20">🔍</div>
                            <h2 className="text-3xl font-black text-gray-400 mb-4">
                                No encontramos resultados
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Probá con otros términos de búsqueda
                            </p>
                            <a
                                href="/productos"
                                className="inline-block px-8 py-4 bg-primary text-white rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-primary/30"
                            >
                                Ver Todos los Productos
                            </a>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
