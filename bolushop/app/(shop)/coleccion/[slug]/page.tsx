import { getCollectionBySlug, getAllProducts } from "@/lib/db";
import { notFound } from "next/navigation";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import CollectionDetailClient from "./CollectionDetailClient";
import ProductCard from "@/components/shop/ProductCard";
import type { Metadata } from "next";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const collection = await getCollectionBySlug(slug);

    if (!collection) {
        return {
            title: "Colección no encontrada | BoluShop",
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com';
    const collectionUrl = `${siteUrl}/coleccion/${collection.slug}`;

    return {
        title: `${collection.name} | Oferta Exclusiva Pack | BoluShop`,
        description: collection.description || `Ahorrá con el pack ${collection.name}. Productos seleccionados con envío gratis a todo Argentina en BoluShop.`,
        keywords: `${collection.name}, pack de productos, oferta argentina, bolushop colecciones, combo ahorro argentina`,
        alternates: {
            canonical: collectionUrl,
        },
        openGraph: {
            title: `Pack Oferta: ${collection.name} en BoluShop`,
            description: collection.description,
            type: 'website',
            url: collectionUrl,
            images: collection.image ? [{ url: collection.image }] : [],
        }
    };
}

export default async function CollectionPage({ params }: Props) {
    const { slug } = await params;
    const collection = await getCollectionBySlug(slug);

    if (!collection) {
        notFound();
    }

    const allProducts = await getAllProducts();
    const products = allProducts.filter(p =>
        p.isActive !== false &&
        (
            (collection.productIds || []).includes(p.id) ||
            (p.collections || []).includes(collection.id) ||
            (p.collections || []).includes(collection.slug)
        )
    );

    // Calculate Pricing
    const originalPrice = products.reduce((acc, p) => acc + p.price, 0);
    let totalPrice = originalPrice;

    if (collection.discountType === 'percentage' && collection.discountValue) {
        totalPrice = originalPrice * (1 - collection.discountValue / 100);
    } else if (collection.discountType === 'fixed' && collection.discountValue) {
        // En este sistema, el valor 'fijo' se toma como el precio TOTAL del pack
        totalPrice = collection.discountValue;
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white pt-32 pb-24">
                <div className="container mx-auto px-4">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-12">
                        <a href="/" className="hover:text-primary transition-colors">Inicio</a>
                        <span>/</span>
                        <a href="/productos" className="hover:text-primary transition-colors">Colecciones</a>
                        <span>/</span>
                        <span className="text-gray-900">{collection.name}</span>
                    </div>

                    <CollectionDetailClient
                        collection={collection}
                        products={products}
                        totalPrice={totalPrice}
                        originalPrice={originalPrice}
                    />

                    {/* What's Inside Section */}
                    <section className="mt-32">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                                    ¿Qué incluye este <span className="text-primary italic">Pack</span>?
                                </h2>
                                <p className="text-gray-500 font-medium max-w-xl">
                                    Obtené todos estos productos seleccionados con un descuento exclusivo por tiempo limitado.
                                </p>
                            </div>
                            <div className="bg-gray-50 px-8 py-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total de artículos</p>
                                    <p className="text-2xl font-black text-gray-900">{products.length}</p>
                                </div>
                                <div className="h-10 w-px bg-gray-200" />
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Estado</p>
                                    <p className="text-2xl font-black text-emerald-500">Disponible</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
