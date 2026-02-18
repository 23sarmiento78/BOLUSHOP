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

    // Dynamic keyword extraction from product content
    const nameKeywords = product.name.split(' ').filter(w => w.length > 3);
    const categoryKeyword = product.category || 'Regalos';
    const cleanDesc = product.description.replace(/<[^>]*>?/gm, '').trim();

    // Automated keywords for national positioning
    const dynamicKeywords = [
        ...nameKeywords,
        categoryKeyword,
        `comprar ${product.name} argentina`,
        `precio ${product.name}`,
        'envio gratis argentina',
        'regalos originales bolushop'
    ].join(', ').toLowerCase();

    const seoDescription = cleanDesc.slice(0, 155) + (cleanDesc.length > 155 ? '...' : '');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com';

    return {
        title: `Comprar ${product.name} | ${categoryKeyword} | BoluShop Argentina`,
        description: seoDescription,
        keywords: dynamicKeywords,
        openGraph: {
            title: `Oferta: ${product.name} - Envió Gratis en Argentina`,
            description: seoDescription,
            url: `${siteUrl}/producto/${product.slug}`,
            images: [{ url: product.image, alt: product.name }],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: seoDescription,
            images: [product.image],
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
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.image,
        "description": product.description.replace(/<[^>]*>?/gm, '').slice(0, 160),
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
            "itemCondition": "https://schema.org/NewCondition"
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
