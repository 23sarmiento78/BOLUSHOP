import { getAllProducts } from "@/lib/db";
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
        return {
            title: "Producto no encontrado | BoluShop",
        };
    }

    // Limpiar HTML de la descripción para los meta tags
    const cleanDescription = product.description
        .replace(/<[^>]*>?/gm, '') // Eliminar tags HTML
        .replace(/\s+/g, ' ')      // Normalizar espacios
        .trim();

    const seoDescription = cleanDescription.length > 160
        ? `${cleanDescription.slice(0, 157)}...`
        : cleanDescription;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com';
    const productUrl = `${siteUrl}/producto/${product.slug}`;

    // Extraer keywords de las características y nombre
    const featureKeywords = product.features?.slice(0, 5).join(', ') || '';
    const keywords = `${product.name}, ${product.category}, comprar ${product.name}, precio ${product.name}, bolushop argentina, ${featureKeywords}`.toLowerCase();

    return {
        title: `${product.name} | ${product.category} | BoluShop`,
        description: seoDescription,
        keywords: keywords,
        alternates: {
            canonical: productUrl,
        },
        openGraph: {
            type: 'website',
            url: productUrl,
            title: `Comprar ${product.name} en BoluShop Argentina`,
            description: seoDescription,
            images: [{
                url: product.image,
                width: 1200,
                height: 630,
                alt: product.name,
            }],
            siteName: 'BoluShop',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: seoDescription,
            images: [product.image],
        },
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

    return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
