import { getAllProducts } from "@/lib/db";
import { getCurrentHoliday } from "@/lib/holidays";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import ProductSorter from "@/components/shop/ProductSorter";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
    searchParams: Promise<{
        categoria?: string;
        coleccion?: string;
        seccion?: string;
        sort?: string;
        price?: string;
    }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com';
    const { categoria, coleccion } = await searchParams;
    let title = "Productos | BoluShop";
    let description = "Descubrí todos los productos de BoluShop con envío gratis en Argentina y cuotas sin interés. Comprá regalos originales y accesorios para tu hogar.";

    if (categoria) {
        title = `${categoria} | BoluShop`;
        description = `Descubrí productos de ${categoria} en BoluShop con envío gratis a todo el país y cuotas sin interés.`;
    } else if (coleccion) {
        title = `Colección ${coleccion} | BoluShop`;
        description = `Descubrí la colección ${coleccion} en BoluShop con envío gratis a todo el país y cuotas sin interés.`;
    }

    return {
        metadataBase: new URL(siteUrl),
        title,
        description,
        alternates: {
            canonical: `${siteUrl}/productos`,
        },
        openGraph: {
            type: "website",
            locale: "es_AR",
            url: `${siteUrl}/productos`,
            title,
            description,
            siteName: "BoluShop",
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
        keywords: "comprar productos online argentina, catalogo bolushop, ofertas marketplace argentina, envios gratis",
    };
}

