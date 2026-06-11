import { getCollectionBySlug, getAllProducts } from "@/lib/db";
import ProductCard from "@/components/shop/ProductCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const collection = await getCollectionBySlug(slug);

    if (!collection) {
        return buildPageMetadata({
            title: "Oferta no encontrada",
            description: "La oferta que buscás no está disponible.",
            path: `/oferta/${slug}`,
            noIndex: true,
        });
    }

    return buildPageMetadata({
        title: collection.name,
        description: collection.description || `Ofertas y descuentos: ${collection.name} en BoluShop.`,
        path: `/oferta/${collection.slug}`,
    });
}

export default async function OfertaPage({ params }: Props) {
    const { slug } = await params;
    const collection = await getCollectionBySlug(slug);

    if (!collection) {
        notFound();
    }

    const products = await getAllProducts();

    const offerProducts = products.filter(
        (product) =>
            (product.collections && product.collections.includes(collection.id)) ||
            (collection.productIds && collection.productIds.includes(product.id)),
    );

    return (
        <main className="min-h-screen bg-white">
            <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-8 md:py-12 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-4 text-xs text-gray-300">
                        <Link href="/" className="hover:text-white">Inicio</Link>
                        <ChevronRight size={14} />
                        <Link href="/ofertas" className="hover:text-white">Ofertas y descuentos</Link>
                        <ChevronRight size={14} />
                        <span>{collection.name}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{collection.name}</h1>
                    <p className="text-sm md:text-base text-gray-300">{collection.description}</p>
                    {collection.discountType && collection.discountType !== "none" && collection.discountValue ? (
                        <p className="mt-3 inline-flex rounded-full bg-[#ff6b35] px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                            {collection.discountType === "percentage"
                                ? `${collection.discountValue}% OFF`
                                : `$${collection.discountValue} OFF`}
                        </p>
                    ) : null}
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                {offerProducts.length === 0 ? (
                    <div className="text-center py-16 card">
                        <p className="text-[#64748b] text-sm md:text-base font-medium">
                            No hay productos en esta oferta por el momento.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {offerProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
