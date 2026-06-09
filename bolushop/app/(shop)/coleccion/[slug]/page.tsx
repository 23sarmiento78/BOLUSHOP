import { Suspense } from "react";
import { getCollectionBySlug, getAllProducts } from "@/lib/db";
import ProductCard from "@/components/shop/ProductCard";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
    const collection = await getCollectionBySlug(params.slug);
    if (!collection) return { title: 'Colección no encontrada' };
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com';
    const collectionUrl = `${siteUrl}/coleccion/${collection.slug}`;

    return {
        title: `${collection.name} | BoluShop`,
        description: collection.description || `Explora nuestra colección de ${collection.name} con excelentes ofertas.`,
        alternates: {
            canonical: collectionUrl,
        },
        openGraph: {
            type: 'website',
            locale: 'es_AR',
            url: collectionUrl,
            title: `${collection.name} | BoluShop`,
            description: collection.description || `Explora nuestra colección de ${collection.name} con excelentes ofertas.`,
            siteName: 'BoluShop',
        }
    };
}

export default async function CollectionPage({ params }: Props) {
    const collection = await getCollectionBySlug(params.slug);

    if (!collection) {
        notFound();
    }

    const products = await getAllProducts();

    const collectionProducts = products.filter(product =>
        (product.collections && product.collections.includes(collection.id)) ||
        (collection.productIds && collection.productIds.includes(product.id))
    );

    return (
        <>            <main className="min-h-screen bg-white">
                {/* Page Header */}
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-8 md:py-12 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-300">
                            <Link href="/" className="hover:text-white">Inicio</Link>
                            <ChevronRight size={14} />
                            <Link href="/colecciones" className="hover:text-white">Colecciones</Link>
                            <ChevronRight size={14} />
                            <span>{collection.name}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{collection.name}</h1>
                        <p className="text-sm md:text-base text-gray-300">
                            {collection.description}
                        </p>
                    </div>
                </section>

                {/* Collection Content */}
                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                    {collectionProducts.length === 0 ? (
                        <div className="text-center py-16 card">
                            <p className="text-[#64748b] text-sm md:text-base font-medium">No hay productos en esta colección por el momento.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                            {collectionProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </section>
            </main>        </>
    );
}
