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
    const productUrl = `${siteUrl}/producto/${product.slug}`;
    const imageUrls = [product.image, ...(product.images || [])].filter(Boolean);
    const categoryText = product.category ? product.category.toLowerCase() : 'uso diario';

    const cleanDescription = product.description
        ? product.description.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim()
        : '';
    const descriptionText = cleanDescription
        .replace(/^Características generales:\s*/i, '')
        .replace(/^Características generales\s*/i, '')
        .slice(0, 160);

    const metaDescription = descriptionText ||
        `${product.name} es un regalo ideal para ${categoryText}. Envío gratis a todo el país y pago seguro con cuotas sin interés.`;

    const pageTitle = `Comprar ${product.name} | BoluShop Argentina | Regalos originales`;

    return {
        metadataBase: new URL(siteUrl),
        title: pageTitle,
        description: metaDescription,
        alternates: {
            canonical: productUrl,
        },
        openGraph: {
            title: pageTitle,
            description: metaDescription,
            url: productUrl,
            siteName: 'BoluShop',
            locale: 'es_AR',
            images: imageUrls.map((url) => ({ url, alt: `${product.name} - foto del producto` })),
        },
        twitter: {
            card: 'summary_large_image',
            title: pageTitle,
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
