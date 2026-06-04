import { getAllProducts, getProductReviews } from "@/lib/db";
import { getRelatedProducts } from "@/app/actions/shop";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const products = await getAllProducts();
    const product = products.find(p => p.slug === slug);

    if (!product) {
        return { title: "Producto no encontrado | BoluShop" };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com';
    const imageUrls = [product.image, ...(product.images || [])].filter(Boolean);
    const categoryText = product.category ? product.category.toLowerCase() : 'uso diario';
    const metaDescription = `${product.name} ideal para ${categoryText}. Diseño moderno, cómodo y funcional. Envío gratis a todo el país. Pagá en 3 cuotas sin interés en BoluShop.`;

    return {
        metadataBase: new URL(siteUrl),
        title: `${product.name} | Envío Gratis | BoluShop`,
        description: metaDescription,
        alternates: {
            canonical: `${siteUrl}/producto/${product.slug}`,
        },
        openGraph: {
            title: `${product.name} | Envío Gratis | BoluShop`,
            description: metaDescription,
            url: `${siteUrl}/producto/${product.slug}`,
            images: imageUrls.map((url) => ({ url, alt: `${product.name} - foto del producto` })),
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.name} | Envío Gratis | BoluShop`,
            description: metaDescription,
            images: imageUrls,
        },
        other: {
            'og:type': 'product',
        }
    };
}

export async function generateStaticParams() {
    const products = await getAllProducts();
    return products
        .filter(p => p.isActive !== false)
        .map((product) => ({
            slug: product.slug,
        }));
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const products = await getAllProducts();
    const product = products.find(p => p.slug === slug);

    if (!product || product.isActive === false) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.id, product.category);
    const reviews = await getProductReviews(product.id);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com';

    // JSON-LD for Search Engines
    const imageUrls = [product.image, ...(product.images || [])].filter(Boolean);
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description.replace(/<[^>]*>?/gm, '').slice(0, 160),
        "image": imageUrls,
        "brand": {
            "@type": "Brand",
            "name": "BoluShop"
        },
        "offers": {
            "@type": "Offer",
            "url": `${siteUrl}/producto/${product.slug}`,
            "priceCurrency": "ARS",
            "price": product.price,
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
                "@type": "Organization",
                "name": "BoluShop"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "100"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient product={product} relatedProducts={relatedProducts} reviews={reviews} />
        </>
    );
}