export default async function ProductosPage({ searchParams }: Props) {
    const allProducts = await getAllProducts();
    const holiday = getCurrentHoliday();
    const { categoria, coleccion, seccion, sort, price } = await searchParams;

    const activeProducts = allProducts.filter(product => product.isActive !== false);
    let filteredProducts = [...activeProducts];

    if (seccion === 'mercado-libre') {
        filteredProducts = filteredProducts.filter(product => product.isMlReferral);
    } else {
        filteredProducts = filteredProducts.filter(product => !product.isMlReferral);
    }

    let activeCollectionName = "";

    if (categoria) {
        filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === categoria.toLowerCase());
        activeCollectionName = categoria;
    } else if (coleccion) {
        const collections = await (await import("@/lib/db")).getAllCollections();
        const foundCollection = collections.find(collection => collection.id === coleccion || collection.slug === coleccion);

        if (foundCollection) {
            activeCollectionName = foundCollection.name;
            const collectionIds = foundCollection.productIds || [];
            filteredProducts = filteredProducts.filter(product =>
                collectionIds.includes(product.id) ||
                (product.collections && (product.collections.includes(foundCollection.id) || product.collections.includes(foundCollection.slug)))
            );
        } else {
            filteredProducts = filteredProducts.filter(product => product.collections?.includes(coleccion || ""));
        }
    }

    if (price) {
        switch (price) {
            case 'under_50000':
                filteredProducts = filteredProducts.filter(product => product.price <= 50000);
                break;
            case '50000_100000':
                filteredProducts = filteredProducts.filter(product => product.price > 50000 && product.price <= 100000);
                break;
            case 'over_100000':
                filteredProducts = filteredProducts.filter(product => product.price > 100000);
                break;
        }
    }

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
        filteredProducts = [...filteredProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const visibleProducts = seccion === 'mercado-libre'
        ? activeProducts.filter(product => product.isMlReferral)
        : activeProducts.filter(product => !product.isMlReferral);

    const categories = Array.from(new Set(visibleProducts.map(product => product.category))).sort();

    const displayTitle = seccion === 'mercado-libre'
        ? 'Imperdibles Mercado Libre'
        : (activeCollectionName ? `Colección ${activeCollectionName}` : 'Nuestra Tienda');

    const displaySubtitle = seccion === 'mercado-libre'
        ? 'Seleccionamos lo mejor de ML para que compres con la confianza de BoluShop.'
        : (holiday ? `Celebrá ${holiday.label} con nuestra selección exclusiva.` : 'Descubrí una selección curada de productos únicos.');

    const buildProductLink = (params: Partial<{ seccion: string; categoria: string; coleccion: string; price: string; sort: string }>) => {
        const queryParams = new URLSearchParams();
        if (params.seccion) queryParams.set('seccion', params.seccion);
        if (params.categoria) queryParams.set('categoria', params.categoria);
        if (params.coleccion) queryParams.set('coleccion', params.coleccion);
        if (params.price) queryParams.set('price', params.price);
        if (params.sort) queryParams.set('sort', params.sort);
        return `/productos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#f7f7f7]">
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white pt-20 pb-20">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <div className="max-w-4xl">
                            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white font-black mb-6">
                                {seccion === 'mercado-libre' ? 'Selección Especial' : 'Catálogo Exclusivo'}
                            </span>
                            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">{displayTitle}</h1>
                            <p className="max-w-3xl text-base md:text-lg text-white/80 leading-relaxed">{displaySubtitle}</p>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
                    <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between mb-6">
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={buildProductLink({ sort, price })}
                                className={`rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.35em] transition ${!seccion && !categoria ? 'bg-white text-[#0f2044]' : 'bg-[#f8fafb] text-[#64748b] hover:bg-white'}`}
                            >
                                Tienda Local
                            </Link>
                            <Link
                                href={buildProductLink({ seccion: 'mercado-libre', sort, price })}
                                className={`rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.35em] transition ${seccion === 'mercado-libre' ? 'bg-[#3483FA] text-white' : 'bg-[#f8fafb] text-[#64748b] hover:bg-white'}`}
                            >
                                Imperdibles ML
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-xs font-black uppercase tracking-[0.35em] text-[#64748b]">Ordenar por</div>
                            <ProductSorter />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                        <Link
                            href={buildProductLink({ seccion, sort, price })}
                            className={`inline-flex rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] transition ${!categoria ? 'bg-[#0f2044] text-white border-[#0f2044]' : 'bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#0f2044]'}`}
                        >
                            Todos
                        </Link>
                        {categories.map(category => (
                            <Link
                                key={category}
                                href={buildProductLink({ categoria: category, seccion, sort, price })}
                                className={`inline-flex rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] transition ${categoria === category ? 'bg-[#0f2044] text-white border-[#0f2044]' : 'bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#0f2044]'}`}
                            >
                                {category}
                            </Link>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
                        <aside className="space-y-5">
                            <div className="rounded-[2rem] bg-white border border-[#e2e8f0] p-6 shadow-sm">
                                <h2 className="text-sm font-black uppercase tracking-[0.35em] text-[#0f2044] mb-4">Precio</h2>
                                <div className="space-y-3 text-sm text-[#64748b]">
                                    <Link
                                        href={buildProductLink({ seccion, categoria, sort, price: 'under_50000' })}
                                        className={`flex items-center gap-3 rounded-full px-4 py-3 transition ${price === 'under_50000' ? 'bg-[#0f2044] text-white' : 'bg-[#f8fafb] text-[#64748b] hover:bg-white'}`}
                                    >
                                        <span>Hasta $50.000</span>
                                    </Link>
                                    <Link
                                        href={buildProductLink({ seccion, categoria, sort, price: '50000_100000' })}
                                        className={`flex items-center gap-3 rounded-full px-4 py-3 transition ${price === '50000_100000' ? 'bg-[#0f2044] text-white' : 'bg-[#f8fafb] text-[#64748b] hover:bg-white'}`}
                                    >
                                        <span>$50k – $100k</span>
                                    </Link>
                                    <Link
                                        href={buildProductLink({ seccion, categoria, sort, price: 'over_100000' })}
                                        className={`flex items-center gap-3 rounded-full px-4 py-3 transition ${price === 'over_100000' ? 'bg-[#0f2044] text-white' : 'bg-[#f8fafb] text-[#64748b] hover:bg-white'}`}
                                    >
                                        <span>Más de $100k</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="rounded-[2rem] bg-white border border-[#e2e8f0] p-6 shadow-sm">
                                <h2 className="text-sm font-black uppercase tracking-[0.35em] text-[#0f2044] mb-4">Categoría</h2>
                                <div className="space-y-2 text-sm text-[#64748b]">
                                    {categories.map(category => (
                                        <Link
                                            key={category}
                                            href={buildProductLink({ categoria: category, seccion, sort, price })}
                                            className={`flex items-center gap-3 rounded-full px-4 py-3 transition ${categoria === category ? 'bg-[#0f2044] text-white' : 'bg-[#f8fafb] text-[#64748b] hover:bg-white'}`}
                                        >
                                            <span>{category}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[2rem] bg-white border border-[#e2e8f0] p-6 shadow-sm">
                                <h2 className="text-sm font-black uppercase tracking-[0.35em] text-[#0f2044] mb-4">Envío</h2>
                                <p className="text-sm text-[#64748b]">El costo final de envío se calcula en el checkout según tu provincia y ciudad.</p>
                            </div>
                        </aside>

                        <div>
                            <div className="mb-6 flex flex-wrap gap-3">
                                {categoria && (
                                    <span className="inline-flex items-center rounded-full bg-[#eef3fb] border border-[#b5d4f4] px-3 py-2 text-[10px] font-semibold text-[#185fa5]">
                                        {categoria}
                                    </span>
                                )}
                                {seccion === 'mercado-libre' && (
                                    <span className="inline-flex items-center rounded-full bg-[#fff9e6] border border-[#f0c040] px-3 py-2 text-[10px] font-semibold text-[#c47a00]">
                                        Imperdibles ML
                                    </span>
                                )}
                                {(categoria || seccion === 'mercado-libre') && (
                                    <Link href="/productos" className="inline-flex items-center rounded-full bg-[#0f2044] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white">
                                        Limpiar filtros
                                    </Link>
                                )}
                            </div>

                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-[2.5rem] border border-dashed border-[#e2e8f0] bg-white p-12 text-center">
                                    <div className="text-6xl mb-6">🔍</div>
                                    <h2 className="text-3xl font-black text-[#0f2044] mb-4">No encontramos productos</h2>
                                    <p className="text-[#64748b] mb-8">Intentá con otra categoría o restablecé los filtros para ver nuestra selección completa.</p>
                                    <Link href="/productos" className="inline-flex items-center justify-center rounded-3xl bg-[#0f2044] px-8 py-4 text-white text-sm font-black uppercase tracking-[0.35em] hover:bg-[#0b1938]">
                                        Ver todo el catálogo
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
