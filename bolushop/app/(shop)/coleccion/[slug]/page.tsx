import { Suspense } from "react";
import { getCollectionBySlug, getAllProducts } from "@/lib/db";
import ProductCard from "@/components/shop/ProductCard";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { notFound } from "next/navigation";
import Image from "next/image";

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
    const collection = await getCollectionBySlug(params.slug);
    if (!collection) return { title: 'Colección no encontrada' };

    return {
        title: `${collection.name} | BoluShop`,
        description: collection.description || `Explora nuestra colección de ${collection.name} con excelentes ofertas.`
    };
}

export default async function CollectionPage({ params }: Props) {
    const collection = await getCollectionBySlug(params.slug);

    if (!collection) {
        notFound();
    }

    const products = await getAllProducts();

    // Filter products manually if the collection has custom productIds or use category logic depending on implementation.
    // Assuming simple mapping where product maps to collection id or products includes collection.id
    const collectionProducts = products.filter(product =>
        (product.collections && product.collections.includes(collection.id)) ||
        (collection.productIds && collection.productIds.includes(product.id))
    );

    return (
        <>
            <Header />
            <main className="min-h-screen pt-32 pb-24 bg-gray-50/30">
                <div className="container mx-auto px-6">
                    <div className="mb-12">
                        {collection.image && (
                            <div className="w-full h-64 md:h-80 relative rounded-3xl overflow-hidden mb-8 shadow-xl">
                                <Image
                                    src={collection.image}
                                    alt={collection.name}
                                    fill
                                    className="object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <h1 className="text-4xl md:text-6xl font-black text-white text-center tracking-tighter drop-shadow-md">
                                        {collection.name}
                                    </h1>
                                </div>
                            </div>
                        )}
                        {!collection.image && (
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
                                {collection.name}
                            </h1>
                        )}
                        <p className="text-gray-500 text-lg md:text-xl font-medium max-w-3xl">
                            {collection.description}
                        </p>
                    </div>

                    {collectionProducts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                            <p className="text-gray-500 text-xl font-medium">No hay productos en esta colección por el momento.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {collectionProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
