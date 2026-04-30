import { getAllProducts } from "@/lib/db";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import ProductSorter from "@/components/shop/ProductSorter";
import HolidayBanner from "@/components/shop/HolidayBanner";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentHoliday } from "@/lib/holidays";


export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { categoria, coleccion } = await searchParams;
    let title = "Catálogo de Productos | BoluShop Argentina";

    if (categoria) {
        title = `${categoria} | Productos BoluShop Argentina`;
    } else if (coleccion) {
        title = `Colección ${coleccion} | BoluShop Argentina`;
    }

    return {
        title,
        description: "Explorá nuestro catálogo completo en Argentina. Envíos gratis a todo el país, cuotas sin interés y la mejor calidad en productos seleccionados.",
        keywords: "comprar productos online argentina, catalogo bolushop, ofertas marketplace argentina, envios gratis",
    };
}

interface Props {
    searchParams: Promise<{
        categoria?: string;
        coleccion?: string;
        seccion?: string;
        sort?: string;
    }>;
}

export default async function ProductosPage({ searchParams }: Props) {
    const allProducts = await getAllProducts();
    const activeProducts = allProducts.filter(p => p.isActive !== false);
    const holiday = getCurrentHoliday();

    // Filtering
    const { categoria, coleccion, seccion, sort } = await searchParams;

    // Logic: ML products ONLY appear if specific section is active
    // Normal products appear otherwise
    let filteredProducts = activeProducts;

    if (seccion === 'mercado-libre') {
        filteredProducts = filteredProducts.filter(p => p.isMlReferral);
    } else {
        filteredProducts = filteredProducts.filter(p => !p.isMlReferral);
    }

    let activeCollectionName = "";

    if (categoria) {
        filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === categoria.toLowerCase());
        activeCollectionName = categoria;
    } else if (coleccion) {
        // Mejoramos el filtrado por colección: Buscamos la colección para obtener sus productos vinculados
        const collections = await (await import("@/lib/db")).getAllCollections();
        const foundColl = collections.find(c => c.id === coleccion || c.slug === coleccion);

        if (foundColl) {
            activeCollectionName = foundColl.name;
            const collProductIds = foundColl.productIds || [];
            filteredProducts = filteredProducts.filter(p =>
                collProductIds.includes(p.id) ||
                (p.collections && (p.collections.includes(foundColl.id) || p.collections.includes(foundColl.slug)))
            );
        } else {
            // Fallback si no se encuentra la colección
            filteredProducts = filteredProducts.filter(p => p.collections && p.collections.includes(coleccion));
        }
    }

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

    const currentSubset = seccion === 'mercado-libre' ? activeProducts.filter(p => p.isMlReferral) : activeProducts.filter(p => !p.isMlReferral);
    const categories = Array.from(new Set(currentSubset.map(p => p.category)));

    const displayTitle = seccion === 'mercado-libre'
        ? 'Imperdibles Mercado Libre'
        : (activeCollectionName ? `Colección ${activeCollectionName}` : 'Nuestra Tienda');

    const displaySubtitle = seccion === 'mercado-libre'
        ? 'Seleccionamos lo mejor de ML para que compres con la confianza de BoluShop.'
        : (holiday ? `Celebrá ${holiday.label} con nuestra selección exclusiva.` : 'Descubrí una selección curada de productos únicos.');

    return (
        <>
            <Header />

            {/* Holiday Banner */}
            <HolidayBanner />

            <main className="min-h-screen bg-sand-white pt-32 pb-24">
                <div className="container mx-auto px-4">
                    {/* Page Header */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-primary"></div>
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">
                                {seccion === 'mercado-libre' ? 'Selección Especial' : 'Catálogo Exclusivo'}
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter text-gray-900">
                            {displayTitle}
                        </h1>
                        <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                            {displaySubtitle}
                        </p>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 pb-12 border-b border-gray-100">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            {/* Standard Catalog Tab */}
                            <a
                                href={`/productos${sort ? `?sort=${sort}` : ''}`}
                                className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${!seccion && !categoria
                                    ? 'text-white shadow-2xl'
                                    : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-100'
                                    }`}
                                style={!seccion && !categoria && holiday ? {
                                    backgroundColor: holiday.colors.primary,
                                    boxShadow: `0 20px 30px -10px ${holiday.colors.primary}40`
                                } : !seccion && !categoria ? {
                                    backgroundColor: '#0F172A',
                                    boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.2)'
                                } : {}}
                            >
                                Tienda Local
                            </a>

                            {/* ML Catalog Tab */}
                            <a
                                href={`/productos?seccion=mercado-libre${sort ? `&sort=${sort}` : ''}`}
                                className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${seccion === 'mercado-libre' && !categoria
                                    ? 'text-white shadow-2xl'
                                    : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-100'
                                    }`}
                                style={seccion === 'mercado-libre' && !categoria ? {
                                    backgroundColor: '#3483FA', // ML Blue
                                    boxShadow: '0 20px 30px -10px rgba(52, 131, 250, 0.3)'
                                } : {}}
                            >
                                Imperdibles ML 🚀
                            </a>

                            <div className="w-px h-10 bg-gray-100 mx-2 hidden md:block" />

                            {categories.map((cat) => (
                                <a
                                    key={cat}
                                    href={`/productos?categoria=${encodeURIComponent(cat)}${seccion ? `&seccion=${seccion}` : ''}${sort ? `&sort=${sort}` : ''}`}
                                    className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${categoria === cat
                                        ? 'text-white shadow-2xl'
                                        : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-100'
                                        }`}
                                    style={categoria === cat && holiday ? {
                                        backgroundColor: holiday.colors.primary,
                                        boxShadow: `0 20px 30px -10px ${holiday.colors.primary}40`
                                    } : categoria === cat ? {
                                        backgroundColor: '#0F172A',
                                        boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.2)'
                                    } : {}}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
