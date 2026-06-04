import { getAllCollections, getAllProducts } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { Metadata } from "next";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Colecciones Temáticas | BoluShop",
    description: "Explorá nuestras colecciones temáticas curadas especialmente para cada ocasión.",
};

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
    const collections = await getAllCollections();
    const allProducts = await getAllProducts();

    const getCollectionImage = (coll: any) => {
        if (coll.image && !coll.image.includes('icon.png')) return coll.image;
        if ((coll.productIds || []).length > 0) {
            const product = allProducts.find(p => coll.productIds.includes(p.id));
            if (product) return product.image;
        }
        return "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop";
    };

    return (
        <>
            <Header />

            <main className="min-h-screen bg-white">
                {/* Page Header */}
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-8 md:py-12 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-300">
                            <Link href="/" className="hover:text-white">Inicio</Link>
                            <ChevronRight size={14} />
                            <span>Colecciones</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Colecciones Temáticas</h1>
                        <p className="text-sm md:text-base text-gray-300">
                            Selecciones curadas especialmente para cada ocasión
                        </p>
                    </div>
                </section>

                {/* Collections Grid */}
                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                    {collections.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-[#64748b] text-sm">Aún no hay colecciones disponibles</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {collections.map(coll => (
                                <Link
                                    key={coll.id}
                                    href={`/coleccion/${coll.slug}`}
                                    className="group"
                                >
                                    <div className="card overflow-hidden h-full flex flex-col hover:shadow-lg">
                                        {/* Image */}
                                        <div className="relative bg-[#f8f9fb] overflow-hidden h-40 md:h-48">
                                            <Image
                                                src={getCollectionImage(coll)}
                                                alt={coll.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform"
                                            />
                                            {coll.discountValue && coll.discountValue > 0 && (
                                                <div className="absolute top-3 right-3 bg-[#e8630a] text-white text-xs font-bold px-3 py-1 rounded-md">
                                                    {coll.discountType === 'percentage' ? `-${coll.discountValue}%` : `$${coll.discountValue}`}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 flex-1 flex flex-col">
                                            <h3 className="text-sm md:text-base font-bold text-[#0f2044] mb-2 line-clamp-2 group-hover:text-[#e8630a] transition-colors">
                                                {coll.name}
                                            </h3>
                                            <p className="text-xs text-[#64748b] line-clamp-2 flex-1 mb-3">
                                                {coll.description || "Selección exclusiva"}
                                            </p>
                                            <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
                                                <span className="text-xs text-[#64748b]">
                                                    {(coll.productIds || []).length} productos
                                                </span>
                                                <span className="text-xs font-bold text-[#0f2044] group-hover:text-[#e8630a] transition-colors">
                                                    Ver →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </>
    );
}
